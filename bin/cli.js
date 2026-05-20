#!/usr/bin/env node
/**
 * CodexMono CLI - install bundled font families intentionally.
 * Root command shows the command map. Installation is explicit.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const packageJson = require("../package.json");

const cyan = "\x1b[96m";
const green = "\x1b[92m";
const yellow = "\x1b[93m";
const red = "\x1b[91m";
const gray = "\x1b[90m";
const reset = "\x1b[0m";
const bold = "\x1b[1m";
const headerWidth = 52;

const platform = os.platform();

const argv = process.argv.slice(2);
const command = argv[0] || "help";
const flagSet = new Set(argv.filter((a) => a.startsWith("--")));
const positionals = argv.slice(1).filter((a) => !a.startsWith("-"));
const rawTarget = positionals[0];
const rawTarget2 = positionals[1];
const jsonOut = flagSet.has("--json");
const wantWoff2 = flagSet.has("--woff2");

// Rich per-variant metadata — single source of truth for info/path/css/verify.
const fontMeta = require("../index.js").fonts;
const metaByFile = {};
for (const metaKey of Object.keys(fontMeta)) {
  const m = fontMeta[metaKey];
  metaByFile[path.basename(m.ttf)] = Object.assign({ key: metaKey }, m);
}

function woff2SourceFor(entry) {
  const m = metaByFile[entry.file];
  if (m && m.woff2) {
    return path.join(__dirname, "..", m.woff2.replace(/^\.\//, ""));
  }
  return entry.source.replace("/ttf/", "/woff2/").replace(/\.ttf$/, ".woff2");
}

function makeEntry(relativeParts, file) {
  return {
    file,
    source: path.join(__dirname, "..", "fonts", ...relativeParts, file),
  };
}

const fontGroups = {
  core: {
    label: "Core Fonts",
    description: "Base CodexMono families for Latin and CJK coverage.",
    entries: [
      makeEntry(["ttf"], "CodexMono.ttf"),
      makeEntry(["ttf"], "CodexMono-KR.ttf"),
      makeEntry(["ttf"], "CodexMono-EA.ttf"),
      makeEntry(["ttf"], "CodexMono-Traditional.ttf"),
    ],
  },
  nerd: {
    label: "Nerd Fonts",
    description: "Compatibility-layer families with terminal symbol coverage.",
    entries: [
      makeEntry(["nerd", "ttf"], "CodexMono-Nerd.ttf"),
      makeEntry(["nerd", "ttf"], "CodexMono-KR-Nerd.ttf"),
      makeEntry(["nerd", "ttf"], "CodexMono-EA-Nerd.ttf"),
      makeEntry(["nerd", "ttf"], "CodexMono-Traditional-Nerd.ttf"),
    ],
  },
  hermes: {
    label: "Set of Hermes",
    description: "Messenger-family build: Nerd + emoji + more Unicode.",
    entries: [
      makeEntry(["hermes", "ttf"], "CodexMono-Hermes.ttf"),
      makeEntry(["hermes", "ttf"], "CodexMono-KR-Hermes.ttf"),
      makeEntry(["hermes", "ttf"], "CodexMono-EA-Hermes.ttf"),
      makeEntry(["hermes", "ttf"], "CodexMono-Traditional-Hermes.ttf"),
    ],
  },
};

const targetAliases = {
  base: "core",
  default: "core",
};

function targetNamesFor(target) {
  if (target === "all") {
    return ["core", "nerd", "hermes"];
  }

  return [target];
}

function resolveTarget(raw, fallback) {
  const candidate = raw ? raw.toLowerCase() : fallback;
  const normalized = targetAliases[candidate] || candidate;

  if (
    normalized === "all" ||
    Object.prototype.hasOwnProperty.call(fontGroups, normalized)
  ) {
    return normalized;
  }

  console.log(red + `\n  Unknown target: ${raw}\n` + reset);
  console.log(gray + "  Valid targets: core, nerd, hermes, all\n" + reset);
  process.exit(1);
}

function entriesFor(target) {
  return targetNamesFor(target).flatMap((name) => fontGroups[name].entries);
}

function getSystemFontDir() {
  if (platform === "darwin") {
    return path.join(os.homedir(), "Library", "Fonts");
  }

  if (platform === "linux") {
    return path.join(os.homedir(), ".local", "share", "fonts");
  }

  if (platform === "win32") {
    return "C:\\Windows\\Fonts";
  }

  return null;
}

function ensureFontDir(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
}

function copyEntries(entries, targetDir) {
  let installedCount = 0;

  entries.forEach((entry) => {
    const target = path.join(targetDir, entry.file);
    if (!fs.existsSync(entry.source)) {
      console.log(yellow + `  ! Missing package file ${entry.file}` + reset);
      return;
    }

    fs.copyFileSync(entry.source, target);
    console.log(green + `  ✓ ${entry.file}` + reset);
    installedCount += 1;
  });

  return installedCount;
}

function removeEntries(entries, targetDir) {
  let removedCount = 0;

  entries.forEach((entry) => {
    const target = path.join(targetDir, entry.file);
    if (!fs.existsSync(target)) {
      console.log(
        gray + `  ○ ${entry.file}` + reset + gray + " (not installed)" + reset,
      );
      return;
    }

    fs.unlinkSync(target);
    console.log(green + `  ✓ Removed ${entry.file}` + reset);
    removedCount += 1;
  });

  return removedCount;
}

function refreshLinuxFontCache() {
  console.log(gray + "\n  Refreshing font cache..." + reset);
  execSync("fc-cache -f -v", { stdio: "ignore" });
}

function stripTerminalFormatting(text) {
  return text
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/\x1b\]8;;[^\x07]*\x07/g, "")
    .replace(/\x1b\]8;;\x07/g, "");
}

function visibleLength(text) {
  return stripTerminalFormatting(text).length;
}

function padRight(text, width = headerWidth) {
  const length = visibleLength(text);

  if (length >= width) {
    return text;
  }

  return text + " ".repeat(width - length);
}

function boxTop() {
  return "╔" + "═".repeat(headerWidth) + "╗";
}

function boxBottom() {
  return "╚" + "═".repeat(headerWidth) + "╝";
}

function boxLine(text = "") {
  return `║${padRight(text)}║`;
}

function installFonts(raw) {
  const target = resolveTarget(raw, "core");
  const entries = entriesFor(target);
  const targetDir = getSystemFontDir();
  const targetLabel = target === "all" ? "All Fonts" : fontGroups[target].label;

  if (!targetDir) {
    console.log(red + `  Unsupported platform: ${platform}` + reset);
    process.exit(1);
  }

  console.log(
    cyan + bold + `\n  CodexMono Installer - ${targetLabel}\n` + reset,
  );
  console.log(
    gray +
      `  ${fontGroups[target] ? fontGroups[target].description : "Install every bundled family."}` +
      reset,
  );

  try {
    if (platform !== "win32") {
      ensureFontDir(targetDir);
    }

    if (platform === "win32") {
      console.log(
        yellow +
          "  Windows font installation requires administrator rights.\n" +
          reset,
      );
      console.log("  Please run PowerShell as Administrator and execute:\n");
      entries.forEach((entry) => {
        const source = entry.source.replace(/\\/g, "\\\\");
        console.log(
          gray + `    Copy-Item "${source}" "${targetDir}\\\\"` + reset,
        );
      });
      console.log("");
      return;
    }

    console.log(gray + `  Installing to: ${targetDir}\n` + reset);
    const installedCount = copyEntries(entries, targetDir);

    if (platform === "linux") {
      refreshLinuxFontCache();
    }

    console.log(
      green + bold + `\n  Installed ${installedCount} font files.\n` + reset,
    );
    console.log(
      gray + `  Next: ${cyan}codexmono list ${target}${reset}` + "\n",
    );
  } catch (error) {
    console.log(red + `\n  Installation failed: ${error.message}\n` + reset);
    process.exit(1);
  }
}

function uninstallFonts(raw) {
  // Default to "all": a bare `codexmono uninstall` removes every CodexMono
  // family, matching user intent to fully remove the fonts (install defaults
  // to the minimal "core").
  const target = resolveTarget(raw, "all");
  const entries = entriesFor(target);
  const targetDir = getSystemFontDir();
  const targetLabel = target === "all" ? "All Fonts" : fontGroups[target].label;

  if (!targetDir) {
    console.log(red + `  Unsupported platform: ${platform}` + reset);
    process.exit(1);
  }

  console.log(
    cyan + bold + `\n  CodexMono Uninstaller - ${targetLabel}\n` + reset,
  );

  try {
    if (platform === "win32") {
      console.log(
        yellow +
          "  Windows font uninstallation requires administrator rights.\n" +
          reset,
      );
      console.log(`  Remove these files manually from ${targetDir}\\\n`);
      entries.forEach((entry) =>
        console.log(gray + `    ${entry.file}` + reset),
      );
      console.log("");
      return;
    }

    const removedCount = removeEntries(entries, targetDir);

    if (platform === "linux" && removedCount > 0) {
      refreshLinuxFontCache();
    }

    console.log("");
    if (removedCount > 0) {
      console.log(
        green + bold + `  Removed ${removedCount} font files.\n` + reset,
      );
    } else {
      console.log(yellow + "  No matching fonts were installed.\n" + reset);
    }
  } catch (error) {
    console.log(red + `\n  Uninstallation failed: ${error.message}\n` + reset);
    process.exit(1);
  }
}

function listFonts(raw) {
  const target = resolveTarget(raw, "all");
  const targetDir = getSystemFontDir();

  if (!targetDir) {
    console.log(red + `  Unsupported platform: ${platform}` + reset);
    process.exit(1);
  }

  console.log(cyan + bold + "\n  CodexMono Font Status\n" + reset);
  console.log(gray + `  System font directory: ${targetDir}\n` + reset);

  let installedCount = 0;
  let totalCount = 0;

  targetNamesFor(target).forEach((name) => {
    const group = fontGroups[name];
    console.log(bold + `  ${group.label}` + reset);
    group.entries.forEach((entry) => {
      totalCount += 1;
      const installed = fs.existsSync(path.join(targetDir, entry.file));
      if (installed) {
        installedCount += 1;
        console.log(green + `    ✓ ${entry.file}` + reset);
      } else {
        console.log(gray + `    ○ ${entry.file}` + reset);
      }
    });
    console.log("");
  });

  if (installedCount === totalCount) {
    console.log(
      green + `  All ${totalCount} checked font files are installed.\n` + reset,
    );
  } else if (installedCount === 0) {
    console.log(
      gray +
        `  No matching fonts installed. Run ${cyan}codexmono install ${target === "all" ? "core" : target}${reset}` +
        "\n",
    );
  } else {
    console.log(
      yellow +
        `  ${installedCount}/${totalCount} checked font files are installed.\n` +
        reset,
    );
  }
}

function showHelp() {
  const header = [
    boxTop(),
    boxLine(""),
    boxLine("   █▀▀▀ █▀▀█ █▀▀▄ █▀▀▀ ▀█ █▀ █▄ ▄█ █▀▀█ █▀▀▄ █▀▀█"),
    boxLine("   █    █  █ █  █ █▀▀   ▄▀▄  █ ▀ █ █  █ █  █ █  █"),
    boxLine("   ▀▀▀▀ ▀▀▀▀ ▀▀▀  ▀▀▀▀ ▀▀ ▀▀ ▀   ▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀"),
    boxLine(""),
    boxLine("   True Monospace Font Hub"),
    boxLine("   Core Fonts / Nerd Fonts / Set of Hermes"),
    boxLine("   by Monolex https://monolex.ai"),
    boxLine(""),
    boxBottom(),
  ];

  console.log("");
  console.log(bold + header.join("\n") + reset);
  console.log("");
  console.log(`CODEXMONO v${packageJson.version}`);
  console.log("USAGE: codexmono <COMMAND> [TARGET]");
  console.log("");
  console.log(bold + "PHILOSOPHY" + reset);
  console.log("");
  console.log(cyan + "    The CodexMono Philosophy\n" + reset);
  console.log(bold + "    This is not a font. This is a brick.\n" + reset);
  console.log(gray + "    One brick = 600 units = One unit of trust" + reset);
  console.log(gray + "    Two bricks = 1200 units (East Asia characters)\n" + reset);
  console.log(bold + "    SMPC: Simplicity is Managed Part Chaos\n" + reset);
  console.log(gray + "    SIMPLE = MANAGED(PART(CHAOS))" + reset);
  console.log(gray + "    • CHAOS:   All possible glyphs" + reset);
  console.log(gray + "    • PART:    Only needed characters" + reset);
  console.log(gray + "    • MANAGED: 600 units ONLY" + reset);
  console.log(gray + "    • SIMPLE:  Perfect alignment guaranteed\n" + reset);
  console.log(bold + "    The Trust Contract\n" + reset);
  console.log(
    gray +
      '    To the AI:    "Do not wrap. Do not float. Stay in the box."' +
      reset,
  );
  console.log(
    gray +
      '    To the Human: "You are laying bricks. Layout is shape of memory."\n' +
      reset,
  );
  console.log(
    gray +
      "    CodexMono is the bridge between machine precision and human readability." +
      reset,
  );
  console.log(
    gray + "    Alignment = Trust = Structure = Shared Reality\n" + reset,
  );
  console.log(bold + "    The Foundational Project of Monolex\n" + reset);
  console.log(
    gray +
      "    CodexMono began as the foundational project that shaped Monolex itself." +
      reset,
  );
  console.log(
    gray +
      "    For the ultimate experience, we recommend using Monolex AI Terminal:\n" +
      reset,
  );
  console.log(
    gray + "                           ┌─────────────────┐" + reset,
  );
  console.log(
    gray + "                           │   CodexMono     │" + reset,
  );
  console.log(
    gray + "                           │  (600 units)    │" + reset,
  );
  console.log(
    gray + "                           └────────┬────────┘" + reset,
  );
  console.log(gray + "                                    │" + reset);
  console.log(
    gray + "                          ┌─────────▼─────────┐" + reset,
  );
  console.log(
    gray + "                          │  Trust Contract   │" + reset,
  );
  console.log(
    gray + "                          │  SMPC Philosophy  │" + reset,
  );
  console.log(
    gray + "                          └─────────┬─────────┘" + reset,
  );
  console.log(gray + "                                    │" + reset);
  console.log(
    gray + "                          ┌─────────▼─────────┐" + reset,
  );
  console.log(
    gray + "                          │ Monolex Terminal  │" + reset,
  );
  console.log(
    gray + "                          │ (AI Interaction)  │" + reset,
  );
  console.log(
    gray + "                          └─────────┬─────────┘" + reset,
  );
  console.log(gray + "                                    │" + reset);
  console.log(gray + "                                    ▼" + reset);
  console.log(
    gray + "                          Perfect Shared Reality" + reset,
  );
  console.log(gray + "                          Human ←→ AI Bridge\n" + reset);
  console.log(gray + "    Why Monolex?" + reset);
  console.log(
    gray + "    • Built specifically for CodexMono's philosophy" + reset,
  );
  console.log(
    gray +
      "    • AI-first terminal where Trust Contract is honored" +
      reset,
  );
  console.log(
    gray + "    • Every alignment preserved, every brick respected" + reset,
  );
  console.log(
    gray + "    • Perfect environment for SMPC principles\n" + reset,
  );
  console.log(gray + "    Learn more: https://monolex.ai" + reset);
  console.log("");
  console.log(bold + "FAMILIES" + reset);
  console.log(
    gray +
      "  core          " +
      reset +
      "- Core Fonts for base CodexMono variable coverage",
  );
  console.log(
    gray +
      "  nerd          " +
      reset +
      "- Nerd Fonts for compatibility-layer symbols",
  );
  console.log(
    gray +
      "  hermes        " +
      reset +
      "- Set of Hermes: Nerd + emoji + more Unicode",
  );
  console.log(
    gray +
      "  all           " +
      reset +
      "- Install Core Fonts, Nerd Fonts, and Set of Hermes",
  );
  console.log("");
  console.log(bold + "COMMANDS" + reset);
  console.log(
    cyan +
      "  codexmono install <target>" +
      reset +
      gray +
      "   Install selected family" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono uninstall <target>" +
      reset +
      gray +
      " Remove selected family" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono list [target]" +
      reset +
      gray +
      "      Show install status (default: all)" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono info [target]" +
      reset +
      gray +
      "      Show family metadata (chars, size, paths)" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono path <target>" +
      reset +
      gray +
      "      Print font file paths (--woff2 for web)" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono css [target]" +
      reset +
      gray +
      "       Print @font-face CSS for web use" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono verify [target]" +
      reset +
      gray +
      "    Check SHA256 against CHECKSUMS.md" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono config <editor>" +
      reset +
      gray +
      "    Editor/terminal config snippet" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono doctor" +
      reset +
      gray +
      "             Diagnose install + integrity" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono which <char>" +
      reset +
      gray +
      "       Which families contain a character" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono chars <text>" +
      reset +
      gray +
      "       Per-character coverage report" +
      reset,
  );
  console.log(
    cyan +
      "  codexmono version" +
      reset +
      gray +
      "            Show CLI version" +
      reset,
  );
  console.log("");
  console.log(bold + "FLAGS" + reset);
  console.log(
    gray + "  --json     Machine-readable output (info, verify, which, chars)" + reset,
  );
  console.log(gray + "  --woff2    Use WOFF2 paths (path command)" + reset);
  console.log("");
  console.log(bold + "START HERE" + reset);
  console.log(yellow + "  codexmono" + reset);
  console.log(yellow + "  codexmono install core" + reset);
  console.log(yellow + "  codexmono install hermes" + reset);
  console.log(yellow + "  codexmono list all" + reset);
  console.log(yellow + "  npx @monolex/codexmono install all" + reset);
  console.log("");
  console.log(`PACKAGE  @monolex/codexmono`);
  console.log(`WEBSITE  https://monolex.ai/with/codexmono`);
  console.log(`REPO     https://github.com/monolex/codexmono`);
  console.log("");
  console.log("Lay the brick first, then choose the family.");
  console.log("");
}

function showVersion() {
  console.log(cyan + `  CodexMono v${packageJson.version}\n` + reset);
}

function infoFonts(raw) {
  const target = resolveTarget(raw, "all");
  const entries = entriesFor(target);

  if (jsonOut) {
    const out = entries.map((entry) => {
      const m = metaByFile[entry.file] || {};
      return {
        family: m.name || entry.file.replace(/\.ttf$/, ""),
        file: entry.file,
        characters: m.characters != null ? m.characters : null,
        size: m.size || null,
        description: m.description || null,
        ttf: entry.source,
        woff2: woff2SourceFor(entry),
      };
    });
    console.log(JSON.stringify(out, null, 2));
    return;
  }

  console.log(cyan + bold + `\n  CodexMono Font Info - ${target}\n` + reset);
  entries.forEach((entry) => {
    const m = metaByFile[entry.file] || {};
    console.log(bold + `  ${m.name || entry.file}` + reset);
    console.log(gray + `    file:  ${entry.file}` + reset);
    if (m.characters != null)
      console.log(gray + `    chars: ${m.characters.toLocaleString()}` + reset);
    if (m.size) console.log(gray + `    size:  ${m.size}` + reset);
    if (m.description) console.log(gray + `    ${m.description}` + reset);
    console.log("");
  });
}

function pathFonts(raw) {
  const target = resolveTarget(raw, "core");
  entriesFor(target).forEach((entry) => {
    console.log(wantWoff2 ? woff2SourceFor(entry) : entry.source);
  });
}

function cssFonts(raw) {
  const target = resolveTarget(raw, "all");
  const blocks = entriesFor(target).map((entry) => {
    const m = metaByFile[entry.file] || {};
    const family = m.name || entry.file.replace(/\.ttf$/, "");
    const woff2 = m.woff2 || `./fonts/ttf/${entry.file}`;
    const ttf = m.ttf || `./fonts/ttf/${entry.file}`;
    return [
      "@font-face {",
      `  font-family: '${family}';`,
      `  src: url('${woff2}') format('woff2'),`,
      `       url('${ttf}') format('truetype');`,
      "  font-weight: 100 800;",
      "  font-style: normal;",
      "  font-display: swap;",
      "}",
    ].join("\n");
  });
  console.log(blocks.join("\n\n"));
}

function sha256File(file) {
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function parseChecksums() {
  const file = path.join(__dirname, "..", "docs", "CHECKSUMS.md");
  const map = {};
  if (!fs.existsSync(file)) return map;
  const re = /^([0-9a-f]{64})\s+(\S+\.(?:ttf|woff2))\s*$/gim;
  const text = fs.readFileSync(file, "utf8");
  let m;
  while ((m = re.exec(text)) !== null) {
    map[m[2]] = m[1].toLowerCase();
  }
  return map;
}

function verifyFonts(raw) {
  const target = resolveTarget(raw, "all");
  const checksums = parseChecksums();

  const files = [];
  entriesFor(target).forEach((entry) => {
    files.push({ file: entry.file, source: entry.source });
    const woff2Source = woff2SourceFor(entry);
    files.push({ file: path.basename(woff2Source), source: woff2Source });
  });

  const results = files.map(({ file, source }) => {
    const expected = checksums[file];
    if (!fs.existsSync(source)) return { file, status: "missing" };
    const actual = sha256File(source);
    if (!expected) return { file, status: "no-checksum", actual };
    return { file, status: actual === expected ? "ok" : "mismatch", expected, actual };
  });

  if (jsonOut) {
    console.log(JSON.stringify(results, null, 2));
    if (results.some((r) => r.status === "mismatch" || r.status === "missing")) {
      process.exit(1);
    }
    return;
  }

  console.log(cyan + bold + `\n  CodexMono Integrity Verify - ${target}\n` + reset);
  let ok = 0;
  let bad = 0;
  results.forEach((r) => {
    if (r.status === "ok") {
      console.log(green + `  ✓ ${r.file}` + reset);
      ok += 1;
    } else if (r.status === "mismatch") {
      console.log(red + `  ✗ ${r.file} (SHA256 mismatch)` + reset);
      bad += 1;
    } else if (r.status === "missing") {
      console.log(yellow + `  ! ${r.file} (file missing)` + reset);
      bad += 1;
    } else {
      console.log(gray + `  ? ${r.file} (no checksum on record)` + reset);
    }
  });

  console.log("");
  if (bad === 0) {
    console.log(
      green + bold + `  Verified ${ok} files against CHECKSUMS.md.\n` + reset,
    );
  } else {
    console.log(red + bold + `  ${bad} integrity problem(s) found.\n` + reset);
    process.exit(1);
  }
}

function configFor(editorArg, target) {
  const editor = (editorArg || "").toLowerCase();
  const familyByTarget = {
    core: "CodexMono",
    nerd: "CodexMono Nerd",
    hermes: "CodexMono Hermes",
  };
  const fam = target && familyByTarget[target] ? familyByTarget[target] : "CodexMono EA";
  const escVim = fam.replace(/ /g, "\\ ");

  const editors = {
    vscode: () =>
      "// VS Code settings.json\n" +
      JSON.stringify(
        {
          "editor.fontFamily": `'${fam}', monospace`,
          "editor.fontLigatures": false,
          "terminal.integrated.fontFamily": fam,
        },
        null,
        2,
      ),
    kitty: () => `# kitty.conf\nfont_family ${fam}\nfont_size 13.0`,
    alacritty: () =>
      `# alacritty.toml\n[font]\nsize = 13.0\n\n[font.normal]\nfamily = "${fam}"\nstyle = "Regular"`,
    wezterm: () =>
      `-- wezterm.lua\nconfig.font = wezterm.font("${fam}")\nconfig.font_size = 13.0`,
    ghostty: () => `# ghostty config\nfont-family = ${fam}\nfont-size = 13`,
    vim: () => `" .vimrc (GUI)\nset guifont=${escVim}:h14`,
    neovim: () => `-- init.lua (GUI)\nvim.o.guifont = "${fam}:h14"`,
    iterm2: () =>
      `iTerm2 (GUI):\n  Settings -> Profiles -> Text -> Font\n  Font: ${fam}    Size: 13`,
    jetbrains: () =>
      `JetBrains IDEs (GUI):\n  Settings -> Editor -> Font\n  Font: ${fam}    Size: 14`,
    terminal: () =>
      `macOS Terminal (GUI):\n  Settings -> Profiles -> Text -> Font -> Change...\n  Family: ${fam}    Size: 13`,
  };

  if (!editors[editor]) {
    console.log(red + `\n  Unknown editor: ${editorArg || "(none)"}\n` + reset);
    console.log(
      gray + "  Supported: " + Object.keys(editors).join(", ") + "\n" + reset,
    );
    console.log(gray + "  Usage: codexmono config <editor> [core|nerd|hermes]\n" + reset);
    process.exit(1);
  }

  console.log("");
  console.log(editors[editor]());
  console.log("");
}

function doctorCheck() {
  console.log(cyan + bold + "\n  CodexMono Doctor\n" + reset);
  const targetDir = getSystemFontDir();
  let problems = 0;

  if (!targetDir) {
    console.log(red + `  ✗ Unsupported platform: ${platform}` + reset);
    process.exit(1);
  }

  const dirExists = fs.existsSync(targetDir);
  console.log(
    (dirExists ? green + "  ✓" : yellow + "  !") +
      ` system font dir: ${targetDir}` +
      (dirExists ? "" : " (created on first install)") +
      reset,
  );

  ["core", "nerd", "hermes"].forEach((fam) => {
    const entries = fontGroups[fam].entries;
    const installed = entries.filter((e) =>
      fs.existsSync(path.join(targetDir, e.file)),
    ).length;
    const mark =
      installed === entries.length
        ? green + "  ✓"
        : installed > 0
          ? yellow + "  ◐"
          : gray + "  ○";
    console.log(
      `${mark} ${fontGroups[fam].label}: ${installed}/${entries.length} installed` +
        reset,
    );
  });

  const checksums = parseChecksums();
  let pkgMissing = 0;
  let pkgBad = 0;
  let pkgTotal = 0;
  entriesFor("all").forEach((entry) => {
    [entry.source, woff2SourceFor(entry)].forEach((src) => {
      pkgTotal += 1;
      const base = path.basename(src);
      if (!fs.existsSync(src)) {
        pkgMissing += 1;
        return;
      }
      const exp = checksums[base];
      if (exp && sha256File(src) !== exp) pkgBad += 1;
    });
  });
  if (pkgMissing === 0 && pkgBad === 0) {
    console.log(
      green +
        `  ✓ package integrity: ${pkgTotal}/${pkgTotal} files present and matching CHECKSUMS.md` +
        reset,
    );
  } else {
    console.log(
      red +
        `  ✗ package integrity: ${pkgMissing} missing, ${pkgBad} mismatched (run: codexmono verify all)` +
        reset,
    );
    problems += 1;
  }

  if (platform === "linux") {
    const { execFileSync } = require("child_process");
    try {
      execFileSync("which", ["fc-cache"], { stdio: "ignore" });
      console.log(green + "  ✓ fontconfig (fc-cache) available" + reset);
    } catch (_) {
      console.log(
        yellow + "  ! fontconfig (fc-cache) not found — installs may not register" + reset,
      );
    }
  }

  if (dirExists) {
    const known = new Set(entriesFor("all").map((e) => e.file));
    const stray = fs
      .readdirSync(targetDir)
      .filter((f) => /^CodexMono.*\.(ttf|otf)$/i.test(f) && !known.has(f));
    if (stray.length) {
      console.log(
        yellow +
          `  ! ${stray.length} non-bundled CodexMono font(s) in system dir: ${stray.join(", ")}` +
          reset,
      );
    } else {
      console.log(green + "  ✓ no stray/foreign CodexMono fonts in system dir" + reset);
    }
  }

  console.log("");
  if (problems === 0) {
    console.log(green + bold + "  Healthy. No critical problems.\n" + reset);
  } else {
    console.log(red + bold + `  ${problems} problem(s) need attention.\n` + reset);
    process.exit(1);
  }
}

// --- Minimal self-contained TrueType cmap reader (no native deps) ---
function locateCmap(buf) {
  if (!buf || buf.length < 12) return null;
  const numTables = buf.readUInt16BE(4);
  let cmapOff = 0;
  for (let i = 0; i < numTables; i += 1) {
    const rec = 12 + i * 16;
    if (buf.toString("latin1", rec, rec + 4) === "cmap") {
      cmapOff = buf.readUInt32BE(rec + 8);
      break;
    }
  }
  if (!cmapOff || cmapOff + 4 > buf.length) return null;

  const numSub = buf.readUInt16BE(cmapOff + 2);
  let best = null;
  let bestScore = -1;
  for (let i = 0; i < numSub; i += 1) {
    const rec = cmapOff + 4 + i * 8;
    const platformID = buf.readUInt16BE(rec);
    const encodingID = buf.readUInt16BE(rec + 2);
    const subOffset = cmapOff + buf.readUInt32BE(rec + 4);
    if (subOffset + 2 > buf.length) continue;
    const format = buf.readUInt16BE(subOffset);
    if (format !== 4 && format !== 12) continue;
    let score = 0;
    if (platformID === 3 && encodingID === 10) score = 5;
    else if (platformID === 0 && encodingID >= 4) score = 4;
    else if (platformID === 3 && encodingID === 1) score = 3;
    else if (platformID === 0) score = 2;
    if (format === 12) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = { subOffset, format };
    }
  }
  return best;
}

function cmapHas(buf, loc, cp) {
  if (!loc) return false;
  if (loc.format === 12) {
    const off = loc.subOffset;
    const nGroups = buf.readUInt32BE(off + 12);
    let lo = 0;
    let hi = nGroups - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const g = off + 16 + mid * 12;
      const startC = buf.readUInt32BE(g);
      const endC = buf.readUInt32BE(g + 4);
      if (cp < startC) hi = mid - 1;
      else if (cp > endC) lo = mid + 1;
      else return true;
    }
    return false;
  }
  if (loc.format === 4) {
    if (cp > 0xffff) return false;
    const off = loc.subOffset;
    const segX2 = buf.readUInt16BE(off + 6);
    const segCount = segX2 / 2;
    const endO = off + 14;
    const startO = endO + segX2 + 2;
    const deltaO = startO + segX2;
    const rangeO = deltaO + segX2;
    for (let s = 0; s < segCount; s += 1) {
      const end = buf.readUInt16BE(endO + s * 2);
      if (cp > end) continue;
      const start = buf.readUInt16BE(startO + s * 2);
      if (cp < start) return false;
      const delta = buf.readUInt16BE(deltaO + s * 2);
      const rangeOffset = buf.readUInt16BE(rangeO + s * 2);
      let glyph;
      if (rangeOffset === 0) {
        glyph = (cp + delta) & 0xffff;
      } else {
        const gi = rangeO + s * 2 + rangeOffset + (cp - start) * 2;
        if (gi + 1 >= buf.length) return false;
        glyph = buf.readUInt16BE(gi);
        if (glyph !== 0) glyph = (glyph + delta) & 0xffff;
      }
      return glyph !== 0;
    }
    return false;
  }
  return false;
}

function loadCmaps(entries) {
  return entries
    .map((entry) => {
      const m = metaByFile[entry.file] || {};
      let buf = null;
      let loc = null;
      try {
        buf = fs.readFileSync(entry.source);
        loc = locateCmap(buf);
      } catch (_) {
        buf = null;
      }
      return { file: entry.file, family: m.name || entry.file, loc, buf };
    })
    .filter((x) => x.buf && x.loc);
}

function parseCodepoint(arg) {
  const m = /^(?:u\+|0x)([0-9a-f]{1,6})$/i.exec(arg);
  if (m) return parseInt(m[1], 16);
  return arg.codePointAt(0);
}

function fmtCp(cp) {
  return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
}

function whichChar(arg) {
  if (!arg) {
    console.log(red + "\n  Usage: codexmono which <char|U+XXXX>\n" + reset);
    process.exit(1);
  }
  const cp = parseCodepoint(arg);
  const ch = String.fromCodePoint(cp);
  const fonts = loadCmaps(entriesFor("all"));
  const hits = fonts.filter((f) => cmapHas(f.buf, f.loc, cp));

  if (jsonOut) {
    console.log(
      JSON.stringify(
        { input: arg, codepoint: fmtCp(cp), char: ch, covered_by: hits.map((h) => h.file) },
        null,
        2,
      ),
    );
    return;
  }

  console.log(cyan + bold + `\n  which "${ch}"  (${fmtCp(cp)})\n` + reset);
  if (hits.length === 0) {
    console.log(yellow + "  Not covered by any bundled family.\n" + reset);
    return;
  }
  hits.forEach((h) => console.log(green + `  ✓ ${h.file}` + reset));
  console.log("");
}

function charsCoverage(text) {
  if (!text) {
    console.log(red + "\n  Usage: codexmono chars <text>\n" + reset);
    process.exit(1);
  }
  const fonts = loadCmaps(entriesFor("all"));
  const rows = [...text].map((ch) => {
    const cp = ch.codePointAt(0);
    const covered = fonts.filter((f) => cmapHas(f.buf, f.loc, cp)).map((f) => f.file);
    return { char: ch, codepoint: fmtCp(cp), count: covered.length, covered };
  });

  if (jsonOut) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }

  console.log(
    cyan + bold + `\n  Character coverage (${fonts.length} bundled fonts)\n` + reset,
  );
  rows.forEach((r) => {
    const mark =
      r.count === fonts.length
        ? green + "✓"
        : r.count > 0
          ? yellow + "◐"
          : red + "✗";
    console.log(`  ${mark} ${r.char}  ${gray}${r.codepoint}${reset}  ${r.count}/${fonts.length} fonts`);
  });
  console.log("");
}

switch (command) {
  case "install":
    installFonts(rawTarget);
    break;

  case "uninstall":
    uninstallFonts(rawTarget);
    break;

  case "list":
    listFonts(rawTarget);
    break;

  case "info":
    infoFonts(rawTarget);
    break;

  case "path":
    pathFonts(rawTarget);
    break;

  case "css":
    cssFonts(rawTarget);
    break;

  case "verify":
    verifyFonts(rawTarget);
    break;

  case "config":
    configFor(rawTarget, rawTarget2);
    break;

  case "doctor":
    doctorCheck();
    break;

  case "which":
    whichChar(rawTarget);
    break;

  case "chars":
    charsCoverage(rawTarget);
    break;

  case "--help":
  case "-h":
  case "help":
    showHelp();
    break;

  case "--version":
  case "-v":
  case "version":
    showVersion();
    break;

  default:
    console.log(red + `\n  Unknown command: ${command}\n` + reset);
    showHelp();
    process.exit(1);
}
