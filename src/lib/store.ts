import { create } from 'zustand';
import { MatchMeta, MatchData, AggregateData, HeatmapType } from './types';
import { MAP_IDS, DATES } from './constants';

interface AppState {
  // Filters
  selectedMap: string;
  selectedDates: string[];
  selectedMatchId: string | null;
  showHumans: boolean;
  showBots: boolean;
  showPaths: boolean;
  showHeatmap: boolean;
  heatmapType: HeatmapType;
  
  // Timeline
  currentTime: number;
  maxTime: number;
  isPlaying: boolean;
  playbackSpeed: number;
  
  // Data
  matchIndex: MatchMeta[];
  currentMatchData: MatchData | null;
  aggregateData: AggregateData | null;
  
  // Computed
  filteredMatches: MatchMeta[];

  // Actions
  setMap: (map: string) => void;
  toggleDate: (date: string) => void;
  setMatch: (id: string | null) => void;
  setShowHumans: (show: boolean) => void;
  setShowBots: (show: boolean) => void;
  setShowPaths: (show: boolean) => void;
  setShowHeatmap: (show: boolean) => void;
  setHeatmapType: (type: HeatmapType) => void;
  
  setCurrentTime: (time: number) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  tick: (deltaTimeMs: number) => void;
  
  setMatchIndex: (index: MatchMeta[]) => void;
  setCurrentMatchData: (data: MatchData | null) => void;
  setAggregateData: (data: AggregateData | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial State
  selectedMap: MAP_IDS[0],
  selectedDates: [...DATES],
  selectedMatchId: null,
  showHumans: true,
  showBots: true,
  showPaths: true,
  showHeatmap: false,
  heatmapType: 'kills',
  
  currentTime: 0,
  maxTime: 0,
  isPlaying: false,
  playbackSpeed: 1,
  
  matchIndex: [],
  currentMatchData: null,
  aggregateData: null,
  
  filteredMatches: [],

  // Actions
  setMap: (map) => set((state) => {
    const filtered = state.matchIndex.filter(m => m.map_id === map && state.selectedDates.includes(m.date));
    return { selectedMap: map, filteredMatches: filtered };
  }),
  
  toggleDate: (date) => set((state) => {
    const dates = state.selectedDates.includes(date) 
      ? state.selectedDates.filter(d => d !== date)
      : [...state.selectedDates, date];
    const filtered = state.matchIndex.filter(m => m.map_id === state.selectedMap && dates.includes(m.date));
    return { selectedDates: dates, filteredMatches: filtered };
  }),
  
  setMatch: (id) => set({ selectedMatchId: id }),
  setShowHumans: (show) => set({ showHumans: show }),
  setShowBots: (show) => set({ showBots: show }),
  setShowPaths: (show) => set({ showPaths: show }),
  setShowHeatmap: (show) => set({ showHeatmap: show }),
  setHeatmapType: (type) => set({ heatmapType: type }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
  
  tick: (deltaTimeMs) => set((state) => {
    if (!state.isPlaying) return {};
    let newTime = state.currentTime + (deltaTimeMs / 1000) * state.playbackSpeed;
    if (newTime >= state.maxTime) {
      newTime = state.maxTime;
      return { currentTime: newTime, isPlaying: false };
    }
    return { currentTime: newTime };
  }),
  
  setMatchIndex: (index) => set((state) => {
    const filtered = index.filter(m => m.map_id === state.selectedMap && state.selectedDates.includes(m.date));
    return { matchIndex: index, filteredMatches: filtered };
  }),
  
  setCurrentMatchData: (data) => set({ 
    currentMatchData: data,
    maxTime: data?.duration_s || 0,
    currentTime: 0,
    isPlaying: false
  }),
  
  setAggregateData: (data) => set({ aggregateData: data }),
}));
