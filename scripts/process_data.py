import os
import json
import pandas as pd
import pyarrow.parquet as pq

MAP_CONFIG = {
    'AmbroseValley': {'scale': 900, 'origin_x': -370, 'origin_z': -473},
    'GrandRift': {'scale': 581, 'origin_x': -290, 'origin_z': -290},
    'Lockdown': {'scale': 1000, 'origin_x': -500, 'origin_z': -500},
}

def is_bot(user_id):
    try:
        int(user_id)
        return True
    except ValueError:
        return False

def get_pixel_coords(x, z, map_id):
    config = MAP_CONFIG.get(map_id)
    if not config:
        return 0, 0
    u = (x - config['origin_x']) / config['scale']
    v = (z - config['origin_z']) / config['scale']
    pixel_x = u * 1024
    pixel_y = (1 - v) * 1024
    return round(max(0, min(1024, pixel_x)), 2), round(max(0, min(1024, pixel_y)), 2)

def main():
    base_dir = r"d:\LILA Website\player_data"
    out_dir = r"d:\LILA Website\lila-player-viz\public\data"
    matches_dir = os.path.join(out_dir, "matches")
    os.makedirs(matches_dir, exist_ok=True)
    
    days = ['February_10', 'February_11', 'February_12', 'February_13', 'February_14']
    
    matches = {} 
    
    # Pass 1: find min ts per match
    print("Pass 1: Reading min_ts and gathering match metadata...")
    for day in days:
        day_dir = os.path.join(base_dir, day)
        if not os.path.isdir(day_dir):
            continue
        for filename in os.listdir(day_dir):
            if filename.startswith('.') or filename == '.DS_Store':
                continue
            
            filepath = os.path.join(day_dir, filename)
            table = pq.read_table(filepath, columns=['match_id', 'map_id', 'ts', 'user_id'])
            df = table.to_pandas()
            if df.empty:
                continue
            
            # extract ts_raw
            ts_raw = df['ts'].astype('int64')
            df['ts_raw'] = ts_raw
            
            for match_id, group in df.groupby('match_id'):
                match_id_clean = str(match_id).replace('.nakama-0', '')
                local_min = group['ts_raw'].min()
                local_max = group['ts_raw'].max()
                
                if match_id_clean not in matches:
                    matches[match_id_clean] = {
                        "match_id": match_id_clean,
                        "map_id": str(group['map_id'].iloc[0]) if 'map_id' in group.columns else "AmbroseValley",
                        "date": day,
                        "min_ts": local_min,
                        "max_ts": local_max,
                        "players": {},
                        "event_summary": {}
                    }
                else:
                    matches[match_id_clean]['min_ts'] = min(matches[match_id_clean]['min_ts'], local_min)
                    matches[match_id_clean]['max_ts'] = max(matches[match_id_clean]['max_ts'], local_max)
                    
    # Initialize aggregates
    aggregates = {m: {'kills': [], 'deaths': [], 'positions': []} for m in MAP_CONFIG}
    
    print("Pass 2: Processing events...")
    for day in days:
        day_dir = os.path.join(base_dir, day)
        if not os.path.isdir(day_dir):
            continue
        print(f"Processing {day}...")
        for filename in os.listdir(day_dir):
            if filename.startswith('.') or filename == '.DS_Store':
                continue
                
            filepath = os.path.join(day_dir, filename)
            df = pq.read_table(filepath).to_pandas()
            if df.empty:
                continue
                
            df['event'] = df['event'].apply(
                lambda x: x.decode('utf-8') if isinstance(x, bytes) else str(x)
            )
            
            ts_raw = df['ts'].astype('int64')
            df['ts_raw'] = ts_raw
            
            for match_id, group in df.groupby('match_id'):
                match_id_clean = str(match_id).replace('.nakama-0', '')
                match_data = matches.get(match_id_clean)
                if not match_data:
                    continue
                    
                match_min_ts = match_data['min_ts']
                map_id = match_data['map_id']
                
                for user_id, user_group in group.groupby('user_id'):
                    user_id_str = str(user_id)
                    if user_id_str not in match_data['players']:
                        match_data['players'][user_id_str] = {
                            "user_id": user_id_str,
                            "is_bot": is_bot(user_id_str),
                            "positions": [],
                            "events": [],
                            "raw_events": []
                        }
                        
                    player = match_data['players'][user_id_str]
                    
                    for _, row in user_group.iterrows():
                        elapsed_s = (row['ts_raw'] - match_min_ts) // 1000 # in seconds approx. Wait, prompt says: "each elapsed unit ≈ 1 second of game time. ts_raw - match_start" 
                        # No wait, prompt says "ts_raw = df['ts'].astype('int64') // 10**6 ... each unit is approx 1 sec".
                        # But 10**6 is ms. 1000 ms = 1 s. Wait.
                        # Prompt: "The ts column is timestamp[ms] from epoch. Raw int64 values are ~1,770,727,xxx. Within a match, these span ~700 units. Each unit = 1 second... df['elapsed_s'] = ts_raw - match_start" 
                        # Oh, if it spans 700 units and represents 12 mins, then 1 unit = 1 second. So no need to divide by 1000! ts_raw is ALREADY in seconds? 
                        # Wait, "ts_int = df['ts'].values.astype('int64') // 1_000_000 # ns->ms". If pandas is ns, // 1_000_000 gives ms. So 1,770,727,xxx is in seconds? 
                        # 1,770,727,xxx epoch is Feb 10, 2026. This is seconds! 
                        # So ts_raw is actually in seconds!
                        elapsed_s = row['ts_raw'] - match_min_ts
                        elapsed_s = max(0, int(elapsed_s))
                        
                        event_type_raw = str(row['event'])
                        player.setdefault('raw_events', []).append(event_type_raw)
                        
                        x = float(row.get('x', 0))
                        z = float(row.get('z', 0))
                        px, py = get_pixel_coords(x, z, map_id)
                        
                        # Categorize event
                        ev_type = None
                        if event_type_raw in ['Position', 'BotPosition']:
                            player['positions'].append([px, py, elapsed_s])
                            if map_id in aggregates and elapsed_s % 5 == 0: # sample positions
                                aggregates[map_id]['positions'].append([px, py])
                        elif event_type_raw in ['Kill', 'BotKill']:
                            ev_type = 'kill'
                            if map_id in aggregates:
                                aggregates[map_id]['kills'].append([px, py])
                        elif event_type_raw in ['Killed', 'BotKilled']:
                            ev_type = 'death'
                            if map_id in aggregates:
                                aggregates[map_id]['deaths'].append([px, py])
                        elif event_type_raw == 'KilledByStorm':
                            ev_type = 'storm_death'
                            if map_id in aggregates:
                                aggregates[map_id]['deaths'].append([px, py])
                        elif event_type_raw == 'Loot':
                            ev_type = 'loot'
                            
                        if ev_type:
                            player['events'].append({
                                "type": ev_type, 
                                "px": px, 
                                "py": py, 
                                "t": elapsed_s,
                                "raw": event_type_raw
                            })
                            # update summary
                            match_data['event_summary'][ev_type] = match_data['event_summary'].get(ev_type, 0) + 1

    # Format output
    print("Formatting and saving output...")
    index = []
    for match_id, data in matches.items():
        actual_bot_count = sum(1 for p in data['players'].values() if p['is_bot'])
        actual_human_count = sum(1 for p in data['players'].values() if not p['is_bot'])
        
        bot_kills_inferred = 0
        bot_deaths_inferred = 0
        inferred_bots = []
        for player in list(data['players'].values()):
            if not player['is_bot']:
                for event in player['events']:
                    if event.get('type') == 'kill' and event.get('raw') == 'BotKill':
                        bot_kills_inferred += 1
                        phantom_bot = {
                            "user_id": f"inferred_bot_{bot_kills_inferred}",
                            "is_bot": True,
                            "positions": [],
                            "events": [
                                {
                                    "type": "death",
                                    "px": event["px"],
                                    "py": event["py"],
                                    "t": event["t"],
                                    "raw": "BotKilled"
                                }
                            ]
                        }
                        inferred_bots.append(phantom_bot)
                    elif event.get('type') == 'death' and event.get('raw') == 'BotKilled':
                        bot_deaths_inferred += 1
                        
        if actual_bot_count == 0:
            for bot in inferred_bots:
                data['players'][bot['user_id']] = bot
                
        players_list = list(data['players'].values())
        human_count = actual_human_count
        bot_count = max(actual_bot_count, bot_kills_inferred)
        duration_s = max(0, int(data['max_ts'] - data['min_ts']))
        
        # Save match JSON
        match_json = {
            "match_id": match_id,
            "map_id": data['map_id'],
            "date": data['date'],
            "duration_s": duration_s,
            "human_count": human_count,
            "bot_count": bot_count,
            "bot_kills_inferred": bot_kills_inferred,
            "bot_deaths_inferred": bot_deaths_inferred,
            "players": players_list
        }
        with open(os.path.join(matches_dir, f"{match_id}.json"), 'w') as f:
            json.dump(match_json, f)
            
        # Add to index
        index.append({
            "match_id": match_id,
            "map_id": data['map_id'],
            "date": data['date'],
            "duration_s": duration_s,
            "human_count": human_count,
            "bot_count": bot_count,
            "bot_kills_inferred": bot_kills_inferred,
            "bot_deaths_inferred": bot_deaths_inferred,
            "event_summary": data['event_summary']
        })
        
    with open(os.path.join(out_dir, "matches_index.json"), 'w') as f:
        json.dump(index, f)
        
    with open(os.path.join(out_dir, "aggregates.json"), 'w') as f:
        json.dump(aggregates, f)
        
    print("Done!")

if __name__ == "__main__":
    main()
