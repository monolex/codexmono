# Nerd Size Comparison

Generated: 2026-03-08 19:01 UTC

## TTF / WOFF2

| Family | Base TTF | Nerd TTF | Delta | Base WOFF2 | Nerd WOFF2 | Delta |
|---|---:|---:|---:|---:|---:|---:|
| CodexMono | 663.6 KB | 2.66 MB | +2.01 MB | 233.6 KB | 1.09 MB | +878.2 KB |
| CodexMono-KR | 5.83 MB | 7.83 MB | +2.01 MB | 1.80 MB | 2.66 MB | +879.8 KB |
| CodexMono-EA | 18.36 MB | 20.37 MB | +2.01 MB | 7.39 MB | 8.25 MB | +882.6 KB |
| CodexMono-Traditional | 17.18 MB | 19.18 MB | +2.01 MB | 6.96 MB | 7.83 MB | +884.6 KB |

## Package Tarball

| Package | Size | Delta |
|---|---:|---:|
| `monolex-codexmono-1.0.0.tgz` | 39.91 MB | baseline |
| `monolex-codexmono-1.0.1.tgz` | 87.56 MB | +47.65 MB |
| `monolex-codexmono-1.0.2.tgz` | 139.18 MB | +99.27 MB |

The `1.0.1` tarball includes both the base family and the new `fonts/nerd/{ttf,woff2}` distribution artifacts. The `1.0.2` tarball adds `fonts/hermes/{ttf,woff2}` on top of that bundle.

## Hermes TTF

| Family | Nerd TTF | Hermes TTF | Delta |
|---|---:|---:|---:|
| CodexMono | 2.66 MB | 3.46 MB | +0.80 MB |
| CodexMono-KR | 7.83 MB | 8.64 MB | +0.81 MB |
| CodexMono-EA | 20.37 MB | 21.17 MB | +0.80 MB |
| CodexMono-Traditional | 19.18 MB | 19.99 MB | +0.81 MB |

`Nerd` remains the separately shipped compatibility layer. `Hermes` is the larger public messenger-family name built above that layer. The current release uses `Noto Emoji` static weight `300` as its first upstream emoji source, but the shipped filenames intentionally omit source-specific suffixes.

## U+273D Promotion Deltas

| File | U+273D width | TTF size |
|---|---:|---:|
| CodexMono-EA.ttf | 600 | 18.36 MB |
| CodexMono-Traditional.ttf | 600 | 17.18 MB |
| CodexMono-EA-Nerd.ttf | 600 | 20.37 MB |
| CodexMono-Traditional-Nerd.ttf | 600 | 19.18 MB |

## Reference Nerd TTFs

| Font | Type | Size | Delta vs `CodexMono-Nerd.ttf` |
|---|---|---:|---:|
| `CodexMono-Nerd.ttf` | Variable + Nerd | 2.66 MB | baseline |
| `JetBrainsMonoNerdFontMono-Regular.ttf` | Static + Nerd | 2.36 MB | -308.1 KB |
| `SymbolsNerdFontMono-600.ttf` | Symbols-only static | 1.88 MB | -791.7 KB |

## Notes

- `EA` and `Traditional` now ship with the `U+273D 623-in-600 live` promotion.
- The live promotion preserves the original `gvar` deltas for `U+273D`, so bold weights can overhang beyond the 600 cell.
- `Base` and `KR` have no `U+273D` glyph and are unchanged by this promotion.
- The package delta is larger than the per-font delta because `1.0.1` publishes both base and nerd families together.
- The reference TTF comparison is not like-for-like: `CodexMono-Nerd.ttf` is variable, while the JetBrains and Symbols references are static inputs.
- `Hermes` builds use the corresponding `Nerd` layer as their compatibility-oriented base and add only missing emoji codepoints at `1200` width.
