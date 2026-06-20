import json
import re
import textwrap
from pathlib import Path
from deep_translator import GoogleTranslator

TRANSCRIPT_JSON = Path('/tmp/cs50_week0_transcript.json')
OUT = Path('src/data/cs50-week0-captions.ts')

raw = json.loads(TRANSCRIPT_JSON.read_text())['timestamped_text']
rows = []
for line in raw.splitlines():
    match = re.match(r'^(\d+):(\d{2})\s+(.*)', line)
    if not match:
        continue
    seconds = int(match.group(1)) * 60 + int(match.group(2))
    text = match.group(3).strip()
    if text:
        rows.append((seconds, text))

# Group into small timed subtitle windows so the line on screen tracks the lecture.
WINDOW = 12
captions = []
max_second = rows[-1][0] if rows else 0
for start in range(0, max_second + WINDOW, WINDOW):
    end = start + WINDOW
    parts = [text for seconds, text in rows if start <= seconds < end]
    if not parts:
        continue
    en = ' '.join(parts)
    en = re.sub(r'\s+', ' ', en).strip()
    captions.append({'startSeconds': start, 'endSeconds': end, 'textEn': en})

translator = GoogleTranslator(source='en', target='ko')
for index, caption in enumerate(captions, 1):
    try:
        caption['textKo'] = translator.translate(caption['textEn'])
    except Exception as error:
        caption['textKo'] = caption['textEn']
        print(f'WARN translate failed at {caption["startSeconds"]}: {error}')
    if index % 50 == 0:
        print(f'translated {index}/{len(captions)}')

def q(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)

lines = [
    'import type { LessonCaption } from "./lessons";',
    '',
    'export const cs50Week0Captions: LessonCaption[] = [',
]
for caption in captions:
    lines.append('  {')
    lines.append(f'    startSeconds: {caption["startSeconds"]},')
    lines.append(f'    endSeconds: {caption["endSeconds"]},')
    lines.append(f'    textKo: {q(caption["textKo"])},')
    lines.append(f'    textEn: {q(caption["textEn"])},')
    lines.append('  },')
lines.append('];')
lines.append('')
OUT.write_text('\n'.join(lines))
print(f'wrote {OUT} with {len(captions)} captions')
