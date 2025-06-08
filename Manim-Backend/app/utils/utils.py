# app/utils.py
import re
from pathlib import Path
from typing import Optional

CLASS_RX = re.compile(r"class\s+(\w+)\s*\(\s*Scene\s*\)")

def find_scene_class(source: str) -> Optional[str]:
    """Return the first class that inherits from Scene."""
    match = CLASS_RX.search(source)
    return match.group(1) if match else None

def video_output_path(script_name: Path, scene_class: str) -> Path:
    # Manim puts videos under media/videos/<script_name_without_py>/<quality>/<Scene>.mp4
    folder = script_name.stem
    return Path("media") / "videos" / folder / "1080p60" / f"{scene_class}.mp4"
