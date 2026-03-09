# CodexMono™ Complete Attribution

**Version 1.0.2** | Released 2026-03-09

**"This is not a font. This is a brick."**

This document provides complete attribution and licensing information for all CodexMono font variants - the philosophy-driven AI LLM Protocol font.

---

## 📜 License Summary

All CodexMono fonts are licensed under the **SIL Open Font License 1.1**.

**What this means:**
- ✅ Free for personal and commercial use
- ✅ Can be modified and redistributed
- ✅ Can be bundled with software
- ✅ Can be used in web fonts
- ❌ Cannot be sold as standalone font
- ❌ Modified versions cannot use "CodexMono" name

Full license text: `licenses/LICENSE_CodexMono.txt`

Supplemental bundled sources used by the `Nerd` and `Hermes` families also include their original notice files:
- `licenses/NerdFonts-LICENSE.txt`
- `licenses/NotoEmoji-LICENSE.txt`

---

## 🧱 CodexMono Philosophy

### The Brick Metaphor
```
600 units  = One brick = One unit of trust
1200 units = Two bricks (East Asia characters)

Alignment = Trust = Structure = Shared Reality
```

### SMPC: Fundamental of Monolex
**"Simplicity is Managed Part Chaos"**

Applied to CodexMono:
- **CHAOS**: All possible glyphs in the universe
- **PART**: Only actually needed characters
- **MANAGED**: 600 units ONLY - absolute rule
- **SIMPLE**: Immediately usable True Monospace

### The Trust Contract

**To the AI:**
> Do not wrap. Do not float. Stay in the box.

**To the Human:**
> You are laying bricks. Layout is shape of memory.

**The Bridge:**
CodexMono is the bridge between machine precision and human readability.

---

## 🎨 Font Variants Overview

### CodexMono-EA.ttf — East Asia Complete ⭐ Recommended
**36,434 glyphs** | **18 MB (TTF)**, 7.39 MB (WOFF2) | **100% Variable Font**

**Complete coverage:**
- Korean: 11,172 Hangul syllables
- Japanese: ~200 Kana characters
- Simplified Chinese: 20,976 characters (简体字)
- Special characters: ①②③, ㈜, Ａａ, old Hangul Jamo

**Source Fonts:**
1. JetBrains Mono (Latin base, 600 units)
2. Pretendard (Korean + Japanese, converted to 1200 units)
3. Noto Sans Mono (Extended Latin, Math, Symbols)
4. Noto Sans SC (Simplified Chinese, scaled and centered to 1200 units)

### CodexMono-Traditional.ttf — Traditional Chinese
**33,720 characters** | **17 MB (TTF)**, 6.97 MB (WOFF2) | **100% Variable Font**

**Traditional Chinese focused:**
- Traditional Chinese: 15,383 characters (繁體字)
- Korean + Japanese: Complete coverage

**Source Fonts:**
1. JetBrains Mono (Latin base, 600 units)
2. Pretendard (Korean + Japanese, converted to 1200 units)
3. Noto Sans Mono (Extended Latin, Math, Symbols)
4. Noto Sans TC (Traditional Chinese, scaled and centered to 1200 units)

### CodexMono-KR.ttf — Korean/Japanese Focused
**15,132 characters** | **5.8 MB (TTF)**, 1.80 MB (WOFF2) | **100% Variable Font**

**No Chinese characters (smaller file size):**
- Korean Hangul + Japanese Kana complete

**Source Fonts:**
1. JetBrains Mono (Latin base, 600 units)
2. Pretendard (Korean + Japanese, converted to 1200 units)
3. Noto Sans Mono (Extended Latin, Math, Symbols)

### CodexMono.ttf — Latin Core
**4,007 characters** | **648 KB (TTF)**, 227 KB (WOFF2) | **100% Variable Font**

**Compact Latin-only version:**
- Latin, Greek, Cyrillic, Math symbols, Programming symbols

**Source Fonts:**
1. JetBrains Mono (Latin base, 600 units)
2. Noto Sans Mono (Extended Latin, Math, Greek, Box drawing)

### CodexMono Hermes — Integrated Messenger Family
**Base: 15,860 characters** | **3.46 MB (TTF)** | **Variable base with static emoji masters**

**Public variants:**
- `CodexMono-Hermes.ttf`
- `CodexMono-KR-Hermes.ttf`
- `CodexMono-EA-Hermes.ttf`
- `CodexMono-Traditional-Hermes.ttf`

**Build composition:**
1. The CodexMono Nerd compatibility layer as the symbol-bearing variable base
2. The current integrated emoji source layer normalized to the 1200-unit wide-cell rule
3. Existing overlap codepoints preserved from CodexMono to keep terminal-width behavior stable

**Notes:**
- `Hermes` is the messenger family name: Nerd + Emoji + more Unicode, intended as a bridge between AI and Human.
- Public family name is `Hermes`; source-specific labels such as `300` are build provenance, not shipping suffixes.
- The current `1.0.2` Hermes build uses `Noto Emoji` static weight `300` as its current upstream emoji source.
- Added emoji remain 1200-wide, while existing CodexMono overlap symbols such as `U+26A0` remain at their base widths.

---

## 🔍 Detailed Source Attribution

### 1. JetBrains Mono

**Copyright**: © 2020 The JetBrains Mono Project Authors
**License**: SIL Open Font License 1.1
**Source**: https://github.com/JetBrains/JetBrainsMono

#### Authors
- **Philipp Nurullin** (Design Lead)
- **Konstantin Bulenkov** (Development Lead)

#### Used In
- CodexMono (100%)
- CodexMono-KoJa (Latin portion)
- CodexMono-EA (Latin portion)

#### Characters Used
```
Basic Latin:        U+0020-007F  (95 chars)
Latin-1 Supplement: U+00A0-00FF  (96 chars)
Latin Extended-A:   U+0100-017F  (128 chars)
Programming Symbols: Various ranges
Total: ~1,900 glyphs
```

#### Modifications
- None to original glyphs
- Used as 600-unit base
- All weight variations preserved (100-800)

#### License File
`licenses/JetBrainsMono-LICENSE.txt`

---

### 2. Pretendard

**Copyright**: © 2021 Kil Hyung-jin (길형진)
**License**: SIL Open Font License 1.1
**Source**: https://github.com/orioncactus/pretendard

#### Author
- **Kil Hyung-jin** 길형진 (Creator & Maintainer)

#### Used In
- CodexMono-KoJa (Korean/Japanese portion)
- CodexMono-EA (Korean/Japanese portion)

#### Characters Used
```
Korean Hangul:
  U+AC00-D7A3: 11,172 syllables (complete coverage)
  U+1100-11FF: 256 Jamo (composing characters)

Japanese:
  U+3040-309F: 96 Hiragana
  U+30A0-30FF: 93 Katakana

Total: 11,617 characters
```

#### Modifications
**Critical: Variable-width to Monospace Conversion**

Original Pretendard is a variable-width font. CodexMono converted it to monospace:

```
Process:
1. Extract all Korean and Japanese glyphs
2. Analyze glyph widths (varied in original)
3. Calculate center point for each glyph
4. Set advance width to exactly 1200 units
5. Center-align with equal left/right bearings
6. Preserve all Variable Font tables (gvar, fvar)

Example:
  Original '가': width 1050, advance 1050
  Modified '가': width 806, advance 1200, L/R: 197/197

Quality preserved:
- All stroke weights maintained
- Vertical metrics unchanged
- Variable Font capability intact
- Visual quality: 100% preserved
```

**Rationale for modification:**
- Pretendard is designed for variable-width text
- Terminals and code editors require fixed-width fonts
- Monospace conversion makes it usable for programming
- This is permitted under SIL OFL 1.1 section 2

#### License File
`licenses/Pretendard-LICENSE.txt`

---

### 3. Noto Sans Mono

**Copyright**: © 2022 The Noto Project Authors (Google)
**License**: SIL Open Font License 1.1
**Source**: https://github.com/notofonts/latin-greek-cyrillic

#### Authors
- **Google Fonts Team**
- Multiple designers and contributors

#### Used In
- CodexMono (Extended characters)
- CodexMono-KoJa (Extended characters)
- CodexMono-EA (Extended characters)

#### Characters Used
```
Extended Latin:     U+0180-024F  (various)
Greek:              U+0370-03FF  (135 chars)
Cyrillic:           U+0400-04FF  (256 chars)
IPA Extensions:     U+0250-02AF  (96 chars)
Math Operators:     U+2200-22FF  (256 chars)
Box Drawing:        U+2500-257F  (128 chars)
Arrows:             U+2190-21FF  (112 chars)
Geometric Shapes:   U+25A0-25FF  (96 chars)
Miscellaneous Symbols: Various ranges

Total: ~2,300 characters
```

#### Modifications
**Bearing Adjustments for Terminal Compatibility**

Noto Sans Mono glyphs were adjusted to match JetBrains Mono philosophy:

```
Categories of adjustment:

1. IDENTICAL (0px change)
   - Characters already matching JetBrains metrics
   - ~15% of characters

2. MINOR_ADJUST (±10-20px)
   - Standard letters, digits
   - Automated adjustment
   - ~61% of characters

3. MODERATE_REDUCE (-20 to -50px)
   - Extended Latin, Greek
   - Some mathematical symbols
   - ~18% of characters

4. AGGRESSIVE_REDUCE (-50 to -286px)
   - Arrows: ← → ↑ ↓ (compressed for visibility)
   - Large geometric shapes
   - ~5% of characters

5. OVERFLOW (negative bearings)
   - Box drawing: ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
   - LSB/RSB: 0 to -20px
   - Reason: Seamless terminal line connections
   - ~1% of characters

Total processed: 1,098 overlapping characters
Automated: 79.6% (874 chars)
Manual optimized: 20.4% (225 chars)
```

**Philosophy:**
- Terminal functionality > Typography rules
- Box drawing must connect seamlessly
- Arrows must be clearly visible
- Math symbols must be readable at 10pt

**Documentation:**
- `HYBRID-AUTOMATION-STRATEGY.md` - Automation approach
- `MANUAL-OPTIMIZATION-PRIORITY.md` - Manual optimization list
- `TERMINAL-FIRST-CONVERSION-RULES.md` - Philosophy details

#### License File
`licenses/NotoSansMono-LICENSE.txt`

---

### 4. Noto Sans SC / TC (Simplified & Traditional Chinese)

**Copyright**: © 2022 The Noto Project Authors (Google)
**License**: SIL Open Font License 1.1
**Source**: https://github.com/notofonts/noto-cjk

#### Authors
- **Google Fonts Team**
- **Adobe** (Original Source Han Sans collaboration)

#### Used In
- CodexMono-EA (Simplified Chinese)
- CodexMono-Traditional (Traditional Chinese)

#### Characters Used
```
Simplified Chinese (SC):
  20,976 characters (简体字)
  GB2312 common set + extended

Traditional Chinese (TC):
  15,383 characters (繁體字)
  Big5 common set + extended

Coverage optimized for:
  - Programming documentation
  - Technical writing
  - Common usage in terminals
```

#### Modifications
**Scaled and centered to 1200 units for perfect monospace alignment**

All Chinese characters were carefully:
1. Scaled to match Korean/Japanese visual height
2. Re-centered to 1200 advance width with equal bearings
3. Variable Font tables preserved for all weights (100-800)

**Result**: Perfect visual harmony with Korean and Japanese characters, maintaining the "two bricks" (1200 units) principle.

#### License File
`licenses/NotoSansMono-LICENSE.txt` (same as Noto Sans Mono)

---

### 5. Noto Emoji (Current Hermes 1.0.2 Source)

**Copyright**: © 2022 The Noto Project Authors (Google)
**License**: SIL Open Font License 1.1
**Source**: https://fonts.google.com/noto/specimen/Noto+Emoji

#### Used In
- CodexMono Hermes
- CodexMono KR Hermes
- CodexMono EA Hermes
- CodexMono Traditional Hermes

#### Modifications
**Normalized for the current Hermes integrated emoji source**

The current `1.0.2` Hermes build uses the Google Fonts `Noto Emoji` static weight `300` masters as the emoji source layer:
1. Source outlines are uniformly scaled from the delivery width to `1200` units.
2. Only emoji codepoints missing from the CodexMono Nerd base are imported.
3. Existing overlap symbols remain mapped to the CodexMono base glyphs to preserve terminal width behavior.
4. Imported emoji outlines are static; the CodexMono variable base remains intact.

Future Hermes builds may swap this emoji source while preserving the public Hermes family identity.

#### License File
`licenses/NotoEmoji-LICENSE.txt`

---

### 6. Nerd Fonts (Compatibility Layer Source)

**Copyright**: © Nerd Fonts project and original icon set authors
**License**: Mixed upstream notices collected by the Nerd Fonts project
**Source**: https://github.com/ryanoasis/nerd-fonts

#### Used In
- CodexMono Nerd
- CodexMono KR Nerd
- CodexMono EA Nerd
- CodexMono Traditional Nerd
- All Hermes variants

#### Modifications
**Subset merge into CodexMono variable bases**

CodexMono Nerd imports symbol coverage from the Nerd Fonts symbol set and normalizes added glyphs to CodexMono's single-cell `600` unit rule. Hermes treats that merged Nerd layer as a compatibility-oriented base and then adds its integrated emoji source above it.

#### License File
`licenses/NerdFonts-LICENSE.txt`

---

## 🔧 CodexMono Development

### The Foundational Project of Monolex

**CodexMono began as the foundational project that shaped Monolex itself.**

This font is more than typography—it's the protocol that defines how Monolex AI Terminal achieves perfect alignment between human and AI. Every 600-unit brick honors the Trust Contract. Every alignment preserves the structure of shared reality.

### Created By
**NIIA** (Neural Intelligence Integration Architecture)

### Organization
**Monolex.AI** (Umzikim Inc.)

### Copyright
© 2025 Monolex.AI (Umzikim Inc.)

### License
SIL Open Font License 1.1

### Reserved Font Name
"CodexMono" is a trademark of Monolex.AI

**Derivative Font Policy:**
If you create a derivative monospace font based on CodexMono's philosophy, we encourage using the suffix "CodexMono" to indicate compatibility:
- Examples: "YourFont CodexMono", "CustomName CodexMono"
- No permission needed—this is our gift to the open source community
- SIL OFL 1.1 still applies (same license, credit original sources)

### Contact
- **Email**: legal@monolex.ai
- **Website**: https://monolex.ai/with/codexmono
- **Repository**: https://github.com/monolex/codexmono
- **npm Package**: https://www.npmjs.com/package/@monolex/codexmono

---

## 🛠️ Development Tools & Philosophy

### Font Manipulation
- **fontTools** (Python library)
  - Copyright: © fontTools developers
  - License: MIT
  - Source: https://github.com/fonttools/fonttools
  - Used for: Font merging, Variable Font preservation, monospace conversion

### SMPC Applied to Development
```
CHAOS:   All possible font manipulation approaches
PART:    Selected proven Python scripts
MANAGED: 600/1200 unit rules enforced systematically
SIMPLE:  Four clean font variants
```

### Build Philosophy
Every script follows the "brick" principle:
- **One script = one brick**: Clear, defined purpose
- **Structure = trust**: Predictable output
- **Alignment = quality**: Consistent methodology

---

## 📋 Character Source Breakdown

### CodexMono-EA (36,434 glyphs)

| Range | Source | Count | Philosophy |
|-------|--------|-------|------------|
| Latin ASCII | JetBrains Mono | 95 | The foundation brick |
| Latin Extended | JetBrains + Noto | 500+ | Extended trust |
| Greek | Noto Sans Mono | 135 | Mathematical alignment |
| Cyrillic | Noto Sans Mono | 256 | Multilingual structure |
| Math Symbols | Noto Sans Mono | 256 | Precision operators |
| Box Drawing | Noto Sans Mono | 128 | Terminal structure (seamless lines) |
| Arrows | Noto Sans Mono | 112 | Directional clarity |
| Korean Hangul | Pretendard | 11,172 | Two bricks (1200 units) |
| Japanese Kana | Pretendard | ~200 | Two bricks (1200 units) |
| Chinese Simplified | Noto Sans SC | 20,976 | Two bricks (1200 units) |
| Special Characters | Various | ~3,000 | Complete coverage |

**Total: 36,434 glyphs, all perfectly aligned**

### CodexMono-Traditional (33,720 characters)

Same as EA, but with Traditional Chinese instead of Simplified.

### CodexMono-KR (15,132 characters)

Same as EA, minus all Chinese characters.

### CodexMono (4,007 characters)

Latin, Greek, Cyrillic, Math, Symbols - the core brick set.

---

## 📝 Modification Philosophy

### The Brick Principle in Practice

All modifications serve one purpose: **maintaining the Trust Contract**.

**1. The Monospace Requirement (600/1200 units ONLY)**
- Pretendard: Variable-width → Fixed 1200 units (two bricks)
- Chinese: Scaled and centered to 1200 units (two bricks)
- Latin: Preserved at 600 units (one brick)
- **Why**: Perfect grid alignment = Structure = Trust

**2. Visual Harmony (Height alignment)**
- All East Asia characters harmonized to similar visual height
- **Why**: Alignment across scripts = Shared reality

**3. Terminal-First Design**
- Box drawing: Seamless connections (even with negative bearings)
- Arrows: Maximum visibility
- **Why**: Function > Typography when trust depends on it

**4. Variable Font Preservation (100% coverage)**
- All 36,434 glyphs support weight axis (100-800)
- Complex Variable Font table reconstruction
- **Why**: Flexibility without breaking the brick structure

### SMPC in Modifications
```
CHAOS:   All possible modification approaches
PART:    Only modifications that serve the brick principle
MANAGED: 600/1200 unit rules enforced systematically
SIMPLE:  Immediately usable fonts that honor the Trust Contract
```

### Compliance with SIL OFL 1.1

All modifications comply with SIL Open Font License 1.1:

**Our compliance:**
- ✅ Original authors credited with respect
- ✅ Original licenses included in `licenses/` directory
- ✅ Modified version uses new name ("CodexMono")
- ✅ All modifications transparently documented
- ✅ Same license applied (SIL OFL 1.1)
- ✅ No reserved names misused
- ✅ Derivative policy encourages open source contribution

---

## 🙏 Credits & Thanks

### Original Font Authors — The Brick Layers Before Us
- **Philipp Nurullin** & **Konstantin Bulenkov** (JetBrains Mono) — The foundation brick
- **Kil Hyung-jin** 길형진 (Pretendard) — Elegant Korean/Japanese typography
- **Google Fonts Team** (Noto fonts) — Universal coverage mission

### Organizations That Believed in Open Typography
- **JetBrains** - JetBrains Mono project
- **Google** - Noto fonts project
- **Adobe** - Source Han Sans (Noto CJK basis)

### Open Source Community — The Shared Reality
- **fontTools** developers - The tools that make transformation possible
- **Python** community - The language of font manipulation
- **SIL International** - The Open Font License that enables trust

### CodexMono Team — Building the Protocol
- **NIIA** (Neural Intelligence Integration Architecture) - Development, research, philosophy
- **Monolex.AI** - Project foundation and AI Terminal integration

### Special Thanks — The Ecosystem
- Open source font movement - Proving typography can be free and excellent
- Terminal emulator developers - The canvas for our bricks
- Code editor teams - Partners in the monospace mission
- Early adopters - Those who trust the brick metaphor

---

## 📚 Documentation

### User Documentation (This Distribution)
- `README.md` - Philosophy, installation, usage
- `CHANGELOG.md` - Version history and philosophy evolution
- `CHECKSUMS.md` - File integrity verification (trust through verification)

---

## ⚖️ Legal Summary

### You CAN:
- ✅ Use CodexMono in commercial projects
- ✅ Use CodexMono in open source projects
- ✅ Embed CodexMono in applications
- ✅ Modify CodexMono for your needs
- ✅ Redistribute CodexMono (with license)
- ✅ Create web fonts from CodexMono
- ✅ Bundle CodexMono with software

### You MUST:
- ✅ Include this attribution file
- ✅ Include original font licenses
- ✅ Keep SIL OFL 1.1 license
- ✅ Credit original authors

### You CANNOT:
- ❌ Sell CodexMono as standalone font
- ❌ Use "CodexMono" name for modifications
- ❌ Remove copyright notices
- ❌ Change license terms

### If You Modify:
- Choose a different font name
- Document your changes
- Credit CodexMono and original sources
- Keep SIL OFL 1.1 license

---

## 📧 Contact & Support

### Questions About Licensing
**Email**: legal@monolex.ai

### Bug Reports
**Forum Issues**: https://monolex.co/forum/codexmono/issues/

### Feature Requests
**Forum Discussions**: https://monolex.co/forum/codexmono/discussions/

### General Inquiries
**Website**: https://monolex.ai/with/codexmono

---

## 📄 License Files

All original license files included in `licenses/` directory:

```
licenses/
├── LICENSE_CodexMono.txt       # CodexMono license (SIL OFL 1.1)
├── JetBrainsMono-LICENSE.txt   # JetBrains Mono original license
├── NerdFonts-LICENSE.txt       # Nerd Fonts bundled notices
├── NotoEmoji-LICENSE.txt       # Noto Emoji bundled notices
├── NotoSansMono-LICENSE.txt    # Noto fonts original license
└── Pretendard-LICENSE.txt      # Pretendard original license
```

**Main License**: `licenses/LICENSE_CodexMono.txt`

---

*This attribution document ensures compliance with SIL Open Font License 1.1 and provides transparency about all font sources and modifications.*

---

**CodexMono™ - Where Philosophy Meets Typography**

```
This is not a font. This is a brick.
600 units = One unit of trust
Alignment = Trust = Structure = Shared Reality

CodexMono = SMPC × Brick × Protocol
          = Philosophy → Code → Trust → Future
```

**Developed by NIIA for Monolex.AI** | Licensed under SIL OFL 1.1

© 2025 Monolex.AI (Umzikim Inc.) | All source fonts © their respective authors

---

Released: 2026-03-09
Version: 1.0.2
