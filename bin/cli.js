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
const command = process.argv[2] || "help";
const rawTarget = process.argv[3];

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
  const target = resolveTarget(raw, "core");
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
      "  codexmono version" +
      reset +
      gray +
      "            Show CLI version" +
      reset,
  );
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
