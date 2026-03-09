#!/usr/bin/env node
/**
 * CodexMono npm postinstall script
 * Displays ASCII art logo when package is installed
 */

// CodexMono ASCII art logo
const logo = [
    '  ██████┐ ██████┐ ██████┐ ███████┐██┐  ██┐███┐   ███┐ ██████┐ ███┐   ██┐ ██████┐',
    ' ██┌────┐██┌───██┐██┌──██┐██┌────┘└██┐██┌┘████┐ ████│██┌───██┐████┐  ██│██┌───██┐',
    ' ██│     ██│   ██│██│  ██│█████┐   └███┌┘ ██┌████┌██│██│   ██│██┌██┐ ██│██│   ██│',
    ' ██│     ██│   ██│██│  ██│██┌──┘   ██┌██┐ ██│└██┌┘██│██│   ██│██│└██┐██│██│   ██│',
    ' └██████┐└██████┌┘██████┌┘███████┐██┌┘ ██┐██│ └─┘ ██│└██████┌┘██│ └████│└██████┌┘',
    '  └─────┘ └─────┘ └─────┘ └──────┘└─┘  └─┘└─┘     └─┘ └─────┘ └─┘  └───┘ └─────┘',
    '',
    '         ███┐   ███┐ ██████┐ ███┐   ██┐ ██████┐ ██┐     ███████┐██┐  ██┐',
    '         ████┐ ████│██┌───██┐████┐  ██│██┌───██┐██│     ██┌────┘└██┐██┌┘',
    '         ██┌████┌██│██│   ██│██┌██┐ ██│██│   ██│██│     █████┐   └███┌┘',
    '         ██│└██┌┘██│██│   ██│██│└██┐██│██│   ██│██│     ██┌──┘   ██┌██┐',
    '         ██│ └─┘ ██│└██████┌┘██│ └████│└██████┌┘███████┐███████┐██┌┘ ██┐',
    '         └─┘     └─┘ └─────┘ └─┘  └───┘ └─────┘ └──────┘└──────┘└─┘  └─┘'
];

const tagline = '                    A Philosophy of True Monospace Excellence';
const version = '                                      v1.0.2';
const separator = '─'.repeat(84);
const footer = '                   CodexMono by Monolex.AI    https://monolex.ai';

// ANSI color codes
const cyan = '\x1b[96m';
const gray = '\x1b[90m';
const reset = '\x1b[0m';
const bold = '\x1b[1m';

// Display logo
console.log('');
console.log(cyan + bold);
logo.forEach(line => console.log('  ' + line));
console.log(reset);

// Display info
console.log(gray + '  ' + tagline + reset);
console.log(gray + '  ' + version + reset);
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

// Installation command (FIRST - most important!)
console.log(cyan + '  ◆ ' + reset + 'Install fonts to your system');
console.log('');
console.log('    Run this command to install fonts:');
console.log(cyan + '      codexmono' + reset);
console.log('');
console.log(gray + '    Or use specific commands:' + reset);
console.log(gray + '      codexmono install   ' + reset + '- Install fonts');
console.log(gray + '      codexmono uninstall ' + reset + '- Remove fonts');
console.log(gray + '      codexmono list      ' + reset + '- List installed fonts');
console.log('');
console.log(gray + '  ' + separator + reset);
console.log('');

// Font info (SECOND - details)
console.log(cyan + '  ◆ ' + reset + 'Font files downloaded');
console.log('');
console.log(gray + '    • CodexMono.ttf' + reset + '             - Latin only (648 KB)');
console.log(gray + '    • CodexMono-KR.ttf' + reset + '          - Korean/Japanese (5.8 MB)');
console.log(gray + '    • CodexMono-EA.ttf' + reset + '          - Complete East Asia (18 MB)');
console.log(gray + '    • CodexMono-Traditional.ttf' + reset + ' - East Asia with Traditional Chinese (17 MB)');
console.log(gray + '    • fonts/nerd/*' + reset + '                - Nerd compatibility-layer variants');
console.log(gray + '    • fonts/hermes/*' + reset + '              - Hermes integrated messenger-family variants');
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
