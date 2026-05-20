#!/usr/bin/env node
/**
 * CodexMono CLI - Font Installation Tool
 *
 * Commands:
 *   codexmono                       Install core (Latin/CJK base)
 *   codexmono install [variant]     Install fonts (default: core)
 *   codexmono uninstall [variant]   Remove fonts (default: all)
 *   codexmono list                  Show install status
 *   codexmono --help / --version
 *
 * Variants: core | nerd | hermes | all
 *   core    = CodexMono, -KR, -Traditional, -EA       (4 fonts)
 *   nerd    = + terminal-symbol layer                 (4 fonts)
 *   hermes  = + emoji + extended Unicode              (4 fonts)
 *   all     = core + nerd + hermes                    (12 fonts)
 *
 * Single source of truth: ../index.js (fonts metadata)
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const fontMeta = require('../index.js').fonts;

// ANSI colors
const cyan = '\x1b[96m';
const green = '\x1b[92m';
const yellow = '\x1b[93m';
const red = '\x1b[91m';
const gray = '\x1b[90m';
const reset = '\x1b[0m';
const bold = '\x1b[1m';

const platform = os.platform();
const pkgRoot = path.join(__dirname, '..');

// Variant → list of keys in index.js fonts object
const VARIANT_KEYS = {
    core:   ['core', 'kr', 'traditional', 'ea'],
    nerd:   ['nerd', 'krNerd', 'traditionalNerd', 'eaNerd'],
    hermes: ['hermes', 'krHermes', 'traditionalHermes', 'eaHermes'],
};
VARIANT_KEYS.all = [...VARIANT_KEYS.core, ...VARIANT_KEYS.nerd, ...VARIANT_KEYS.hermes];

/** Resolve variant name → array of {file, srcPath} */
function getFonts(variantName) {
    const keys = VARIANT_KEYS[variantName];
    if (!keys) return null;
    return keys.map(k => {
        const meta = fontMeta[k];
        if (!meta) throw new Error(`fonts.${k} missing in index.js`);
        // meta.ttf looks like './fonts/ttf/CodexMono.ttf'
        const rel = meta.ttf.replace(/^\.\//, '');
        return {
            key: k,
            displayName: meta.name,
            file: path.basename(meta.ttf),
            srcPath: path.join(pkgRoot, rel),
        };
    });
}

function getSystemFontDir() {
    if (platform === 'darwin') return path.join(os.homedir(), 'Library', 'Fonts');
    if (platform === 'linux')  return path.join(os.homedir(), '.local', 'share', 'fonts');
    if (platform === 'win32')  return 'C:\\Windows\\Fonts';
    return null;
}

function refreshLinuxFontCache() {
    // execFileSync (no shell) — fixed argv, zero injection vector
    try { execFileSync('fc-cache', ['-f', '-v'], { stdio: 'ignore' }); } catch (_) {}
}

function resolveVariantOrExit(arg, defaultVariant) {
    const v = (arg || defaultVariant).toLowerCase();
    if (!VARIANT_KEYS[v]) {
        console.log(red + `\n  ❌ Unknown variant: ${arg}\n` + reset);
        console.log(gray + '  Available variants: ' + reset + cyan + 'core, nerd, hermes, all\n' + reset);
        process.exit(1);
    }
    return v;
}

function installFonts(variantArg) {
    const variant = resolveVariantOrExit(variantArg, 'core');
    const fonts = getFonts(variant);

    console.log(cyan + bold + `\n  🎨 CodexMono Font Installer (${variant})\n` + reset);

    const targetDir = getSystemFontDir();
    if (!targetDir) {
        console.log(red + '  ❌ Unsupported platform: ' + platform + reset);
        process.exit(1);
    }

    if (platform === 'win32') {
        console.log(yellow + '  ⚠️  Windows font installation requires administrator rights.\n' + reset);
        console.log('  Please run PowerShell as Administrator and execute:\n');
        fonts.forEach(({ srcPath }) => {
            const escaped = srcPath.replace(/\\/g, '\\\\');
            console.log(gray + `    Copy-Item "${escaped}" "C:\\Windows\\Fonts\\"` + reset);
        });
        console.log('');
        console.log(gray + '  Then run: ' + cyan + 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts"\n' + reset);
        return;
    }

    if (platform === 'linux' && !fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    console.log(gray + `  Installing to: ${targetDir}` + reset);

    let installedCount = 0;
    let missingCount = 0;
    try {
        fonts.forEach(({ file, srcPath }) => {
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, path.join(targetDir, file));
                console.log(green + `  ✓ ${file}` + reset);
                installedCount++;
            } else {
                console.log(yellow + `  ⚠ Missing source: ${path.relative(pkgRoot, srcPath)}` + reset);
                missingCount++;
            }
        });
    } catch (error) {
        console.log(red + '\n  ❌ Installation failed: ' + error.message + reset);
        process.exit(1);
    }

    if (platform === 'linux' && installedCount > 0) {
        console.log(gray + '\n  Refreshing font cache...' + reset);
        refreshLinuxFontCache();
    }

    console.log(green + bold + `\n  ✅ ${installedCount} fonts installed successfully!` + reset);
    if (missingCount > 0) {
        console.log(yellow + `  ⚠ ${missingCount} fonts missing from package (reinstall with ${cyan}npm install -g @monolex/codexmono@latest${yellow}).` + reset);
    }
    console.log('');
    console.log(gray + '  You can now use CodexMono in:' + reset);
    console.log(gray + '    • VS Code (set "editor.fontFamily": "CodexMono")' + reset);
    console.log(gray + '    • Terminal' + reset);
    console.log(gray + '    • Any application\n' + reset);
}

function uninstallFonts(variantArg) {
    const variant = resolveVariantOrExit(variantArg, 'all');
    const fonts = getFonts(variant);

    console.log(cyan + bold + `\n  🗑️  CodexMono Font Uninstaller (${variant})\n` + reset);

    const targetDir = getSystemFontDir();
    if (!targetDir) {
        console.log(red + '  ❌ Unsupported platform: ' + platform + reset);
        process.exit(1);
    }

    if (platform === 'win32') {
        console.log(yellow + '  ⚠️  Windows font uninstallation requires administrator rights.\n' + reset);
        console.log('  Please remove these files manually from C:\\Windows\\Fonts\\:\n');
        fonts.forEach(({ file }) => console.log(gray + `    ${file}` + reset));
        console.log('');
        return;
    }

    let removedCount = 0;
    try {
        fonts.forEach(({ file }) => {
            const target = path.join(targetDir, file);
            if (fs.existsSync(target)) {
                fs.unlinkSync(target);
                console.log(green + `  ✓ Removed ${file}` + reset);
                removedCount++;
            }
        });
    } catch (error) {
        console.log(red + '\n  ❌ Uninstallation failed: ' + error.message + reset);
        process.exit(1);
    }

    if (removedCount === 0) {
        console.log(yellow + `  ℹ️  No CodexMono ${variant} fonts found in system.\n` + reset);
        return;
    }

    if (platform === 'linux') {
        console.log(gray + '\n  Refreshing font cache...' + reset);
        refreshLinuxFontCache();
    }

    console.log(green + bold + `\n  ✅ ${removedCount} fonts uninstalled.\n` + reset);
}

function listFonts() {
    console.log(cyan + bold + '\n  📋 CodexMono Font Status\n' + reset);

    const targetDir = getSystemFontDir();
    if (!targetDir) {
        console.log(red + '  ❌ Unsupported platform: ' + platform + reset);
        process.exit(1);
    }

    console.log(gray + `  System font directory: ${targetDir}\n` + reset);

    let totalInstalled = 0;
    let totalFonts = 0;

    for (const variant of ['core', 'nerd', 'hermes']) {
        const fonts = getFonts(variant);
        const installedFonts = fonts.filter(({ file }) => fs.existsSync(path.join(targetDir, file)));
        const installed = installedFonts.length;
        totalInstalled += installed;
        totalFonts += fonts.length;

        const mark = installed === fonts.length ? green + '✓ ' :
                     installed > 0              ? yellow + '◐ ' :
                                                   gray + '○ ';
        console.log(`  ${mark}${variant.padEnd(8)}${reset} ${gray}(${installed}/${fonts.length})${reset}`);

        fonts.forEach(({ file }) => {
            const isInstalled = fs.existsSync(path.join(targetDir, file));
            const m   = isInstalled ? green + '  ✓' : gray + '  ○';
            const tag = isInstalled ? gray + '(installed)' + reset
                                    : gray + '(not installed)' + reset;
            console.log(`${m} ${file}${reset}  ${tag}`);
        });
        console.log('');
    }

    if (totalInstalled === totalFonts) {
        console.log(green + bold + `  ✅ All ${totalFonts} fonts installed.\n` + reset);
    } else if (totalInstalled > 0) {
        console.log(yellow + `  ⚠️  ${totalInstalled}/${totalFonts} fonts installed.` + reset);
        console.log(gray + `     Install missing variants with: ${cyan}codexmono install <variant>${reset}\n`);
    } else {
        console.log(gray + `  ℹ️  No fonts installed. Run: ${cyan}codexmono install [variant]${reset}\n`);
    }
}

function showHelp() {
    // Single source of truth: initiate/initiate.md (mirrors the mono-family
    // `include_str!("initiate/initiate.md")` pattern, read at runtime for JS).
    const initiatePath = path.join(pkgRoot, 'initiate', 'initiate.md');
    if (fs.existsSync(initiatePath)) {
        const pkg = require('../package.json');
        const doc = fs.readFileSync(initiatePath, 'utf8').replace(/\{VERSION\}/g, pkg.version);
        process.stdout.write('\n' + doc + '\n');
        return;
    }

    // Fallback if initiate.md is missing from the package
    console.log(cyan + bold + '\n  CodexMono CLI - Font Installation Tool\n' + reset);
    console.log('  Usage:');
    console.log(cyan + '    codexmono' + reset + '                       Install core fonts (default)');
    console.log(cyan + '    codexmono install [variant]' + reset + '     Install fonts (default: core)');
    console.log(cyan + '    codexmono uninstall [variant]' + reset + '   Remove fonts (default: all)');
    console.log(cyan + '    codexmono list' + reset + '                  Show install status of all variants');
    console.log(cyan + '    codexmono --help' + reset + '                Show this help');
    console.log(cyan + '    codexmono --version' + reset + '             Show version\n');

    console.log('  Variants: core | nerd | hermes | all');
    console.log('  Website:  ' + cyan + 'https://monolex.ai/with/codexmono\n' + reset);
}

function showVersion() {
    const packageJson = require('../package.json');
    console.log(cyan + `  CodexMono v${packageJson.version}\n` + reset);
}

// Parse: argv[2] = command, argv[3] = optional variant arg
const command = process.argv[2] || 'install';
const arg = process.argv[3];

// Preserve legacy postinstall banner behavior:
// show banner only when invoked as bare `install` with no variant
if (command === 'install' && !arg) {
    const postinstallPath = path.join(pkgRoot, 'postinstall.js');
    if (fs.existsSync(postinstallPath)) {
        require(postinstallPath);
    }
}

switch (command) {
    case 'install':   installFonts(arg);   break;
    case 'uninstall': uninstallFonts(arg); break;
    case 'list':      listFonts();         break;
    case '--help':
    case '-h':
    case 'help':      showHelp();          break;
    case '--version':
    case '-v':
    case 'version':   showVersion();       break;
    default:
        console.log(red + `\n  ❌ Unknown command: ${command}\n` + reset);
        showHelp();
        process.exit(1);
}
