"""Reproduce the supplied lobster WebP without overwriting preserved originals.

Usage: python scripts/convert-images.py --output verification/rebuilt-lobster.webp
Install the pinned Pillow version in requirements-images.txt first.
"""
import argparse
import hashlib
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ORIGINAL = ROOT / "provenance" / "original-champagne-garlic-butter-bath-lobster-tails.png"

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    output = args.output.resolve()
    if output.exists():
        raise SystemExit("Output already exists; choose a new filename.")
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(ORIGINAL) as source:
        rgb = source.convert("RGB")
        resized = rgb.resize((1120, 747), Image.Resampling.LANCZOS)
        resized.save(output, "WEBP", quality=80, method=6)
    print("SHA-256:", hashlib.sha256(output.read_bytes()).hexdigest())
    print("WebP encoding may differ across libwebp versions; preserved files are unchanged.")

if __name__ == "__main__":
    main()
