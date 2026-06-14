import os
import pyarrow.parquet as pq
import pandas as pd
from collections import defaultdict

base_dir = r"d:\LILA Website\player_data"
days = ['February_10', 'February_11', 'February_12', 'February_13', 'February_14']

# Count unique match_ids and how many files share a match_id
match_files = defaultdict(list)

for day in days:
    day_dir = os.path.join(base_dir, day)
    if not os.path.isdir(day_dir):
        continue
    for filename in os.listdir(day_dir):
        if filename.startswith('.'):
            continue
        filepath = os.path.join(day_dir, filename)
        try:
            table = pq.read_table(filepath, columns=['match_id', 'user_id', 'map_id'])
            df = table.to_pandas()
            if df.empty:
                continue
            match_id_raw = str(df['match_id'].iloc[0])
            match_id_clean = match_id_raw.replace('.nakama-0', '')
            user_id = str(df['user_id'].iloc[0])
            map_id = str(df['map_id'].iloc[0])
            
            # Detect bot
            try:
                int(user_id)
                is_bot = True
            except ValueError:
                is_bot = False
            
            match_files[match_id_clean].append({
                'filename': filename,
                'user_id': user_id,
                'is_bot': is_bot,
                'map_id': map_id,
                'day': day,
                'match_id_raw': match_id_raw
            })
        except Exception as e:
            print(f"Error reading {filepath}: {e}")

# Statistics
total_matches = len(match_files)
files_per_match = [len(v) for v in match_files.values()]
print(f"Total unique matches (cleaned): {total_matches}")
print(f"Files per match: min={min(files_per_match)}, max={max(files_per_match)}, avg={sum(files_per_match)/len(files_per_match):.1f}")

# Distribution of files per match
from collections import Counter
dist = Counter(files_per_match)
print(f"\nFiles-per-match distribution:")
for k in sorted(dist.keys()):
    print(f"  {k} files: {dist[k]} matches")

# Check matches with more than 1 file
multi_file_matches = {k: v for k, v in match_files.items() if len(v) > 1}
print(f"\nMatches with >1 file: {len(multi_file_matches)}")

# Show a few examples
for mid, files in list(multi_file_matches.items())[:3]:
    print(f"\n  Match: {mid} ({len(files)} files)")
    bots = [f for f in files if f['is_bot']]
    humans = [f for f in files if not f['is_bot']]
    print(f"    Humans: {len(humans)}, Bots: {len(bots)}")
    for f in files[:5]:
        print(f"      {f['day']}/{f['filename'][:40]}... uid={f['user_id'][:15]} bot={f['is_bot']} map={f['map_id']}")

# Check how many matches have the match_id embedded in the FILENAME
print(f"\n\n--- Checking filename convention ---")
for day in days[:1]:
    day_dir = os.path.join(base_dir, day)
    if not os.path.isdir(day_dir):
        continue
    files_in_day = os.listdir(day_dir)[:5]
    for f in files_in_day:
        parts = f.replace('.nakama-0', '').split('_')
        print(f"  Filename: {f}")
        print(f"  Parts: user_id={parts[0]}, match_id={'_'.join(parts[1:])}")
