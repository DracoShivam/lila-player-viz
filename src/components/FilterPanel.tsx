'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MAP_IDS, DATES } from '@/lib/constants';
import EventLegend from './EventLegend';
import ParquetUploader from './ParquetUploader';

export default function FilterPanel() {
  const {
    selectedMap, setMap,
    selectedDates, toggleDate,
    selectedMatchId, setMatch,
    showHumans, setShowHumans,
    showBots, setShowBots,
    showPaths, setShowPaths,
    showHeatmap, setShowHeatmap,
    heatmapType, setHeatmapType,
    filteredMatches,
    matchIndex
  } = useAppStore();

  const [isMapOpen, setIsMapOpen] = useState(true);
  const [isDatesOpen, setIsDatesOpen] = useState(true);
  const [isLayersOpen, setIsLayersOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMatchId, setHoveredMatchId] = useState<string | null>(null);

  const displayedMatches = filteredMatches.filter(match =>
    match.match_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMapMatchCount = (mapId: string) => {
    return matchIndex.filter(m => m.map_id === mapId).length;
  };

  return (
    <div className="w-72 bg-[#1a1a2e] border-r border-[#2a2a4a] flex flex-col h-full text-[#e0e0ff] overflow-hidden">
      {/* Scrollable Upper Filters Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {/* Map Accordion */}
        <div className="border-b border-[#2a2a4a]">
          <button 
            onClick={() => setIsMapOpen(!isMapOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#8888aa] hover:text-white transition-colors"
          >
            <span>Map</span>
            <span className="text-xs transition-transform duration-200" style={{ transform: isMapOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {isMapOpen && (
            <div className="px-4 pb-4 gap-2 flex flex-col">
              {MAP_IDS.map(map => {
                const count = getMapMatchCount(map);
                return (
                  <button
                    key={map}
                    onClick={() => setMap(map)}
                    className={`text-left px-3 py-2 rounded text-sm transition-colors flex justify-between items-center ${
                      selectedMap === map 
                        ? 'bg-[#00D4FF] text-black font-semibold' 
                        : 'bg-[#2a2a4a] hover:bg-[#3a3a5a] text-[#e0e0ff]'
                    }`}
                  >
                    <span>{map}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      selectedMap === map ? 'bg-black/20 text-black font-bold' : 'bg-black/40 text-[#8888aa]'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dates Accordion */}
        <div className="border-b border-[#2a2a4a]">
          <button 
            onClick={() => setIsDatesOpen(!isDatesOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#8888aa] hover:text-white transition-colors"
          >
            <span>Dates</span>
            <span className="text-xs transition-transform duration-200" style={{ transform: isDatesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {isDatesOpen && (
            <div className="px-4 pb-4 flex flex-col gap-1">
              {DATES.map(date => (
                <label key={date} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedDates.includes(date)}
                    onChange={() => toggleDate(date)}
                    className="accent-[#00D4FF] w-4 h-4"
                  />
                  {date.replace('_', ' ')}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Layers Accordion */}
        <div className="border-b border-[#2a2a4a]">
          <button 
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="w-full p-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#8888aa] hover:text-white transition-colors"
          >
            <span>Layers</span>
            <span className="text-xs transition-transform duration-200" style={{ transform: isLayersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▼
            </span>
          </button>
          {isLayersOpen && (
            <div className="px-4 pb-4 flex flex-col gap-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={showHumans} onChange={(e) => setShowHumans(e.target.checked)} className="accent-[#00D4FF] w-4 h-4" />
                Show Humans
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={showBots} onChange={(e) => setShowBots(e.target.checked)} className="accent-[#FF6B35] w-4 h-4" />
                Show Bots
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={showPaths} onChange={(e) => setShowPaths(e.target.checked)} className="accent-[#00D4FF] w-4 h-4" />
                Show Paths
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={showHeatmap} onChange={(e) => setShowHeatmap(e.target.checked)} className="accent-[#00D4FF] w-4 h-4" />
                Show Heatmap
              </label>
              
              {showHeatmap && (
                <select
                  value={heatmapType}
                  onChange={(e) => setHeatmapType(e.target.value as any)}
                  className="mt-2 bg-[#2a2a4a] text-sm p-2 rounded border border-[#3a3a5a] outline-none hover:border-[#4a4a6a] focus:border-[#00D4FF] transition-colors"
                >
                  <option value="kills">Kills</option>
                  <option value="deaths">Deaths</option>
                  <option value="traffic">Traffic</option>
                </select>
              )}
            </div>
          )}
        </div>

        {/* Level Design Upload */}
        <ParquetUploader />
      </div>

      {/* Matches Container - Fixed height, independent scrolling */}
      <div className="h-[320px] border-t border-[#2a2a4a] p-4 flex flex-col overflow-hidden bg-[#131326] shrink-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8888aa] mb-2 flex justify-between items-center">
          <span>Matches</span>
          <span className="text-xs font-bold bg-[#2a2a4a] px-2 py-0.5 rounded-full text-[#e0e0ff]">{displayedMatches.length}</span>
        </h2>

        {/* Search input */}
        <div className="relative mb-2">
          <input
            type="text"
            placeholder="Search Match ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a2e] text-xs p-2 pl-8 pr-7 rounded border border-[#2a2a4a] outline-none text-[#e0e0ff] placeholder-[#8888aa] hover:border-[#3a3a5a] focus:border-[#00D4FF] transition-all"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8888aa] text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8888aa] hover:text-[#e0e0ff] text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
          {displayedMatches.map(match => (
            <div 
              key={match.match_id} 
              className="relative group"
              onMouseEnter={() => setHoveredMatchId(match.match_id)}
              onMouseLeave={() => setHoveredMatchId(null)}
            >
              <button
                onClick={() => setMatch(match.match_id)}
                className={`w-full text-left p-2.5 rounded text-xs border transition-colors ${
                  selectedMatchId === match.match_id 
                    ? 'bg-[#2a2a4a] border-[#00D4FF]' 
                    : 'bg-[#1a1a2e] border-[#2a2a4a] hover:border-[#3a3a5a] hover:bg-[#20203a]'
                }`}
              >
                <div className={`font-mono truncate mb-1 text-[#e0e0ff] transition-opacity duration-150 ${
                  hoveredMatchId === match.match_id ? 'opacity-0' : 'opacity-100'
                }`}>
                  {match.match_id.substring(0, 8)}...
                </div>
                <div className="text-[#8888aa] flex justify-between items-center mt-1">
                  <span className="flex items-center gap-2">
                    <span className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D4FF] mr-1"></span>
                      {match.human_count}H
                    </span>
                    <span className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 rounded-sm bg-[#FF6B35] mr-1"></span>
                      {match.bot_count}B
                    </span>
                  </span>
                  
                  <span className="flex items-center gap-2">
                    {match.event_summary?.kill !== undefined && match.event_summary.kill > 0 && (
                      <span className="flex items-center text-[#FF0044] font-semibold" title="Kills">
                        <span className="mr-0.5 text-[10px]">◆</span>{match.event_summary.kill}
                      </span>
                    )}
                    {match.event_summary?.loot !== undefined && match.event_summary.loot > 0 && (
                      <span className="flex items-center text-[#FFD700] font-semibold" title="Loot Boxes">
                        <span className="mr-0.5 text-[10px]">●</span>{match.event_summary.loot}
                      </span>
                    )}
                    <span className="text-[10px]">{Math.floor(match.duration_s / 60)}m</span>
                  </span>
                </div>
              </button>

              {/* Tooltip overlaying the first line dynamically */}
              {hoveredMatchId === match.match_id && (
                <div className="absolute top-2 left-2 right-2 pointer-events-none z-10">
                  <div className="bg-[#161630] text-[#00D4FF] text-[10px] font-mono p-1 rounded border border-[#00D4FF] shadow-2xl break-all leading-tight">
                    {match.match_id}
                  </div>
                </div>
              )}
            </div>
          ))}
          {displayedMatches.length === 0 && (
            <div className="text-sm text-[#8888aa] text-center mt-8 italic">No matches found</div>
          )}
        </div>
      </div>

      {/* Legend */}
      <EventLegend />
    </div>
  );
}
