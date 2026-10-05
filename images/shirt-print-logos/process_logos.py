#!/usr/bin/env python3
"""Process BVLLY shirt-print logo sources → transparent PNG + SVG."""

from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

# Reuse keyed alpha + potrace pipeline from logos folder
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "logos"))
import _convert_logo_variants as cv  # noqa: E402

ASSETS = Path("/Users/orcus/.cursor/projects/Users-orcus-Projects-bvlly/assets")
OUT = Path(__file__).resolve().parent

# (source basename prefix, output stem, mode, fill_hex or None)
JOBS: list[tuple[str, str, str, str | None]] = [
    # NEVER MIND THE DOG, BEWARE THE OWNER
    ("IMG_7886", "never-mind-dog-owner-camo", "camo", None),
    ("IMG_7885", "never-mind-dog-owner-cream", "light_ink", "#F4EFE6"),
    ("IMG_7884", "never-mind-dog-owner-white", "light_ink", "#FFFFFF"),
    ("IMG_7883", "never-mind-dog-owner-black", "dark_ink", "#000000"),
    ("IMG_7882", "never-mind-dog-owner-light-gray-distressed", "light_ink", "#C8C8C8"),
    ("IMG_7880", "never-mind-dog-owner-black-distressed", "dark_ink", "#000000"),
    ("IMG_7879", "never-mind-dog-owner-cream-distressed", "light_ink", "#F4EFE6"),
    ("IMG_7881", "never-mind-dog-owner-white-distressed", "light_ink", "#FFFFFF"),
    ("IMG_7887", "never-mind-dog-owner-stone-texture", "stone_texture", None),
    ("IMG_7889", "never-mind-dog-owner-metallic-stone", "stone_texture", None),
    ("IMG_7888", "never-mind-dog-owner-stone-distressed", "stone_texture", None),
    # Bully BEWARE!
    ("IMG_7878", "bully-beware-cream-distressed", "light_ink", "#F4EFE6"),
    ("IMG_7877", "bully-beware-white-distressed", "light_ink", "#FFFFFF"),
    ("IMG_7875", "bully-beware-tan", "tan", "#C4A478"),
    ("IMG_7873", "bully-beware-black", "dark_ink", "#000000"),
    ("IMG_7874", "bully-beware-black-alt", "dark_ink", "#000000"),
    ("IMG_7876", "bully-beware-black-distressed", "dark_ink", "#000000"),
    ("0DD75D64", "bully-beware-stone-texture", "white_bg_texture", None),
    ("BF440AFF", "bully-beware-stone-texture-alt", "white_bg_texture", None),
]

TEXTURED_STEMS = {
    "never-mind-dog-owner-camo",
    "never-mind-dog-owner-stone-texture",
    "never-mind-dog-owner-metallic-stone",
    "never-mind-dog-owner-stone-distressed",
    "bully-beware-stone-texture",
    "bully-beware-stone-texture-alt",
}

POTRACE_FILL = {
    "never-mind-dog-owner-black": "#000000",
    "never-mind-dog-owner-black-distressed": "#000000",
    "never-mind-dog-owner-white": "#ffffff",
    "never-mind-dog-owner-white-distressed": "#ffffff",
    "never-mind-dog-owner-cream": "#F4EFE6",
    "never-mind-dog-owner-cream-distressed": "#F4EFE6",
    "never-mind-dog-owner-light-gray-distressed": "#C8C8C8",
    "bully-beware-black": "#000000",
    "bully-beware-black-alt": "#000000",
    "bully-beware-black-distressed": "#000000",
    "bully-beware-white-distressed": "#ffffff",
    "bully-beware-cream-distressed": "#F4EFE6",
    "bully-beware-tan": "#C4A478",
}


def resolve_src(prefix: str) -> Path:
    matches = sorted(ASSETS.glob(f"{prefix}*"))
    if not matches:
        raise FileNotFoundError(prefix)
    return matches[0]


def load_rgb(src: Path):
    import numpy as np
    from PIL import Image

    im = Image.open(src)
    if im.mode == "RGBA":
        arr = np.array(im)
        # Some exports ship with empty alpha; fall back to RGB composite on white
        if arr[..., 3].max() < 8:
            im = Image.open(src).convert("RGB")
            return np.array(im)
        rgb = arr[..., :3]
        a = arr[..., 3]
        # Premultiply-aware flatten for any partial alpha
        bg = np.ones_like(rgb) * 255
        rgb = (rgb * (a[..., None] / 255.0) + bg * (1 - a[..., None] / 255.0)).astype(
            np.uint8
        )
        return rgb
    return np.array(im.convert("RGB"))


def _border_pixels(rgb, margin: int = 14):
    import numpy as np

    return np.concatenate(
        [
            rgb[:margin].reshape(-1, 3),
            rgb[-margin:].reshape(-1, 3),
            rgb[:, :margin].reshape(-1, 3),
            rgb[:, -margin:].reshape(-1, 3),
        ]
    )


def _checker_colors(rgb) -> tuple:
    import numpy as np

    pts = _border_pixels(rgb).astype(np.float32)
    c1 = pts.mean(axis=0)
    d = np.linalg.norm(pts - c1, axis=1)
    far = pts[d >= np.median(d)]
    c2 = far.mean(axis=0) if len(far) else c1
    return c1, c2


def _local_lum_std(lum):
    import numpy as np

    k = 9
    pad = k // 2
    lum_f = lum.astype(np.float32)
    p = np.pad(lum_f, pad, mode="edge")
    h, w = lum_f.shape
    mean = np.zeros_like(lum_f)
    mean_sq = np.zeros_like(lum_f)
    for dy in range(k):
        for dx in range(k):
            sl = p[dy : dy + h, dx : dx + w]
            mean += sl
            mean_sq += sl * sl
    mean /= k * k
    mean_sq /= k * k
    return np.sqrt(np.maximum(mean_sq - mean * mean, 0))


def _checker_distance(rgb) -> tuple:
    import numpy as np

    c1, c2 = _checker_colors(rgb)
    rgbf = rgb.astype(np.float32)
    d1 = np.linalg.norm(rgbf - c1, axis=2)
    d2 = np.linalg.norm(rgbf - c2, axis=2)
    return np.minimum(d1, d2), c1, c2


def _dilate_max(mask, iterations: int = 12):
    import numpy as np

    m = mask.astype(np.uint8)
    for _ in range(iterations):
        p = np.pad(m, 1, mode="constant")
        m = np.maximum.reduce(
            [p[0:-2, 0:-2], p[0:-2, 1:-1], p[0:-2, 2:], p[1:-1, 0:-2], p[1:-1, 1:-1], p[1:-1, 2:], p[2:, 0:-2], p[2:, 1:-1], p[2:, 2:]]
        )
    return m.astype(bool)


def make_alpha_stone_texture(rgb):
    """Grayscale stone/metal on checkerboard — seed + dilate, then key grid."""
    import numpy as np

    dmin, _, _ = _checker_distance(rgb)
    lum = rgb.mean(axis=2).astype(np.float32)
    ch = cv.chroma(rgb)
    lstd = _local_lum_std(lum)
    camo_seed = cv.make_alpha(rgb, "camo") >= 128
    filled = _dilate_max(camo_seed, iterations=15)

    flat_checker = (dmin < 20) & (lstd < 9) & (ch < 22)
    alpha = filled & ~flat_checker
    # Drop shadows (dark, attached to letters only)
    shadow = (lum < 50) & (ch < 18) & _dilate_max(filled, iterations=4)
    alpha = alpha | shadow
    alpha = alpha.astype(np.float32)
    fringe = (dmin < 24) & (lstd < 10) & (ch < 22) & (alpha > 0.5)
    alpha = np.where(fringe, 0.0, alpha)
    return (np.clip(alpha, 0, 1) * 255).astype(np.uint8)


def make_alpha_camo(rgb) -> np.ndarray:
    """Camo fill on checkerboard."""
    import numpy as np

    base = cv.make_alpha(rgb, "camo").astype(np.float32) / 255.0
    dmin, _, _ = _checker_distance(rgb)
    lum = rgb.mean(axis=2).astype(np.float32)
    ch = cv.chroma(rgb)
    lstd = _local_lum_std(lum)

    flat_checker = (dmin < 26) & (ch < 34) & (lstd < 13)
    is_camo = ch > 34
    alpha = base.copy()
    alpha = np.where(flat_checker & ~is_camo, 0.0, alpha)
    alpha = np.where(is_camo, 1.0, alpha)
    # Final scrub: any remaining flat checker cells
    alpha = np.where(flat_checker & (alpha < 0.85), 0.0, alpha)
    return (np.clip(alpha, 0, 1) * 255).astype(np.uint8)


def make_alpha_white_bg_texture(rgb):
    import numpy as np

    lum = rgb.mean(axis=2).astype(np.float32)
    ch = cv.chroma(rgb)
    is_bg = (lum > 246) | ((lum > 238) & (ch < 10))
    alpha = np.where(is_bg, 0.0, 1.0).astype(np.float32)
    # Soft fringe
    fringe = (lum > 230) & (lum <= 246) & (ch < 12)
    alpha = np.where(fringe, np.clip((250 - lum) / 20.0, 0, 1), alpha)
    return (alpha * 255).astype(np.uint8)


def _label_opaque_components(binary):
    import numpy as np

    h, w = binary.shape
    labels = np.zeros((h, w), dtype=np.int32)
    label = 0
    sizes: dict[int, int] = {}
    for y in range(h):
        for x in range(w):
            if not binary[y, x] or labels[y, x]:
                continue
            label += 1
            stack = [(y, x)]
            labels[y, x] = label
            n = 0
            while stack:
                cy, cx = stack.pop()
                n += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = cy + dy, cx + dx
                    if (
                        0 <= ny < h
                        and 0 <= nx < w
                        and binary[ny, nx]
                        and labels[ny, nx] == 0
                    ):
                        labels[ny, nx] = label
                        stack.append((ny, nx))
            sizes[label] = n
    return labels, sizes


def remove_isolated_speckles(png, min_area: int = 220):
    """Drop tiny opaque blobs disconnected from letterforms (alpha >= 128)."""
    import numpy as np
    from PIL import Image

    arr = np.array(png.convert("RGBA"))
    alpha = arr[..., 3]
    binary = alpha >= 128
    labels, sizes = _label_opaque_components(binary)

    kill = {lid for lid, sz in sizes.items() if sz < min_area}
    if not kill:
        return png, 0, 0
    mask = np.isin(labels, list(kill))
    removed_px = int(mask.sum())
    alpha[mask] = 0
    arr[..., 3] = alpha
    return Image.fromarray(arr, "RGBA"), len(kill), removed_px


def clean_flat_print_png(png, min_area: int = 220):
    """Flat single-color inks: drop dust outside glyphs, keep distress holes."""
    png, n_comp, n_px = remove_isolated_speckles(png, min_area=min_area)
    png, n_bbox = clear_alpha_outside_letter_bbox(png, pad=18)
    png, n_faint = remove_faint_detached_fringe(png, dilate_iters=4)
    return png, {
        "speckle_comps": n_comp,
        "speckle_px": n_px,
        "bbox_px": n_bbox,
        "faint_px": n_faint,
    }


def clean_textured_print_png(
    png,
    min_component: int = 900,
    top_n: int = 35,
    pad: int = 56,
    shadow_pad: int = 18,
):
    """Camo/stone: trim margin JPEG dust; keep internal texture grains."""
    import numpy as np
    from PIL import Image

    arr = np.array(png.convert("RGBA"))
    alpha = arr[..., 3].copy()
    binary = alpha >= 128
    labels, sizes = _label_opaque_components(binary)
    if not sizes:
        return png, {"outside_px": 0, "faint_px": 0}

    ranked = sorted(sizes.items(), key=lambda kv: kv[1], reverse=True)
    keep = {lid for lid, sz in ranked if sz >= min_component}
    for lid, _ in ranked[:top_n]:
        keep.add(lid)
    letter_mask = np.isin(labels, list(keep))
    ink_zone = _dilate_max(letter_mask, iterations=16)
    h, w = alpha.shape
    ys, xs = np.where(ink_zone)
    y0, y1 = int(ys.min()), int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    y0 = max(0, y0 - pad)
    x0 = max(0, x0 - pad)
    y1 = min(h - 1, y1 + pad)
    x1 = min(w - 1, x1 + pad)
    in_canvas = np.zeros_like(alpha, dtype=bool)
    in_canvas[y0 : y1 + 1, x0 : x1 + 1] = True
    drop = (~ink_zone & (alpha > 0)) | (~in_canvas & (alpha > 0))
    removed_out = int(drop.sum())
    alpha[drop] = 0
    ys_c, _ = np.where(letter_mask)
    y0c, y1c = int(ys_c.min()), int(ys_c.max())
    vert_drop = ((np.arange(h)[:, None] < y0c - 14) | (np.arange(h)[:, None] > y1c + shadow_pad)) & (
        alpha > 0
    )
    removed_out += int(vert_drop.sum())
    alpha[vert_drop] = 0
    arr[..., 3] = alpha
    # Drop small opaque islands not part of major letter chunks (camo JPEG dust).
    binary2 = alpha >= 128
    labels2, sizes2 = _label_opaque_components(binary2)
    small_orphans = {lid for lid, sz in sizes2.items() if lid not in keep and sz < 380}
    if small_orphans:
        orphan_mask = np.isin(labels2, list(small_orphans))
        removed_out += int(orphan_mask.sum())
        alpha[orphan_mask] = 0
        arr[..., 3] = alpha
    png = Image.fromarray(arr, "RGBA")
    png, n_faint = remove_faint_detached_fringe(png, dilate_iters=5)
    return png, {"outside_px": removed_out, "faint_px": n_faint}


def svg_for_png(stem: str, png_path: Path, png) -> str:
    title = stem.replace("-", " ")
    if stem in TEXTURED_STEMS:
        return embedded_svg(png_path, png.width, png.height, title)
    import numpy as np

    arr = np.array(png)
    measured = cv.estimate_ink_color(arr[..., :3], arr[..., 3])
    fill = POTRACE_FILL.get(stem, cv.rgb_to_hex(measured))
    if fill == "#C4A478" and measured[0] > 100:
        fill = cv.rgb_to_hex(measured)
    elif fill == "#F4EFE6" and sum(measured) > 400:
        fill = cv.rgb_to_hex(measured)
    elif fill == "#C8C8C8":
        fill = cv.rgb_to_hex(measured)
    return cv.potrace_svg(png, fill, title)


def clean_all_print_assets() -> list[tuple[str, dict, bool]]:
    """Clean every PNG in OUT and refresh matching SVG."""
    import numpy as np
    from PIL import Image

    report: list[tuple[str, dict, bool]] = []
    for png_path in sorted(OUT.glob("*.png")):
        stem = png_path.stem
        before = Image.open(png_path)
        if stem in TEXTURED_STEMS:
            sp = 88 if "stone" in stem else 18
            cleaned, stats = clean_textured_print_png(before, shadow_pad=sp)
        else:
            cleaned, stats = clean_flat_print_png(before)
        changed = np.array(before)[..., 3].sum() != np.array(cleaned)[..., 3].sum()
        cleaned.save(png_path, "PNG", optimize=True)
        svg_path = OUT / f"{stem}.svg"
        svg_path.write_text(svg_for_png(stem, png_path, cleaned))
        report.append((stem, stats, changed))
    return report


def remove_faint_detached_fringe(png, dilate_iters: int = 4):
    """Delete low-alpha pixels not adjacent to solid (>=128) letter ink."""
    import numpy as np
    from PIL import Image

    arr = np.array(png.convert("RGBA"))
    alpha = arr[..., 3].copy()
    core = alpha >= 128
    near = _dilate_max(core, iterations=dilate_iters)
    detached = (alpha > 0) & (alpha < 128) & ~near
    removed = int(detached.sum())
    alpha[detached] = 0
    arr[..., 3] = alpha
    return Image.fromarray(arr, "RGBA"), removed


def clear_alpha_outside_letter_bbox(png, pad: int = 18):
    """Remove fringe/speckle alpha outside the main glyph bounding box."""
    import numpy as np
    from PIL import Image

    arr = np.array(png.convert("RGBA"))
    alpha = arr[..., 3].copy()
    core = alpha >= 128
    if not core.any():
        return png, 0
    ys, xs = np.where(core)
    y0, y1 = int(ys.min()), int(ys.max())
    x0, x1 = int(xs.min()), int(xs.max())
    y0 = max(0, y0 - pad)
    x0 = max(0, x0 - pad)
    y1 = min(alpha.shape[0] - 1, y1 + pad)
    x1 = min(alpha.shape[1] - 1, x1 + pad)
    outside = np.ones_like(alpha, dtype=bool)
    outside[y0 : y1 + 1, x0 : x1 + 1] = False
    removed = int((outside & (alpha > 0)).sum())
    alpha[outside] = 0
    arr[..., 3] = alpha
    return Image.fromarray(arr, "RGBA"), removed


def scrub_checker_artifacts(rgb, alpha, mode: str):
    """Remove leftover checkerboard / JPEG halo pixels from alpha."""
    import numpy as np

    a = alpha.astype(np.float32)
    dmin, _, _ = _checker_distance(rgb)
    lum = rgb.mean(axis=2).astype(np.float32)
    ch = cv.chroma(rgb)
    lstd = _local_lum_std(lum)

    flat_cb = (dmin < 26) & (ch < 32) & (lstd < 12)
    a = np.where(flat_cb, 0.0, a)
    if mode == "camo":
        weak = (dmin < 32) & (ch < 30) & (a < 220)
        a = np.where(weak, 0.0, a)
    if mode == "stone_texture":
        halo = (lum > 205) & (ch < 14) & (dmin > 22)
        a = np.where(halo, 0.0, a)
        a = np.where(flat_cb | ((dmin < 22) & (lstd < 10)), 0.0, a)
    # Hard matte + remove mis-keyed opaque checker cells
    a = np.where(a >= 140, 255.0, 0.0)
    miskeyed = (a > 200) & flat_cb
    a = np.where(miskeyed, 0.0, a)
    return (np.clip(a, 0, 255)).astype(np.uint8)


def build_png_from_rgb(rgb, mode: str, fill_hex: str | None):
    import numpy as np
    from PIL import Image

    if mode == "white_bg_texture":
        alpha = make_alpha_white_bg_texture(rgb)
    elif mode == "stone_texture":
        alpha = make_alpha_stone_texture(rgb)
    elif mode == "camo":
        alpha = make_alpha_camo(rgb)
    else:
        alpha = cv.make_alpha(rgb, mode)

    if mode in ("camo", "stone_texture"):
        alpha = scrub_checker_artifacts(rgb, alpha, mode)

    try:
        alpha = cv.clean_speckles(alpha, min_size=18 if mode in ("camo", "stone_texture") else 10)
    except Exception:
        pass

    if mode in ("camo", "stone_texture", "white_bg_texture"):
        rgba = np.dstack([rgb, alpha])
        out = Image.fromarray(rgba, "RGBA")
    else:
        measured = cv.estimate_ink_color(rgb, alpha)
        if fill_hex:
            if fill_hex.upper() in ("#000000", "#FFFFFF", "#C4A478"):
                fill = cv.hex_to_rgb(fill_hex)
                if fill_hex.upper() == "#C4A478" and measured[0] > 100:
                    fill = tuple(
                        int(round(0.35 * a + 0.65 * b))
                        for a, b in zip(fill, measured, strict=True)
                    )
            else:
                fill = measured if sum(measured) > 30 else cv.hex_to_rgb(fill_hex)
        else:
            fill = measured
        if fill_hex == "#000000":
            fill = (0, 0, 0)
        elif fill_hex == "#FFFFFF":
            fill = (255, 255, 255)
        h, w = alpha.shape
        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[..., 0], rgba[..., 1], rgba[..., 2] = fill
        rgba[..., 3] = alpha
        out = Image.fromarray(rgba, "RGBA")

    bbox = out.getbbox()
    if bbox:
        pad = 12
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(out.width, x1 + pad)
        y1 = min(out.height, y1 + pad)
        out = out.crop((x0, y0, x1, y1))
    out = cv.upscale_nearest(out)
    if mode in ("light_ink", "dark_ink", "tan"):
        out, _ = clean_flat_print_png(out, min_area=220)
    return out


def _hex_rgb(rgb_tuple) -> str:
    return "#{:02x}{:02x}{:02x}".format(
        int(rgb_tuple[0]), int(rgb_tuple[1]), int(rgb_tuple[2])
    )


def build_stone_via_magick(src: Path):
    """Dual-color key for textured stone on checkerboard (ImageMagick)."""
    import numpy as np
    from PIL import Image

    rgb = load_rgb(src)
    c1, c2 = _checker_colors(rgb)
    colors = [_hex_rgb(c1), _hex_rgb(c2), "#ffffff", "#fefefe", "#fdfdfd"]
    with tempfile.TemporaryDirectory() as td:
        out = Path(td) / "keyed.png"
        cmd = ["magick", str(src), "-alpha", "set"]
        for col in colors:
            cmd += ["-fuzz", "14%", "-transparent", col]
        cmd.append(str(out))
        subprocess.run(cmd, check=True, capture_output=True)
        im = Image.open(out).convert("RGBA")
    # Touch-up with PIL scrub on RGB part
    arr = np.array(im)
    rgb2 = arr[..., :3]
    alpha = scrub_checker_artifacts(rgb2, arr[..., 3], "stone_texture")
    arr[..., 3] = alpha
    return Image.fromarray(arr, "RGBA")


def build_png_src(src: Path, mode: str, fill_hex: str | None):
    from PIL import Image

    if mode == "stone_texture":
        out = build_stone_via_magick(src)
        bbox = out.getbbox()
        if bbox:
            pad = 12
            x0, y0, x1, y1 = bbox
            x0 = max(0, x0 - pad)
            y0 = max(0, y0 - pad)
            x1 = min(out.width, x1 + pad)
            y1 = min(out.height, y1 + pad)
            out = out.crop((x0, y0, x1, y1))
        return cv.upscale_nearest(out)

    rgb = load_rgb(src)
    return build_png_from_rgb(rgb, mode, fill_hex)


def embedded_svg(png_path: Path, w: int, h: int, title: str) -> str:
    return cv.camo_svg_wrapper(png_path, w, h, title)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    textured_modes = {"camo", "stone_texture", "white_bg_texture"}

    for prefix, stem, mode, fill_hex in JOBS:
        src = resolve_src(prefix)
        print(f"→ {stem} ← {src.name}")
        png = build_png_src(src, mode, fill_hex)
        png_path = OUT / f"{stem}.png"
        png.save(png_path, "PNG", optimize=True)

        title = stem.replace("-", " ")
        if mode in textured_modes:
            svg = embedded_svg(png_path, png.width, png.height, title)
            used = "embedded-rgba"
        else:
            import numpy as np

            arr = np.array(png)
            measured = cv.estimate_ink_color(arr[..., :3], arr[..., 3])
            if fill_hex == "#000000":
                used = "#000000"
            elif fill_hex == "#FFFFFF":
                used = "#ffffff"
            elif fill_hex == "#C4A478":
                used = cv.rgb_to_hex(measured) if measured[0] > 100 else fill_hex
            else:
                used = cv.rgb_to_hex(measured)
            svg = cv.potrace_svg(png, used, title)

        svg_path = OUT / f"{stem}.svg"
        svg_path.write_text(svg)
        results.append((stem, png.size, used if mode not in textured_modes else "embedded"))
        print(f"  {png.size} → {png_path.name}")

    print(f"\nDONE {len(results)} pairs in {OUT}")
    for r in results:
        print(" ", r)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "clean":
        results = clean_all_print_assets()
        changed_n = sum(1 for _, _, ch in results if ch)
        print(f"Cleaned {len(results)} PNG/SVG pairs ({changed_n} modified)")
        for stem, stats, ch in results:
            flag = "updated" if ch else "unchanged"
            print(f"  {stem}: {flag} {stats}")
    else:
        main()
