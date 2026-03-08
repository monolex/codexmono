# CodexMono Changelog

All notable changes to the CodexMono font family will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

## [1.0.1] - 2026-03-09

### Changed
- Promoted the `U+273D 623-in-600 live` treatment into `CodexMono-EA.ttf` and `CodexMono-Traditional.ttf`.
- Added official `CodexMono Nerd` distribution artifacts under `fonts/nerd/{ttf,woff2}`.
- Published `monolex-codexmono-1.0.1.tgz` with both base and nerd families bundled.

## [1.0.0] - 2025-10-23

### 🎉 Initial Public Release: Philosophy-Driven AI LLM Protocol Font

**CodexMono™** - This is not a font. This is a brick.

### Philosophy

#### Core Concepts Integrated
- **Brick Metaphor**: 600 units = One unit of trust
- **SMPC Philosophy**: Simplicity is Managed Part Chaos (foundational to Monolex)
- **Trust Contract**: Dual protocol for AI and Human interaction
- **AI LLM Protocol**: Bridge between machine precision and human readability

#### The Fundamental Equation
```
Alignment = Trust = Structure = Shared Reality
```

### Features

#### Four Font Variants

**CodexMono-EA.ttf** - East Asia Complete ⭐ Recommended
- **36,434 glyphs** with 100% Variable Font support
- **Korean**: 11,172 Hangul syllables
- **Japanese**: ~200 Kana characters
- **Simplified Chinese**: 20,976 characters (简体字)
- **Special characters**: ①②③, ㈜, Ａａ, old Hangul Jamo
- **File size**: 18 MB (TTF), 7.39 MB (WOFF2)

**CodexMono-Traditional.ttf** - Traditional Chinese
- **33,720 characters** with 100% Variable Font support
- **Traditional Chinese**: 15,383 characters (繁體字)
- **Korean + Japanese**: Complete coverage
- **File size**: 17 MB (TTF), 6.97 MB (WOFF2)

**CodexMono-KR.ttf** - Korean/Japanese Focused
- **15,132 characters** with 100% Variable Font support
- **Korean Hangul** + **Japanese Kana**
- **No Chinese characters** (smaller file size)
- **File size**: 5.8 MB (TTF), 1.80 MB (WOFF2)

**CodexMono.ttf** - Latin Core
- **4,007 characters** with 100% Variable Font support
- **Latin, Greek, Cyrillic**, Math symbols, Programming symbols
- **File size**: 648 KB (TTF), 227 KB (WOFF2)

#### Variable Font Technology
- **Weight axis**: 100 to 800 (Thin to ExtraBold)
- **Single file**: All weights in one font file
- **Named instances**: 8 predefined weights
- **Smooth interpolation**: Infinite weight values between 100-800

#### Perfect Monospace Alignment
- **Latin/ASCII**: 600 units (half-width)
- **East Asia characters**: 1200 units (full-width) = Two bricks
- **Exact 1:2 ratio**: Perfect terminal grid alignment
- **Center-aligned**: All glyphs precisely centered with equal bearings

#### Source Fonts Integration

**JetBrains Mono** - Programming excellence
- Used for: Latin, ASCII, programming symbols
- Advance width: 600 units (preserved exactly)
- License: SIL OFL 1.1

**Pretendard** - Elegant Korean/Japanese
- Used for: Korean Hangul (11,172 chars), Japanese Kana (189 chars)
- Modification: Converted from variable-width to 1200 units monospace
- Quality: Premium typography preserved
- License: SIL OFL 1.1

**Noto Sans Mono** - Extended coverage
- Used for: Extended Latin, Greek, Cyrillic, Math, Box drawing
- Modification: Bearing adjustments for terminal compatibility
- Strategy: Terminal-first design philosophy
- License: SIL OFL 1.1

**Noto Sans SC / TC** - Chinese characters
- Used for: Simplified Chinese (SC) and Traditional Chinese (TC)
- Modification: Centered to 1200 monospace with precise scaling
- Result: Visual consistency across all East Asia characters
- License: SIL OFL 1.1

#### Terminal-First Design Philosophy

**Box Drawing Characters**: Negative bearings for seamless connections
```
─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
LSB/RSB: 0 to -20px (overflow strategy)
Purpose: Perfect line connections in terminal UI
```

**Arrow Characters**: Aggressive compression for maximum visibility
```
← → ↑ ↓ ↔
Bearing reduction: -220px to -286px
Purpose: Clear visibility in code editors
```

### Documentation

**README.md** - Philosophy-enhanced user guide
- "This is not a font. This is a brick" introduction
- SMPC philosophy explanation
- Trust Contract (AI + Human)
- Monolex Terminal integration diagram
- Complete installation and configuration

**ATTRIBUTION.md** - Complete source credits
- All source fonts credited with authors
- Detailed modification descriptions
- SIL OFL 1.1 compliance verification
- Character source breakdown
- Legal usage guidelines

**postinstall.js** - Philosophy on npm install
- Displays core concepts when package is installed
- SMPC equation breakdown
- Trust Contract quotes
- Monolex connection with flow diagram

### License

**SIL Open Font License 1.1**

- ✅ Free for personal and commercial use
- ✅ Can be modified and redistributed
- ✅ Can be bundled with software
- ✅ Can be used in web fonts
- ❌ Cannot be sold as standalone product
- ❌ Modified versions cannot use "CodexMono" name

### Use Cases

**Monolex AI Terminal** ⭐ Foundational project
- CodexMono began as the foundational project that shaped Monolex
- Built specifically for CodexMono's philosophy
- Trust Contract honored: every alignment preserved, every brick respected
- Perfect environment for SMPC principles

**AI Terminals** - Primary use case
- Multilingual AI responses (Korean, Japanese, Chinese, English)
- Mathematical formulas (∑, ∫, ∂, ∇)
- Database queries (⋈ join operators)
- Terminal UI with perfect box drawing
- Code blocks in all languages

**Programming**
- Support for all major programming languages
- East Asia comments in code
- Math symbols for scientific computing
- Terminal graphics and CLI apps

**Technical Documentation**
- Mixed language content
- Mathematical notation
- Code examples
- Terminal output

### Quality Metrics

**Character Coverage**
- Total Unicode: 36,434 characters (EA version)
- Korean: 11,172 complete syllables
- Japanese: ~200 Kana characters
- Chinese: 20,976 Simplified + 15,383 Traditional
- Latin/Extended: 4,007 characters

**Performance**
- Web loading: 7.39 MB for complete East Asia (woff2)
- Variable Font: Single file, all weights
- Rendering: Perfect monospace on all platforms
- Compatibility: All modern browsers and terminals

### Credits

**Original Font Authors**
- Philipp Nurullin & Konstantin Bulenkov (JetBrains Mono)
- Kil Hyung-jin 길형진 (Pretendard)
- Google Fonts Team (Noto fonts)

**CodexMono Development**
- NIIA (Neural Intelligence Integration Architecture)
- Project: Monolex.ai AI Terminal
- Copyright: © 2025 Monolex.AI (Umzikim Inc.)
- Contact: legal@monolex.ai

### Links

- **Website**: https://monolex.ai/with/codexmono
- **Repository**: https://github.com/monolex/codexmono
- **npm Package**: https://www.npmjs.com/package/@monolex/codexmono
- **Email**: legal@monolex.ai

---

## Version Philosophy

**Why v1.0.0?**

This is the first public release of CodexMono with complete philosophy integration. The font represents more than typography—it's a protocol for trust between humans and AI.

**What makes this 1.0.0:**
- Complete character coverage for multilingual development
- Philosophy fully integrated across all documentation
- Proven Variable Font technology
- Terminal-optimized design
- Monolex Terminal integration
- npm distribution with CLI tool
- Comprehensive documentation

**Core Message:**
```
CodexMono = SMPC × Brick × Protocol
          = Philosophy → Code → Trust → Future
```

---

*CodexMono™ - Where Philosophy Meets Typography*

**Developed by NIIA for Monolex.AI** | Licensed under SIL OFL 1.1

© 2025 Monolex.AI (Umzikim Inc.) | All source fonts © their respective authors

---

Released: 2025-10-23
Version: 1.0.0
