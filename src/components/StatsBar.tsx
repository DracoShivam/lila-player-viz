'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export default function StatsBar() {
  const { currentMatchData, selectedMatchId } = useAppStore();
  const [isIdHovered, setIsIdHovered] = useState(false);

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
    <div className="min-h-16 py-3 bg-[#111122] border-b border-[#2a2a4a] flex flex-wrap items-center px-6 justify-between text-[#e0e0ff] gap-4">
      {/* Match details */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Match ID</span>
          <div 
            className="relative"
            onMouseEnter={() => setIsIdHovered(true)}
            onMouseLeave={() => setIsIdHovered(false)}
          >
            <span className="text-xs font-mono text-[#00D4FF] truncate max-w-[120px] block cursor-pointer">
              {currentMatchData.match_id}
            </span>
            {/* Custom Tooltip */}
            {isIdHovered && (
              <div className="absolute top-full left-0 mt-1.5 flex flex-col items-start z-50 pointer-events-none">
                <div className="w-2 h-2 bg-[#161630] border-l border-t border-[#00D4FF] rotate-45 ml-4 -mb-1 relative z-10"></div>
                <div className="bg-[#161630] text-[#00D4FF] text-[10px] font-mono px-3 py-1.5 rounded border border-[#00D4FF] shadow-2xl whitespace-nowrap relative">
                  {currentMatchData.match_id}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden sm:block w-px h-8 bg-[#2a2a4a]"></div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Map</span>
          <span className="text-sm font-semibold">{currentMatchData.map_id}</span>
        </div>
        <div className="hidden sm:block w-px h-8 bg-[#2a2a4a]"></div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Date</span>
          <span className="text-sm font-semibold">{currentMatchData.date.replace(/_/g, ' ')}</span>
        </div>
        <div className="hidden sm:block w-px h-8 bg-[#2a2a4a]"></div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#8888aa]">Duration</span>
          <span className="text-sm font-mono font-semibold">{formatDuration(currentMatchData.duration_s)}</span>
        </div>
      </div>

      {/* Stats items */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 bg-[#161630] px-4 py-1.5 rounded-lg border border-[#232344]">
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
          <span className="text-[9px] uppercase tracking-wider text-[#8888aa]">Deaths</span>
          <span className="text-sm font-bold text-[#FF3366]">{totalDeaths}</span>
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
