#!/usr/bin/env python3
"""Generate app-owned caption JSON from a saved YouTube transcript JSON.

Expected transcript shape matches the Hermes youtube-content helper:
{
  "timestamped_text": "0:44 All\n0:45 right,..."
}

Example:
  python3 scripts/generate-captions.py \
    --transcript /tmp/cs50_week1_transcript.json \
    --out public/captions/harvard-cs50x/week-1.ko.json \
    --window 15 \
    --translate
"""

from __future__ import annotations

import argparse
import json
import re
import time
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate timed caption JSON from timestamped transcript JSON")
    parser.add_argument("--transcript", required=True, type=Path, help="Transcript JSON produced by fetch_transcript.py --timestamps")
    parser.add_argument("--out", required=True, type=Path, help="Destination caption JSON under public/captions")
    parser.add_argument("--window", default=15, type=int, help="Subtitle window in seconds")
    parser.add_argument("--translate", action="store_true", help="Translate English windows to Korean with deep-translator")
    parser.add_argument("--cache", type=Path, help="Optional translation cache JSON")
    return parser.parse_args()


def transcript_rows(timestamped_text: str) -> list[tuple[int, str]]:
    rows: list[tuple[int, str]] = []
    for line in timestamped_text.splitlines():
        match = re.match(r"^(\d+):(\d{2})\s+(.*)", line)
        if not match:
            continue
        seconds = int(match.group(1)) * 60 + int(match.group(2))
        text = re.sub(r"\s+", " ", match.group(3)).strip()
        if text:
            rows.append((seconds, text))
    return rows


def window_captions(rows: list[tuple[int, str]], window: int) -> list[dict[str, object]]:
    if not rows:
        return []

    captions: list[dict[str, object]] = []
    max_second = rows[-1][0]
    for start in range(0, max_second + window, window):
        end = start + window
        parts = [text for seconds, text in rows if start <= seconds < end]
        if not parts:
            continue
        captions.append({
            "startSeconds": start,
            "endSeconds": end,
            "textEn": re.sub(r"\s+", " ", " ".join(parts)).strip(),
        })
    return captions


def add_korean(captions: list[dict[str, object]], cache_path: Path | None) -> None:
    try:
        from deep_translator import GoogleTranslator
    except ImportError as error:
        raise SystemExit("Install dependency first: pip install deep-translator") from error

    cache: dict[str, str] = {}
    if cache_path and cache_path.exists():
        cache = json.loads(cache_path.read_text())

    translator = GoogleTranslator(source="en", target="ko")
    for index, caption in enumerate(captions, 1):
        text_en = str(caption["textEn"])
        if text_en in cache:
            caption["textKo"] = cache[text_en]
            continue

        for attempt in range(3):
            try:
                text_ko = translator.translate(text_en)
                caption["textKo"] = text_ko
                cache[text_en] = text_ko
                break
            except Exception as error:  # noqa: BLE001 - external translator can fail in many ways
                if attempt == 2:
                    caption["textKo"] = text_en
                    cache[text_en] = text_en
                    print(f"WARN translate failed at {caption['startSeconds']}: {error}")
                else:
                    time.sleep(1.5 * (attempt + 1))

        if cache_path and index % 25 == 0:
            cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")
            print(f"translated {index}/{len(captions)}")

    if cache_path:
        cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n")


def main() -> None:
    args = parse_args()
    transcript = json.loads(args.transcript.read_text())
    captions = window_captions(transcript_rows(transcript["timestamped_text"]), args.window)

    if args.translate:
        add_korean(captions, args.cache)
    else:
        for caption in captions:
            caption["textKo"] = caption["textEn"]

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(captions, ensure_ascii=False, indent=2) + "\n")
    print(f"wrote {args.out} with {len(captions)} captions")


if __name__ == "__main__":
    main()
