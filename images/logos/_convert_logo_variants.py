#!/usr/bin/env python3
"""Convert checkerboard JPG logos → transparent PNG + SVG (potrace)."""

from __future__ import annotations

import base64
import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path("/Users/orcus/.cursor/projects/Users-orcus-Projects-bvlly/assets")
ROOT = Path("/Users/orcus/Projects/bvlly/images/logos")
BB = ROOT / "bully-beware-variants"
NM = ROOT / "never-mind-the-dog-variants"
TARGET_W = 2400

JOBS = [
    # (src, out_stem, out_dir, mode, fill_hex_or_None)
    # modes: dark_ink | light_ink | tan | camo
    (
        "BA1DC3A9-2D44-47D3-8904-2995706B2169_1_105_c-b1a25ee0-ddb7-4038-9c08-bbe8ccba9fc8.jpg",
        "bully-beware-black-distressed",
        BB,
        "dark_ink",
        "#000000",
    ),
    (
        "1226013F-3531-4FF9-8970-A22961B57BAD_1_105_c-5443bccd-a38e-48d8-b88d-8dd83b36aa72.jpg",
        "bully-beware-black",
        BB,
        "dark_ink",
        "#000000",
    ),
    (
        "1A5194E9-5F86-4FCE-B058-5C49B83144D0_1_105_c-236b18c4-89d7-407d-b98e-61b14385dc16.jpg",
        "bully-beware-tan",
        BB,
        "tan",
        "#C4A478",
    ),
    (
        "7E2E8329-EFFC-4F4C-8C9E-876D74EB0697_1_105_c-b2215e84-a648-427c-895a-94d8cb14cf0c.jpg",
        "bully-beware-white-distressed",
        BB,
        "light_ink",
        "#FFFFFF",
    ),
    (
        "F953E511-F7B8-4184-BF10-DA4C45D37AF3_1_105_c-b9135270-5590-4d56-9a94-e572cf6d2795.jpg",
        "bully-beware-cream-distressed",
        BB,
        "light_ink",
        "#F4EFE6",
    ),
    (
        "3A091C90-CCD6-4C32-8BD9-47E9DE28951A-4369774d-f4f1-4e00-a3ae-ea83bb5c5bdd.jpg",
        "never-mind-camo",
        NM,
        "camo",
        None,
    ),
    (
        "E6294C6B-6E97-4CED-BA8D-4D56B2909885_1_105_c-215e5196-bb5d-482d-a5b4-bda0f6e2b5c9.jpg",
        "never-mind-black-distressed",
        NM,
        "dark_ink",
        "#000000",
    ),
    (
        "86A00646-31C8-45FE-9AE6-FB42075D7B44_1_105_c-f2215ae7-a0d6-44a2-95d4-6ed618fdf0aa.jpg",
        "never-mind-cream-distressed",
        NM,
        "light_ink",
        "#F4EFE6",
    ),
    (
        "70F562BA-15A0-406C-BE64-90581C8189C5_1_105_c-59cfb99c-89df-4676-a3b7-1235f96a7728.jpg",
        "never-mind-white-distressed",
        NM,
        "light_ink",
        "#FFFFFF",
    ),
    (
        "58FA324B-B504-4725-B82C-E8317ABE53DA_1_105_c-954d8fbd-de36-47ef-9715-63a869422fa3.jpg",
        "never-mind-light-grey-distressed",
        NM,
        "light_ink",
        "#C8C8C8",
    ),
    (
        "B9A65275-C9F9-48D5-B452-B6D99179488E_1_105_c-c7f99a16-43d1-4bac-a032-d1f3ccc10b71.jpg",
        "never-mind-black",
        NM,
        "dark_ink",
        "#000000",
    ),
    (
        "64FECE83-183E-4516-935D-7D4F04FD8A55_1_105_c-88cd8cf1-b120-4ab3-930a-c8a77c29c870.jpg",
        "never-mind-cream",
        NM,
        "light_ink",
        "#F4EFE6",
    ),
    (
        "11FA4DAD-578D-499C-8D67-F338840449DE_1_105_c-65de1ebd-ddd6-4fb1-8daf-f3aa07d7c6cb.jpg",
        "never-mind-white",
        NM,
        "light_ink",
        "#FFFFFF",
    ),
]


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def estimate_ink_color(rgb: np.ndarray, alpha: np.ndarray) -> tuple[int, int, int]:
    """Median RGB of strongly opaque ink pixels."""
    mask = alpha >= 200
    if mask.sum() < 50:
        mask = alpha >= 128
    if mask.sum() == 0:
        return (0, 0, 0)
    samples = rgb[mask]
    med = np.median(samples, axis=0)
    return tuple(int(round(x)) for x in med)


def chroma(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    return (
        np.abs(r.astype(np.float32) - g)
        + np.abs(g.astype(np.float32) - b)
        + np.abs(r.astype(np.float32) - b)
    )


def clean_speckles(alpha: np.ndarray, min_size: int = 12) -> np.ndarray:
    """Remove tiny isolated opaque blobs far from letter mass (JPG noise)."""
    from scipy import ndimage  # optional; fallback if missing

    binary = alpha >= 128
    labeled, n = ndimage.label(binary)
    if n == 0:
        return alpha
    sizes = ndimage.sum(binary, labeled, range(1, n + 1))
    # Keep large components; drop tiny ones
    keep = np.zeros(n + 1, dtype=bool)
    keep[1:] = sizes >= min_size
    # Always keep the largest few
    order = np.argsort(sizes)[::-1]
    for i in order[:8]:
        keep[i + 1] = True
    mask = keep[labeled]
    out = alpha.copy()
    out[~mask] = 0
    return out


def make_alpha(rgb: np.ndarray, mode: str) -> np.ndarray:
    """Return uint8 alpha; ink opaque, checkerboard + cracks transparent."""
    lum = rgb.mean(axis=2).astype(np.float32)
    ch = chroma(rgb)

    # Border stats for checkerboard
    border = np.concatenate(
        [
            rgb[:12].reshape(-1, 3),
            rgb[-12:].reshape(-1, 3),
            rgb[:, :12].reshape(-1, 3),
            rgb[:, -12:].reshape(-1, 3),
        ]
    )
    blum = border.mean(axis=1)
    b_mean = float(blum.mean())
    b_lo, b_hi = np.percentile(blum, [10, 90])

    if mode == "dark_ink":
        if b_mean < 180:
            # Black ink on dark-grey checkerboard (NEVER MIND black variants)
            # Ink is near-pure black (lum ~0–30); checker ~55–130; cracks show checker
            thr_hard = 28.0
            thr_soft = 48.0
            alpha = np.clip((thr_soft - lum) / (thr_soft - thr_hard), 0, 1)
            alpha = np.where(lum >= 50, 0.0, alpha)
        else:
            # Black ink on light checkerboard (Bully BEWARE black variants)
            thr_hard = 90.0
            thr_soft = 140.0
            alpha = np.clip((thr_soft - lum) / (thr_soft - thr_hard), 0, 1)
            alpha = np.where((lum > 160) & (ch < 20), 0.0, alpha)
        return (alpha * 255).astype(np.uint8)

    if mode == "light_ink":
        # White/cream/grey on dark checkerboard
        # Detect ink peak: white (~250) vs cream (~230) vs light grey (~160)
        # Mid-checker cells (~110) must stay transparent
        ink_hi = float(np.percentile(lum, 97))
        if ink_hi < 200:
            # light grey ink (~160–170)
            thr_hard = 148.0
            thr_soft = 125.0
        else:
            thr_hard = 175.0
            thr_soft = 125.0
        alpha = np.clip((lum - thr_soft) / max(thr_hard - thr_soft, 1.0), 0, 1)
        # Cream warm mid tones
        mid = (lum > 150) & (lum < 210) & (ch > 10)
        alpha = np.maximum(alpha, mid.astype(np.float32) * 0.9)
        # Kill dark + mid checkerboard
        alpha = np.where(lum < 115, 0.0, alpha)
        alpha = np.where((lum < 140) & (ch < 15), 0.0, alpha)
        return (alpha * 255).astype(np.uint8)

    if mode == "tan":
        # Colored ink on light checkerboard — chroma + warm hue
        is_ink = (ch > 40) | ((lum < 200) & (ch > 18) & (rgb[..., 0] > rgb[..., 2] + 8))
        a = np.clip((ch - 12) / 60.0, 0, 1)
        a = np.maximum(a, is_ink.astype(np.float32))
        a = np.where((ch < 15) & (lum > 200), 0.0, a)
        a = np.where((ch < 10) & (lum > 180), 0.0, a)
        return (np.clip(a, 0, 1) * 255).astype(np.uint8)

    if mode == "camo":
        # Multicolor letters on dark checkerboard — keep anything not gray-checker
        grayish = ch < 22
        in_bg_lum = (lum >= (b_lo - 20)) & (lum <= (b_hi + 30))
        is_bg = grayish & in_bg_lum
        is_ink = (~is_bg) & (
            (ch > 20)
            | (lum < 40)
            | ((rgb[..., 1] > rgb[..., 2] + 8) & (ch > 12))
        )
        a = is_ink.astype(np.float32)
        soft = (~is_bg) & (ch > 12)
        a = np.maximum(a, soft.astype(np.float32) * 0.75)
        a = np.where(grayish & (lum > 35) & (lum < 165) & (ch < 18), 0.0, a)
        return (np.clip(a, 0, 1) * 255).astype(np.uint8)

    raise ValueError(mode)


def upscale_nearest(im: Image.Image, target_w: int = TARGET_W) -> Image.Image:
    w, h = im.size
    if w >= target_w:
        return im
    scale = target_w / w
    nw, nh = int(round(w * scale)), int(round(h * scale))
    return im.resize((nw, nh), Image.Resampling.NEAREST)


def build_png(src: Path, mode: str, fill_hex: str | None) -> Image.Image:
    rgb = np.array(Image.open(src).convert("RGB"))
    alpha = make_alpha(rgb, mode)
    try:
        from scipy import ndimage  # noqa: F401

        alpha = clean_speckles(alpha, min_size=18 if mode == "camo" else 10)
    except ImportError:
        pass

    if mode == "camo":
        rgba = np.dstack([rgb, alpha])
        out = Image.fromarray(rgba, "RGBA")
    else:
        # Solid fill from measured ink or provided hex; preserve alpha (holes)
        measured = estimate_ink_color(rgb, alpha)
        if fill_hex:
            # Prefer measured for cream/grey accuracy when not pure black/white/tan
            if fill_hex.upper() in ("#000000", "#FFFFFF", "#C4A478"):
                fill = hex_to_rgb(fill_hex)
                if fill_hex.upper() == "#C4A478" and measured[0] > 100:
                    # blend toward measured tan
                    fill = tuple(
                        int(round(0.35 * a + 0.65 * b)) for a, b in zip(fill, measured)
                    )
            else:
                fill = measured if sum(measured) > 30 else hex_to_rgb(fill_hex)
        else:
            fill = measured
        # For near-black, force pure black; near-white force white
        if fill_hex == "#000000":
            fill = (0, 0, 0)
        elif fill_hex == "#FFFFFF":
            fill = (255, 255, 255)
        h, w = alpha.shape
        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        rgba[..., 0] = fill[0]
        rgba[..., 1] = fill[1]
        rgba[..., 2] = fill[2]
        rgba[..., 3] = alpha
        out = Image.fromarray(rgba, "RGBA")

    # Crop to content with padding
    bbox = out.getbbox()
    if bbox:
        pad = 8
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(out.width, x1 + pad)
        y1 = min(out.height, y1 + pad)
        out = out.crop((x0, y0, x1, y1))

    return upscale_nearest(out)


def potrace_svg(png: Image.Image, fill_hex: str, title: str) -> str:
    """Trace alpha → SVG with given fill color."""
    # Binary mask for potrace (black = ink)
    alpha = np.array(png.split()[-1])
    # Threshold soft alpha
    mask = (alpha >= 128).astype(np.uint8) * 255
    bmp = Image.fromarray(mask, "L")

    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        pbm = td / "mask.pbm"
        svg_out = td / "out.svg"
        # potrace likes PBM/PGM
        bmp.save(pbm)  # Pillow writes PBM for mode 1 if we convert
        # Ensure PBM: convert via magick for reliability
        pbm2 = td / "mask2.pbm"
        subprocess.run(
            ["magick", str(pbm), "-threshold", "50%", "-negate", str(pbm2)],
            check=True,
        )
        subprocess.run(
            [
                "potrace",
                str(pbm2),
                "-s",
                "-o",
                str(svg_out),
                "--flat",
                "-t",
                "2",
                "-O",
                "0.2",
            ],
            check=True,
        )
        svg = svg_out.read_text()

    # Recolor fill
    svg = re.sub(r'fill="#?[0-9a-fA-F]*"', f'fill="{fill_hex}"', svg, count=1)
    if f'fill="{fill_hex}"' not in svg:
        svg = svg.replace('fill="#000000"', f'fill="{fill_hex}"')
        svg = svg.replace("fill=\"black\"", f'fill="{fill_hex}"')
        # potrace default group fill
        svg = re.sub(
            r'(<g[^>]*\sfill=")([^"]*)(")',
            rf"\g<1>{fill_hex}\3",
            svg,
            count=1,
        )
    # Ensure fill on group
    if "fill=" not in svg.split("<g", 1)[-1][:200] if "<g" in svg else True:
        svg = svg.replace("<g ", f'<g fill="{fill_hex}" ', 1)

    # Inject title
    if "<title>" not in svg:
        svg = svg.replace(
            "<svg",
            f"<svg",
            1,
        )
        svg = re.sub(
            r"(<svg[^>]*>)",
            rf'\1\n<title>{title}</title>\n',
            svg,
            count=1,
        )
    return svg


def camo_svg_wrapper(png_path: Path, w: int, h: int, title: str) -> str:
    data = base64.b64encode(png_path.read_bytes()).decode("ascii")
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
 width="{w}px" height="{h}px" viewBox="0 0 {w} {h}"
 preserveAspectRatio="xMidYMid meet">
<title>{title}</title>
<desc>Camouflage fill — embedded transparent PNG (self-contained).</desc>
<image width="{w}" height="{h}" xlink:href="data:image/png;base64,{data}"/>
</svg>
'''


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def main() -> None:
    BB.mkdir(parents=True, exist_ok=True)
    NM.mkdir(parents=True, exist_ok=True)
    results = []

    for src_name, stem, out_dir, mode, fill_hex in JOBS:
        src = ASSETS / src_name
        print(f"→ {stem} ({mode})")
        png = build_png(src, mode, fill_hex)
        png_path = out_dir / f"{stem}.png"
        png.save(png_path, "PNG", optimize=True)

        # Determine fill for SVG
        if mode == "camo":
            svg = camo_svg_wrapper(
                png_path, png.width, png.height, stem.replace("-", " ")
            )
            used_fill = "camo-rgb"
        else:
            arr = np.array(png)
            alpha = arr[..., 3]
            measured = estimate_ink_color(arr[..., :3], alpha)
            if fill_hex == "#000000":
                used = "#000000"
            elif fill_hex == "#FFFFFF":
                used = "#ffffff"
            elif fill_hex == "#C4A478":
                used = rgb_to_hex(measured) if measured[0] > 100 else fill_hex
            else:
                used = rgb_to_hex(measured)
            svg = potrace_svg(png, used, stem.replace("-", " "))
            used_fill = used

        svg_path = out_dir / f"{stem}.svg"
        svg_path.write_text(svg)
        results.append((stem, png_path, svg_path, png.size, used_fill))
        print(f"  PNG {png.size} fill={used_fill} → {png_path.name}")

    print("\nDONE", len(results), "variants")
    for r in results:
        print(r[0], r[3], r[4])


if __name__ == "__main__":
    main()
