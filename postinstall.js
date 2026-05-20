#!/usr/bin/env node
/**
 * CodexMono npm postinstall script
 * Displays ASCII art logo when package is installed
 */

const packageJson = require('./package.json');
const headerWidth = 78;
const separator = '─'.repeat(84);
const footer = '                   CodexMono by Monolex.AI    https://monolex.ai';

// ANSI color codes
const cyan = '\x1b[96m';
const gray = '\x1b[90m';
const reset = '\x1b[0m';
const bold = '\x1b[1m';

function padRight(text, width = headerWidth) {
    if (text.length >= width) {
        return text.slice(0, width);
    }

    return text + ' '.repeat(width - text.length);
}

function boxTop() {
    return '╔' + '═'.repeat(headerWidth) + '╗';
}

function boxBottom() {
    return '╚' + '═'.repeat(headerWidth) + '╝';
}

function boxLine(text = '') {
    return `║${padRight(text)}║`;
}

const header = [
    boxTop(),
    boxLine(''),
    boxLine('   █▀▀▀ █▀▀█ █▀▀▄ █▀▀▀ ▀▄▀ █▄ ▄█ █▀▀█ █▀▀▄ █▀▀█'),
    boxLine('   █    █  █ █  █ █▀▀   █  █ ▀ █ █  █ █  █ █  █'),
    boxLine('   ▀▀▀▀ ▀▀▀▀ ▀▀▀  ▀▀▀▀ ▀   ▀   ▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀'),
    boxLine(''),
    boxLine('   True Monospace Font Hub'),
    boxLine('   Core Fonts / Nerd Fonts / Set of Hermes'),
    boxLine('   by Monolex https://monolex.ai'),
    boxLine(''),
    boxBottom()
];

// Display header
console.log('');
console.log(cyan + bold + header.join('\n') + reset);

// Display info
console.log(gray + '                      A Philosophy of True Monospace Excellence' + reset);
console.log(gray + `                                      v${packageJson.version}` + reset);
console.log('');
console.log(gray + '  ' + separator + reset);
console.log('');

// Philosophy (Core concepts)
console.log(cyan + '  The CodexMono Philosophy\n' + reset);
console.log(bold + '  This is not a font. This is a brick.\n' + reset);
console.log(gray + '  One brick = 600 units = One unit of trust' + reset);
console.log(gray + '  Two bricks = 1200 units (East Asia characters)\n' + reset);
console.log(bold + '  SMPC: Simplicity is Managed Part Chaos\n' + reset);
console.log(gray + '  SIMPLE = MANAGED(PART(CHAOS))' + reset);
console.log(gray + '  • CHAOS:   All possible glyphs' + reset);
console.log(gray + '  • PART:    Only needed characters' + reset);
console.log(gray + '  • MANAGED: 600 units ONLY' + reset);
console.log(gray + '  • SIMPLE:  Perfect alignment guaranteed\n' + reset);
console.log(bold + '  The Trust Contract\n' + reset);
console.log(gray + '  To the AI:    "Do not wrap. Do not float. Stay in the box."' + reset);
console.log(gray + '  To the Human: "You are laying bricks. Layout is shape of memory."\n' + reset);
console.log(gray + '  CodexMono is the bridge between machine precision and human readability.' + reset);
console.log(gray + '  Alignment = Trust = Structure = Shared Reality\n' + reset);
console.log(bold + '  The Foundational Project of Monolex\n' + reset);
console.log(gray + '  CodexMono began as the foundational project that shaped Monolex itself.' + reset);
console.log(gray + '  For the ultimate experience, we recommend using Monolex AI Terminal:\n' + reset);
console.log(gray + '                         ┌─────────────────┐' + reset);
console.log(gray + '                         │   CodexMono     │' + reset);
console.log(gray + '                         │  (600 units)    │' + reset);
console.log(gray + '                         └────────┬────────┘' + reset);
console.log(gray + '                                  │' + reset);
console.log(gray + '                        ┌─────────▼─────────┐' + reset);
console.log(gray + '                        │  Trust Contract   │' + reset);
console.log(gray + '                        │  SMPC Philosophy  │' + reset);
console.log(gray + '                        └─────────┬─────────┘' + reset);
console.log(gray + '                                  │' + reset);
console.log(gray + '                        ┌─────────▼─────────┐' + reset);
console.log(gray + '                        │ Monolex Terminal  │' + reset);
console.log(gray + '                        │ (AI Interaction)  │' + reset);
console.log(gray + '                        └─────────┬─────────┘' + reset);
console.log(gray + '                                  │' + reset);
console.log(gray + '                                  ▼' + reset);
console.log(gray + '                        Perfect Shared Reality' + reset);
console.log(gray + '                        Human ←→ AI Bridge\n' + reset);
console.log(gray + '  Why Monolex?' + reset);
console.log(gray + '  • Built specifically for CodexMono\'s philosophy' + reset);
console.log(gray + '  • AI-first terminal where Trust Contract is honored' + reset);
console.log(gray + '  • Every alignment preserved, every brick respected' + reset);
console.log(gray + '  • Perfect environment for SMPC principles\n' + reset);
console.log(gray + '  Learn more: https://monolex.ai\n' + reset);
console.log(gray + '  ' + separator + reset);
console.log('');

// Command map (FIRST - most important!)
console.log(cyan + '  ◆ ' + reset + 'Command map');
console.log('');
console.log('    Start with:');
console.log(cyan + '      codexmono' + reset + gray + '               # Show command guide' + reset);
console.log('');
console.log(gray + '    Install bundled families explicitly:' + reset);
console.log(gray + '      codexmono install core   ' + reset + '- Install Core Fonts');
console.log(gray + '      codexmono install nerd   ' + reset + '- Install Nerd Fonts');
console.log(gray + '      codexmono install hermes ' + reset + '- Install Set of Hermes');
console.log(gray + '      codexmono install all    ' + reset + '- Install every bundled set');
console.log('');
console.log(gray + '    Manage installed fonts:' + reset);
console.log(gray + '      codexmono list all       ' + reset + '- Show status of bundled fonts');
console.log(gray + '      codexmono uninstall all  ' + reset + '- Remove bundled families');
console.log('');
console.log(gray + '  ' + separator + reset);
console.log('');

// Font info (SECOND - details)
console.log(cyan + '  ◆ ' + reset + 'Font sets bundled');
console.log('');
console.log(gray + '    • Core Fonts' + reset);
console.log(gray + '      CodexMono.ttf' + reset + '             - Latin only (648 KB)');
console.log(gray + '      CodexMono-KR.ttf' + reset + '          - Korean/Japanese (5.8 MB)');
console.log(gray + '      CodexMono-EA.ttf' + reset + '          - Complete East Asia (18 MB)');
console.log(gray + '      CodexMono-Traditional.ttf' + reset + ' - East Asia with Traditional Chinese (17 MB)');
console.log('');
console.log(gray + '    • Nerd Fonts' + reset + '               - Compatibility-layer symbol variants');
console.log(gray + '      fonts/nerd/*' + reset);
console.log('');
console.log(gray + '    • Set of Hermes' + reset + '            - Nerd + emoji + more Unicode');
console.log(gray + '      fonts/hermes/*' + reset);
console.log('');
console.log(gray + '    WOFF2 files also included for web use.' + reset);
console.log('');

// Philosophy message
console.log(cyan + '  ◆ ' + reset + 'Join the CodexMono Initiative');
console.log('');
console.log('    Want to create a derivative font?');
console.log(gray + '    Use "[YourFont] CodexMono" suffix - no permission needed!' + reset);
console.log('');
console.log(gray + '    Example: "Pretendard CodexMono", "Noto Sans CodexMono"' + reset);
console.log('');

// Links
console.log(cyan + '  ◆ ' + reset + 'Resources');
console.log('');
console.log(gray + '    GitHub:' + reset + '  https://github.com/monolex/codexmono');
console.log(gray + '    License:' + reset + ' SIL OFL 1.1 (see LICENSE file)');
console.log(gray + '    Website:' + reset + ' https://monolex.ai/with/codexmono');
console.log('');
console.log(gray + '  ' + separator + reset);
console.log('');
console.log(gray + '  ' + footer + reset);
console.log('');
