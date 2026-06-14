import { parquetReadObjects } from 'hyparquet';
import { MatchData, PlayerData, EventData } from './types';
import { worldToPixel } from './coordinates';

const decoder = new TextDecoder('utf-8');

function toString(val: any): string {
  if (val === null || val === undefined) return '';
  if (val instanceof Uint8Array) return decoder.decode(val);
  if (typeof val === 'string') return val;
  return String(val);
}

function toNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (val instanceof Date) return val.getTime();
  if (typeof val === 'bigint') return Number(val);
  if (typeof val === 'number') return val;
  const num = parseFloat(String(val));
  return isNaN(num) ? 0 : num;
}

function isBot(userId: string): boolean {
  return /^\d+$/.test(userId);
}

export async function parseParquetFiles(files: File[]): Promise<MatchData> {
  const allRows: any[] = [];
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const rows = await parquetReadObjects({ file: arrayBuffer });
    allRows.push(...rows);
  }
  
  if (allRows.length === 0) {
    throw new Error('No rows found in the uploaded file(s).');
  }
  
  // Group by match_id
  const matchesMap = new Map<string, any[]>();
  for (const row of allRows) {
    const matchIdRaw = toString(row.match_id);
    if (!matchIdRaw) continue;
    const matchId = matchIdRaw.replace('.nakama-0', '');
    if (!matchesMap.has(matchId)) {
      matchesMap.set(matchId, []);
    }
    matchesMap.get(matchId)!.push(row);
  }
  
  if (matchesMap.size === 0) {
    throw new Error('Could not find match_id in the parquet data.');
  }
  
  // Find the match with the most rows
  let primaryMatchId = '';
  let maxRows = 0;
  for (const [matchId, rows] of matchesMap.entries()) {
    if (rows.length > maxRows) {
      maxRows = rows.length;
      primaryMatchId = matchId;
    }
  }
  
  const matchRows = matchesMap.get(primaryMatchId)!;
  
  // 1. Find min_ts and max_ts
  let minTs = Infinity;
  let maxTs = -Infinity;
  let mapId = 'AmbroseValley';
  let matchDate = 'February_10';
  
  for (const row of matchRows) {
    const ts = toNumber(row.ts);
    if (ts < minTs) minTs = ts;
    if (ts > maxTs) maxTs = ts;
    if (row.map_id) {
      mapId = toString(row.map_id);
    }
    if (row.date) {
      matchDate = toString(row.date);
    }
  }
  
  const duration_s = maxTs >= minTs ? Math.max(0, Math.floor(maxTs - minTs)) : 0;
  
  // Group rows by user_id
  const playersMap = new Map<string, {
    user_id: string;
    is_bot: boolean;
    positions: [number, number, number][];
    events: (EventData & { raw?: string })[];
  }>();
  
  const event_summary: Record<string, number> = {};
  
  for (const row of matchRows) {
    const userId = toString(row.user_id);
    if (!userId) continue;
    
    if (!playersMap.has(userId)) {
      playersMap.set(userId, {
        user_id: userId,
        is_bot: isBot(userId),
        positions: [],
        events: []
      });
    }
    
    const player = playersMap.get(userId)!;
    const ts = toNumber(row.ts);
    const elapsed_s = Math.max(0, Math.floor(ts - minTs));
    const event_raw = toString(row.event);
    
    const x = toNumber(row.x);
    const z = toNumber(row.z);
    const { px, py } = worldToPixel(mapId, x, z);
    
    // Categorize event
    let ev_type: 'kill' | 'death' | 'storm_death' | 'loot' | null = null;
    if (event_raw === 'Position' || event_raw === 'BotPosition') {
      player.positions.push([px, py, elapsed_s]);
    } else if (event_raw === 'Kill' || event_raw === 'BotKill') {
      ev_type = 'kill';
    } else if (event_raw === 'Killed' || event_raw === 'BotKilled') {
      ev_type = 'death';
    } else if (event_raw === 'KilledByStorm') {
      ev_type = 'storm_death';
    } else if (event_raw === 'Loot') {
      ev_type = 'loot';
    }
    
    if (ev_type) {
      player.events.push({
        type: ev_type,
        px,
        py,
        t: elapsed_s,
        raw: event_raw
      });
      event_summary[ev_type] = (event_summary[ev_type] || 0) + 1;
    }
  }
  
  // Phantom bot inference (matches process_data.py)
  const actual_bot_count = Array.from(playersMap.values()).filter(p => p.is_bot).length;
  const actual_human_count = Array.from(playersMap.values()).filter(p => !p.is_bot).length;
  
  let bot_kills_inferred = 0;
  let bot_deaths_inferred = 0;
  const inferred_bots: any[] = [];
  
  for (const player of playersMap.values()) {
    if (!player.is_bot) {
      for (const event of player.events) {
        if (event.type === 'kill' && event.raw === 'BotKill') {
          bot_kills_inferred++;
          inferred_bots.push({
            user_id: `inferred_bot_${bot_kills_inferred}`,
            is_bot: true,
            positions: [],
            events: [
              {
                type: 'death',
                px: event.px,
                py: event.py,
                t: event.t,
                raw: 'BotKilled'
              }
            ]
          });
        } else if (event.type === 'death' && event.raw === 'BotKilled') {
          bot_deaths_inferred++;
        }
      }
    }
  }
  
  if (actual_bot_count === 0) {
    for (const bot of inferred_bots) {
      playersMap.set(bot.user_id, bot);
    }
  }
  
  const bot_count = Math.max(actual_bot_count, bot_kills_inferred);
  
  // Format positions: sort positions by time
  for (const player of playersMap.values()) {
    player.positions.sort((a, b) => a[2] - b[2]);
    player.events.sort((a, b) => a.t - b.t);
  }
  
  const playersList: PlayerData[] = Array.from(playersMap.values()).map(p => ({
    user_id: p.user_id,
    is_bot: p.is_bot,
    positions: p.positions,
    events: p.events.map(ev => ({
      type: ev.type,
      px: ev.px,
      py: ev.py,
      t: ev.t
    }))
  }));
  
  return {
    match_id: primaryMatchId,
    map_id: mapId,
    date: matchDate,
    duration_s,
    human_count: actual_human_count,
    bot_count,
    bot_kills_inferred,
    players: playersList,
    event_summary
  };
}
