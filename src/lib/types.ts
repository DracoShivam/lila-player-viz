export interface EventCounts {
  [type: string]: number;
}

export interface MatchMeta {
  match_id: string;
  map_id: string;
  date: string;
  duration_s: number;
  human_count: number;
  bot_count: number;
  event_counts?: EventCounts;
  event_summary?: Record<string, number>;
  bot_kills_inferred?: number;
}

export interface EventData {
  type: 'kill' | 'death' | 'storm_death' | 'loot';
  px: number;
  py: number;
  t: number;
}

export interface PlayerData {
  user_id: string;
  is_bot: boolean;
  positions: [number, number, number][]; // [px, py, t]
  events: EventData[];
}

export interface MatchData {
  match_id: string;
  map_id: string;
  date: string;
  duration_s: number;
  human_count: number;
  bot_count: number;
  players: PlayerData[];
  event_summary?: Record<string, number>;
  bot_kills_inferred?: number;
}

export interface AggregateData {
  [mapId: string]: {
    kills: [number, number][];
    deaths: [number, number][];
    positions: [number, number][];
  };
}

export type HeatmapType = 'kills' | 'deaths' | 'traffic';
