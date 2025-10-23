#!/usr/bin/env node
/**
 * CodexMono CLI - Font Installation Tool
 * Simple commands: codexmono, codexmono install, codexmono uninstall, codexmono list
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// ANSI colors
const cyan = '\x1b[96m';
const green = '\x1b[92m';
const yellow = '\x1b[93m';
const red = '\x1b[91m';
const gray = '\x1b[90m';
const reset = '\x1b[0m';
const bold = '\x1b[1m';

// Get font directory (this script is in bin/, fonts are in ../fonts/ttf/)
const fontDir = path.join(__dirname, '..', 'fonts', 'ttf');
const platform = os.platform();

// Parse command
const command = process.argv[2] || 'install'; // Default to install if no command

// Show welcome message on first run (install command only)
if (command === 'install') {
    const postinstallPath = path.join(__dirname, '..', 'postinstall.js');
    if (fs.existsSync(postinstallPath)) {
        require(postinstallPath);
    }
}

// Font files
const fontFiles = [
    'CodexMono.ttf',
    'CodexMono-KR.ttf',
    'CodexMono-Traditional.ttf',
    'CodexMono-EA.ttf'
];

/**
 * Install fonts to system
 */
function installFonts() {
    console.log(cyan + bold + '\n  🎨 CodexMono Font Installer\n' + reset);

    try {
        if (platform === 'darwin') {
            // macOS
            const targetDir = path.join(os.homedir(), 'Library', 'Fonts');
            console.log(gray + `  Installing to: ${targetDir}` + reset);

            let installedCount = 0;
            fontFiles.forEach(file => {
                const source = path.join(fontDir, file);
                const target = path.join(targetDir, file);

                if (fs.existsSync(source)) {
                    fs.copyFileSync(source, target);
                    console.log(green + `  ✓ ${file}` + reset);
                    installedCount++;
                }
            });

            console.log(green + bold + `\n  ✅ ${installedCount} fonts installed successfully!\n` + reset);
            console.log(gray + '  You can now use CodexMono in:' + reset);
            console.log(gray + '    • VS Code (set "editor.fontFamily": "CodexMono")' + reset);
            console.log(gray + '    • Terminal' + reset);
            console.log(gray + '    • Any application\n' + reset);

        } else if (platform === 'linux') {
            // Linux
            const targetDir = path.join(os.homedir(), '.local', 'share', 'fonts');

            // Create directory if it doesn't exist
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            console.log(gray + `  Installing to: ${targetDir}` + reset);

            let installedCount = 0;
            fontFiles.forEach(file => {
                const source = path.join(fontDir, file);
                const target = path.join(targetDir, file);

                if (fs.existsSync(source)) {
                    fs.copyFileSync(source, target);
                    console.log(green + `  ✓ ${file}` + reset);
                    installedCount++;
                }
            });

            // Refresh font cache
            console.log(gray + '\n  Refreshing font cache...' + reset);
            execSync('fc-cache -f -v', { stdio: 'ignore' });

            console.log(green + bold + `\n  ✅ ${installedCount} fonts installed successfully!\n` + reset);

        } else if (platform === 'win32') {
            // Windows - requires admin
            console.log(yellow + '  ⚠️  Windows font installation requires administrator rights.\n' + reset);
            console.log('  Please run PowerShell as Administrator and execute:\n');

            fontFiles.forEach(file => {
                const source = path.join(fontDir, file).replace(/\\/g, '\\\\');
                console.log(gray + `    Copy-Item "${source}" "C:\\Windows\\Fonts\\"` + reset);
            });

            console.log(gray + '\n  Then run: ' + cyan + 'reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts"' + reset);
            console.log('');

        } else {
            console.log(red + '  ❌ Unsupported platform: ' + platform + reset);
            process.exit(1);
        }

    } catch (error) {
        console.log(red + '\n  ❌ Installation failed: ' + error.message + reset);
        console.log(gray + '\n  Font files are available in:' + reset);
        console.log(gray + `    ${fontDir}\n` + reset);
        process.exit(1);
    }
}

/**
 * Uninstall fonts from system
 */
function uninstallFonts() {
    console.log(cyan + bold + '\n  🗑️  CodexMono Font Uninstaller\n' + reset);

    try {
        if (platform === 'darwin') {
            // macOS
            const targetDir = path.join(os.homedir(), 'Library', 'Fonts');

            let removedCount = 0;
            fontFiles.forEach(file => {
                const target = path.join(targetDir, file);

                if (fs.existsSync(target)) {
                    fs.unlinkSync(target);
                    console.log(green + `  ✓ Removed ${file}` + reset);
                    removedCount++;
                }
            });

            if (removedCount > 0) {
                console.log(green + bold + `\n  ✅ ${removedCount} fonts uninstalled.\n` + reset);
            } else {
                console.log(yellow + '  ℹ️  No CodexMono fonts found in system.\n' + reset);
            }

        } else if (platform === 'linux') {
            // Linux
            const targetDir = path.join(os.homedir(), '.local', 'share', 'fonts');

            let removedCount = 0;
            fontFiles.forEach(file => {
                const target = path.join(targetDir, file);

                if (fs.existsSync(target)) {
                    fs.unlinkSync(target);
                    console.log(green + `  ✓ Removed ${file}` + reset);
                    removedCount++;
                }
            });

            if (removedCount > 0) {
                // Refresh font cache
                console.log(gray + '\n  Refreshing font cache...' + reset);
                execSync('fc-cache -f -v', { stdio: 'ignore' });
                console.log(green + bold + `\n  ✅ ${removedCount} fonts uninstalled.\n` + reset);
            } else {
                console.log(yellow + '  ℹ️  No CodexMono fonts found in system.\n' + reset);
            }

        } else if (platform === 'win32') {
            // Windows
            console.log(yellow + '  ⚠️  Windows font uninstallation requires administrator rights.\n' + reset);
            console.log('  Please remove fonts manually from C:\\Windows\\Fonts\\\n');

        } else {
            console.log(red + '  ❌ Unsupported platform: ' + platform + reset);
            process.exit(1);
        }

    } catch (error) {
        console.log(red + '\n  ❌ Uninstallation failed: ' + error.message + reset);
        process.exit(1);
    }
}

/**
 * List installed fonts
 */
function listFonts() {
    console.log(cyan + bold + '\n  📋 CodexMono Font Status\n' + reset);

    let targetDir;

    if (platform === 'darwin') {
        targetDir = path.join(os.homedir(), 'Library', 'Fonts');
    } else if (platform === 'linux') {
        targetDir = path.join(os.homedir(), '.local', 'share', 'fonts');
    } else if (platform === 'win32') {
        targetDir = 'C:\\Windows\\Fonts';
    } else {
        console.log(red + '  ❌ Unsupported platform: ' + platform + reset);
        process.exit(1);
    }

    console.log(gray + `  System font directory: ${targetDir}\n` + reset);

    let installedCount = 0;
    fontFiles.forEach(file => {
        const target = path.join(targetDir, file);
        const isInstalled = fs.existsSync(target);

        if (isInstalled) {
            console.log(green + `  ✓ ${file}` + reset + gray + ' (installed)' + reset);
            installedCount++;
        } else {
            console.log(gray + `  ○ ${file}` + reset + gray + ' (not installed)' + reset);
        }
    });

    console.log('');
    if (installedCount === fontFiles.length) {
        console.log(green + `  ✅ All ${fontFiles.length} fonts are installed.\n` + reset);
    } else if (installedCount > 0) {
        console.log(yellow + `  ⚠️  ${installedCount}/${fontFiles.length} fonts installed.\n` + reset);
    } else {
        console.log(gray + `  ℹ️  No fonts installed. Run: ${cyan}codexmono install${reset}\n`);
    }
}

/**
 * Show help
 */
function showHelp() {
    console.log(cyan + bold + '\n  CodexMono CLI - Font Installation Tool\n' + reset);
    console.log('  Usage:');
    console.log(cyan + '    codexmono' + reset + '              Install fonts (default)');
    console.log(cyan + '    codexmono install' + reset + '      Install fonts to system');
    console.log(cyan + '    codexmono uninstall' + reset + '    Remove fonts from system');
    console.log(cyan + '    codexmono list' + reset + '         List installed fonts');
    console.log(cyan + '    codexmono --help' + reset + '       Show this help');
    console.log(cyan + '    codexmono --version' + reset + '    Show version\n');

    console.log('  Examples:');
    console.log(gray + '    # Install globally and run' + reset);
    console.log(gray + '    npm install -g @monolex/codexmono' + reset);
    console.log(gray + '    codexmono\n' + reset);

    console.log(gray + '    # Or use npx (no install)' + reset);
    console.log(gray + '    npx @monolex/codexmono\n' + reset);

    console.log('  Website: ' + cyan + 'https://monolex.ai/with/codexmono' + reset);
    console.log('  GitHub:  ' + cyan + 'https://github.com/monolex/codexmono\n' + reset);
}

/**
 * Show version
 */
function showVersion() {
    const packageJson = require('../package.json');
    console.log(cyan + `  CodexMono v${packageJson.version}\n` + reset);
}

// Main command router
switch (command) {
    case 'install':
        installFonts();
        break;

    case 'uninstall':
        uninstallFonts();
        break;

    case 'list':
        listFonts();
        break;

    case '--help':
    case '-h':
    case 'help':
        showHelp();
        break;

    case '--version':
    case '-v':
    case 'version':
        showVersion();
        break;

    default:
        console.log(red + `\n  ❌ Unknown command: ${command}\n` + reset);
        showHelp();
        process.exit(1);
}
