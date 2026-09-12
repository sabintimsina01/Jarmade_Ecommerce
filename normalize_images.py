import os
import shutil
import subprocess
from pathlib import Path


TARGET = 800
MAX_SIZE = int(TARGET * 0.75)
IMG_DIR = Path("public/images")

# Rebuild the homepage product-grid card assets from the larger jar assets.
# This avoids repeatedly normalizing already-normalized card images.
images_to_normalize = [
    ("jar-big-red-peach.webp", "card-big-red-peach.webp"),
    ("jar-blackberry-blast.webp", "card-blackberry.webp"),
    ("jar-green-tomato-relish.webp", "card-green-tomato.webp"),
    ("jar-o-henry-peach.webp", "card-o-henry-peach.webp"),
    ("jar-strawberry-smash-clean.webp", "card-strawberry.webp"),
]


def run(command):
    subprocess.run(command, check=True)


def dimensions(path):
    result = subprocess.run(
        ["magick", "identify", "-format", "%wx%h", str(path)],
        check=True,
        text=True,
        capture_output=True,
    )
    return result.stdout


if shutil.which("magick") is None:
    raise SystemExit("ImageMagick 'magick' command is required to normalize images.")

for source_name, output_name in images_to_normalize:
    source_path = IMG_DIR / source_name
    output_path = IMG_DIR / output_name
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    before = dimensions(source_path)
    tmp = output_path.with_suffix(".normalized.webp")

    # Remove only background connected to the image edges, trim the
    # remaining visible jar/photo, scale it to 75% of the square canvas,
    # then center it on a transparent 800x800 canvas.
    run(
        [
            "magick",
            str(source_path),
            "-alpha",
            "set",
            "-fuzz",
            "10%",
            "-fill",
            "none",
            "-draw",
            "color 0,0 floodfill",
            "-draw",
            "color %[fx:w-1],0 floodfill",
            "-draw",
            "color 0,%[fx:h-1] floodfill",
            "-draw",
            "color %[fx:w-1],%[fx:h-1] floodfill",
            "-trim",
            "+repage",
            "-resize",
            f"{MAX_SIZE}x{MAX_SIZE}",
            "-background",
            "none",
            "-gravity",
            "center",
            "-extent",
            f"{TARGET}x{TARGET}",
            "-strip",
            "-quality",
            "82",
            str(tmp),
        ]
    )

    os.replace(tmp, output_path)
    after = dimensions(output_path)
    print(f"Normalized {source_name} -> {output_name}: {before} -> {after}")

print("Done.")
