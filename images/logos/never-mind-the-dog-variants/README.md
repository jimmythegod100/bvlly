# NEVER MIND THE DOG, BEWARE THE OWNER — logo variants

Transparent PNG + SVG letterforms converted from checkerboard JPG sources.
Distress cracks are alpha cutouts (holes). Width ≥ 2400px.

| File | Color | Notes |
|------|-------|-------|
| `never-mind-camo.png` / `.svg` | Multicolor camo RGB | Special: PNG keeps full RGB; SVG is self-contained base64 `<image>` wrapper |
| `never-mind-black-distressed.png` / `.svg` | `#000000` | Distressed (black on dark checkerboard keyed tightly) |
| `never-mind-cream-distressed.png` / `.svg` | `#f1e8cc` | Distressed cream |
| `never-mind-white-distressed.png` / `.svg` | `#ffffff` | Distressed |
| `never-mind-light-grey-distressed.png` / `.svg` | `#a0a1a0` | Distressed light grey |
| `never-mind-black.png` / `.svg` | `#000000` | Solid / clean |
| `never-mind-cream.png` / `.svg` | `#f3e3c1` | Solid cream |
| `never-mind-white.png` / `.svg` | `#ffffff` | Solid white |

Pipeline: PIL checkerboard key → nearest upscale → potrace SVG (camo: embedded PNG).
