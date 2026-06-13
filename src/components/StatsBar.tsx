'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export default function StatsBar() {
  const { currentMatchData, selectedMatchId } = useAppStore();

  if (!selectedMatchId || !currentMatchData) {
    return (
      <div className="h-16 bg-[#111122] border-b border-[#2a2a4a] flex items-center px-6 text-[#8888aa] justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
          <span className="text-sm font-semibold tracking-wide uppercase">LILA Player Journey Visualizer</span>
        </div>
        <div className="text-sm italic">Select a match from the sidebar to begin analysis</div>
      </div>
    );
  }

  // Calculate statistics from player data
  let totalKills = 0;
  let totalDeaths = 0;
  let totalLoot = 0;
  let totalStormDeaths = 0;

  currentMatchData.players.forEach((player) => {
    player.events.forEach((event) => {
      if (event.type === 'kill') totalKills++;
      if (event.type === 'death') totalDeaths++;
      if (event.type === 'loot') totalLoot++;
      if (event.type === 'storm_death') totalStormDeaths++;
    });
  });

  return (
    <div className="h-16 bg-[#111122] border-b border-[#2a2a4a] flex items-center px-6 justify-between text-[#e0e0ff] overflow-x-auto gap-4">
      {/* Match details */}
      <div className="flex items-center gap-6 divide-x divide-[#2a2a4a]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Match ID</span>
          <span className="text-xs font-mono text-[#00D4FF] truncate max-w-[120px]" title={currentMatchData.match_id}>
            {currentMatchData.match_id}
          </span>
        </div>
        <div className="flex flex-col pl-6">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Map</span>
          <span className="text-sm font-semibold">{currentMatchData.map_id}</span>
        </div>
        <div className="flex flex-col pl-6">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Date</span>
          <span className="text-sm font-semibold">{currentMatchData.date.replace('_', ' ')}</span>
        </div>
        <div className="flex flex-col pl-6">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Duration</span>
          <span className="text-sm font-mono font-semibold">{formatDuration(currentMatchData.duration_s)}</span>
        </div>
      </div>

      {/* Stats items */}
      <div className="flex items-center gap-6 bg-[#161630] px-4 py-1.5 rounded-lg border border-[#232344]">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-wider text-[#8888aa]">Humans</span>
            <span className="text-sm font-bold text-[#00D4FF]">{currentMatchData.human_count}</span>
          </div>
          <div className="text-[#2a2a4a] text-lg">/</div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-wider text-[#8888aa]">Bots</span>
            <span className="text-sm font-bold text-[#FF6B35]">{currentMatchData.bot_count}</span>
          </div>
        </div>
        <div className="w-px h-6 bg-[#2a2a4a]"></div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#8888aa]">Kills</span>
          <span className="text-sm font-bold text-[#FF0044]">{totalKills}</span>
        </div>
        <div className="w-px h-6 bg-[#2a2a4a]"></div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#8888aa]">Loot Chests</span>
          <span className="text-sm font-bold text-[#FFD700]">{totalLoot}</span>
        </div>
        <div className="w-px h-6 bg-[#2a2a4a]"></div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-wider text-[#8888aa]">Storm Deaths</span>
          <span className="text-sm font-bold text-[#9B59B6]">{totalStormDeaths}</span>
        </div>
      </div>
    </div>
  );
}
