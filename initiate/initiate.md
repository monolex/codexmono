╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  █▀▀ █▀▀█ █▀▀▄ █▀▀ █ █ █▄ ▄█ █▀▀█ █▀▀▄ █▀▀█  True Monospace   ║
║  █   █  █ █  █ █▀▀ ▄▀▄ █ ▀ █ █  █ █  █ █  █  600-unit Brick   ║
║  ▀▀▀ ▀▀▀▀ ▀▀▀  ▀▀▀ ▀ ▀ ▀   ▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀  Human + AI       ║
║                                                               ║
║  Font family installer — Latin/CJK/Nerd/Hermes                ║
║  by Monolex — https://monolex.ai                              ║
╚═══════════════════════════════════════════════════════════════╝

codexmono v{VERSION}

CodexMono — A Philosophy of True Monospace Excellence.
Install the CodexMono font family (Latin + CJK + Nerd + Hermes) to your system.

> "This is not a font. This is a brick."
> One brick = 600 units = one unit of trust. East Asian = 1200 units (1:2 ratio).
> Alignment = Trust = Structure = Shared Reality.

---

## USAGE

```
codexmono                       Install core fonts (default)
codexmono install [variant]     Install fonts (default: core)
codexmono uninstall [variant]   Remove fonts (default: all)
codexmono list                  Show install status of all variants
codexmono --help                Show this help
codexmono --version             Show version
```

## VARIANTS

```
core     Latin + CJK base       CodexMono, -KR, -Traditional, -EA     (4 fonts)
nerd     + terminal symbols     Nerd-compatible icon coverage          (4 fonts)
hermes   + emoji + Unicode      Nerd + emoji messenger family          (4 fonts)
all      everything             core + nerd + hermes                  (12 fonts)
```

| Variant | Chars | TTF size | Coverage |
|---------|------:|---------:|----------|
| core (CodexMono) | 4,007 | 0.65 MB | Latin, Greek, Cyrillic, math, box drawing |
| core (CodexMono-KR) | 15,132 | 5.83 MB | + Korean Hangul, Japanese Kana |
| core (CodexMono-Traditional) | 33,726 | 17.18 MB | + Traditional Chinese |
| core (CodexMono-EA) | 36,440 | 18.36 MB | Complete East Asia (KR/JP/SC) |
| nerd | 14,400–46,832 | 2.66–20.37 MB | core + terminal-symbol layer |
| hermes | 15,860–48,253 | 3.46–21.17 MB | nerd + emoji + extended Unicode |

## EXAMPLES

```bash
# Install core (Latin + CJK) — most users
codexmono install

# Install Nerd icons (powerline, devicons, etc.)
codexmono install nerd

# Install Hermes (emoji + Nerd + extended Unicode)
codexmono install hermes

# Install everything (12 fonts)
codexmono install all

# Check what's installed
codexmono list

# Remove only the Nerd variant
codexmono uninstall nerd
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

CodexMono is a Variable Font (weight 100–800). One file, all weights:
`font-variation-settings: "wght" 450;`

## WEB USE

WOFF2 artifacts ship alongside every TTF under `fonts/**/woff2/`.
Ready-made `@font-face` declarations: `css/codexmono.css` (12 families + weight utility classes).

## PAIRS WITH

```
monogrid   Verify ASCII box alignment against CodexMono's Q.E.D Unicode widths.
           Install CodexMono first, then `monogrid` validates your docs render aligned.
```

## INSTALL CODEXMONO

```bash
npm install -g @monolex/codexmono     # then: codexmono
```

## LINKS

```
Website   https://monolex.ai/with/codexmono
GitHub    https://github.com/monolex/codexmono
npm       https://www.npmjs.com/package/@monolex/codexmono
License   SIL Open Font License 1.1
```

CodexMono™ by Monolex.AI (Umzikim Inc.)
