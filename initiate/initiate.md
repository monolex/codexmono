╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   █▀▀▀ █▀▀█ █▀▀▄ █▀▀▀ ▀█ █▀ █▄ ▄█ █▀▀█ █▀▀▄ █▀▀█      ║
║   █    █  █ █  █ █▀▀   ▄▀▄  █ ▀ █ █  █ █  █ █  █      ║
║   ▀▀▀▀ ▀▀▀▀ ▀▀▀  ▀▀▀▀ ▀▀ ▀▀ ▀   ▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀      ║
║                                                       ║
║   True Monospace Font Hub                             ║
║   Core Fonts / Nerd Fonts / Set of Hermes             ║
║   by Monolex https://monolex.ai                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

codexmono v{VERSION}

CodexMono — A Philosophy of True Monospace Excellence.
Root command shows the command map; installation is explicit.

> "This is not a font. This is a brick."
> One brick = 600 units = one unit of trust. East Asian = 1200 units (1:2 ratio).
> Alignment = Trust = Structure = Shared Reality.

---

## USAGE

```
codexmono                       Show the command map (this hub)
codexmono install <target>      Install a font family (default: core)
codexmono uninstall [target]    Remove a font family (default: all)
codexmono list [target]         Show install status (default: all)
codexmono info [target]         Show family metadata (chars, size, paths)
codexmono path <target>         Print font file paths (--woff2 for web)
codexmono css [target]          Print @font-face CSS for web use
codexmono verify [target]       Check SHA256 against CHECKSUMS.md
codexmono config <editor>       Editor/terminal config snippet
codexmono doctor                Diagnose install + integrity
codexmono which <char>          Which families contain a character
codexmono chars <text>          Per-character coverage report
codexmono version               Show CLI version

Flags:  --json (info, verify, which, chars)   --woff2 (path)
config editors: vscode, kitty, alacritty, wezterm, ghostty, vim, neovim, iterm2, jetbrains, terminal
```

## COVERAGE QUERIES

```
codexmono which 한              # which families render U+D55C
codexmono which U+1F600         # by codepoint (emoji → Set of Hermes only)
codexmono chars "Hello 한글 ✓"  # per-character coverage across all 12 fonts
```

## FAMILIES (targets)

```
core     Core Fonts      Base CodexMono — Latin + CJK coverage     (4 fonts)
nerd     Nerd Fonts      Compatibility layer + terminal symbols    (4 fonts)
hermes   Set of Hermes   Messenger family: Nerd + emoji + Unicode  (4 fonts)
all      Everything      core + nerd + hermes                     (12 fonts)
```

| Target | Chars | TTF size | Coverage |
|--------|------:|---------:|----------|
| core (CodexMono) | 4,007 | 0.65 MB | Latin, Greek, Cyrillic, math, box drawing |
| core (CodexMono-KR) | 15,132 | 5.83 MB | + Korean Hangul, Japanese Kana |
| core (CodexMono-Traditional) | 33,726 | 17.18 MB | + Traditional Chinese |
| core (CodexMono-EA) | 36,440 | 18.36 MB | Complete East Asia (KR/JP/SC) |
| nerd | 14,400–46,832 | 2.66–20.37 MB | core + terminal-symbol layer |
| hermes | 15,860–48,253 | 3.46–21.17 MB | nerd + emoji + extended Unicode |

## EXAMPLES

```bash
codexmono                       # command map first (no install)
codexmono install core          # Latin + CJK base (4 fonts)
codexmono install nerd          # Nerd icons (4 fonts)
codexmono install hermes        # Set of Hermes: emoji + Nerd (4 fonts)
codexmono install all           # everything (12 fonts)
codexmono list all              # status of every family
codexmono uninstall nerd        # remove only the Nerd family
```

## INSTALL PATHS

```
macOS    ~/Library/Fonts/
Linux    ~/.local/share/fonts/   (runs fc-cache -f -v)
Windows  C:\Windows\Fonts\       (prints Admin PowerShell commands)
```

## EDITOR CONFIG

```jsonc
// VS Code settings.json
{
  "editor.fontFamily": "'CodexMono EA', monospace",
  "terminal.integrated.fontFamily": "CodexMono EA"
}
```

CodexMono is a Variable Font (weight 100–800): `font-variation-settings: "wght" 450;`

## WEB USE

WOFF2 ships alongside every TTF under `fonts/**/woff2/`.
Ready-made `@font-face` declarations: `css/codexmono.css` (12 families + weight utilities).

## PAIRS WITH

```
monogrid   Verify ASCII box alignment against CodexMono's Q.E.D Unicode widths.
           Install CodexMono first, then `monogrid` validates your docs render aligned.
```

## INSTALL CODEXMONO

```bash
npm install -g @monolex/codexmono     # then: codexmono
npx @monolex/codexmono install all    # or run without installing
```

## LINKS

```
Website   https://monolex.ai/with/codexmono
GitHub    https://github.com/monolex/codexmono
npm       https://www.npmjs.com/package/@monolex/codexmono
License   SIL Open Font License 1.1
```

Lay the brick first, then choose the family.
CodexMono™ by Monolex.AI (Umzikim Inc.)
