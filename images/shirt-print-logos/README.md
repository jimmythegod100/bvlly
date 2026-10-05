# BVLLY shirt-print logos

Print-ready transparent PNG (2400px wide) + SVG pairs derived from the Oct 2025 source mockups.

## Phrase families

### NEVER MIND THE DOG, BEWARE THE OWNER (3-line gothic)

| File stem | Print notes |
|-----------|-------------|
| `never-mind-dog-owner-black` | Dark shirts / light garments |
| `never-mind-dog-owner-black-distressed` | Dark shirts; cracks print as garment color |
| `never-mind-dog-owner-white` | Light vector fill — dark or colored shirts |
| `never-mind-dog-owner-white-distressed` | Dark shirts |
| `never-mind-dog-owner-cream` | Warm off-white — dark shirts |
| `never-mind-dog-owner-cream-distressed` | Dark shirts |
| `never-mind-dog-owner-light-gray-distressed` | Mid/dark shirts |
| `never-mind-dog-owner-camo` | Full-color camo texture (embedded PNG in SVG) |
| `never-mind-dog-owner-stone-texture` | Gray stone + shadow (embedded PNG in SVG) |
| `never-mind-dog-owner-metallic-stone` | Beveled metallic/stone (embedded PNG in SVG) |
| `never-mind-dog-owner-stone-distressed` | Distressed stone gray (embedded PNG in SVG) |

### Bully BEWARE! (2-line gothic)

| File stem | Print notes |
|-----------|-------------|
| `bully-beware-black` / `bully-beware-black-alt` | Same art, two exports — pick one for production |
| `bully-beware-black-distressed` | Dark shirts |
| `bully-beware-white-distressed` | Dark shirts |
| `bully-beware-cream-distressed` | Dark shirts |
| `bully-beware-tan` | Tan/khaki solid — dark or neutral shirts |
| `bully-beware-stone-texture` / `bully-beware-stone-texture-alt` | Gray stone fill (embedded PNG in SVG) |

## Pipeline

1. Checkerboard JPGs: PIL luminance/chroma key → solid-fill PNG (distress holes stay transparent) → **potrace** SVG for flat inks.
2. Camo / stone textures: keyed RGBA → **self-contained SVG** with embedded PNG (preserves texture).
3. White-background stone PNGs: white keyed + embedded SVG.

Regenerate from sources: `python3 process_logos.py` (Pillow, ImageMagick `magick`, `potrace`).

Re-run dust/speckle cleanup on all exports: `python3 process_logos.py clean` (refreshes every PNG + matching SVG).

**Crisp solid flats** (white/black/cream/tan — not distressed): `python3 process_logos.py crisp` re-keys at native resolution, potrace (`-t 5 -O 0.1 -a 0.85`), then renders PNG at 2400px from the SVG via ImageMagick (512 DPI).
