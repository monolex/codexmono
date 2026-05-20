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
const rawTarget = argv.slice(1).find((a) => !a.startsWith("-"));
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
      "  codexmono version" +
      reset +
      gray +
      "            Show CLI version" +
      reset,
  );
  console.log("");
  console.log(bold + "FLAGS" + reset);
  console.log(
    gray + "  --json     Machine-readable output (info, verify)" + reset,
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
