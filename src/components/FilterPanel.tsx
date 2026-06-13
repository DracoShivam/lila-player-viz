'use client';
import { useAppStore } from '@/lib/store';
import { MAP_IDS, DATES } from '@/lib/constants';

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
    filteredMatches
  } = useAppStore();

  return (
    <div className="w-72 bg-[#1a1a2e] border-r border-[#2a2a4a] flex flex-col h-full text-[#e0e0ff] overflow-hidden">
      <div className="p-4 border-b border-[#2a2a4a]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8888aa] mb-2">Map</h2>
        <div className="flex flex-col gap-2">
          {MAP_IDS.map(map => (
            <button
              key={map}
              onClick={() => setMap(map)}
              className={`text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedMap === map 
                  ? 'bg-[#00D4FF] text-black font-semibold' 
                  : 'bg-[#2a2a4a] hover:bg-[#3a3a5a] text-[#e0e0ff]'
              }`}
            >
              {map}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-[#2a2a4a]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8888aa] mb-2">Dates</h2>
        <div className="flex flex-col gap-1">
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
      </div>

      <div className="p-4 border-b border-[#2a2a4a]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8888aa] mb-2">Layers</h2>
        <div className="flex flex-col gap-2 text-sm">
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
      </div>

      <div className="p-4 flex-1 flex flex-col overflow-hidden">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8888aa] mb-2 flex justify-between items-center">
          <span>Matches</span>
          <span className="text-xs font-bold bg-[#2a2a4a] px-2 py-0.5 rounded-full text-[#e0e0ff]">{filteredMatches.length}</span>
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {filteredMatches.map(match => (
            <button
              key={match.match_id}
              onClick={() => setMatch(match.match_id)}
              className={`w-full text-left p-2 rounded text-xs border transition-colors ${
                selectedMatchId === match.match_id 
                  ? 'bg-[#2a2a4a] border-[#00D4FF]' 
                  : 'bg-[#1a1a2e] border-[#2a2a4a] hover:border-[#3a3a5a] hover:bg-[#20203a]'
              }`}
            >
              <div className="font-mono truncate mb-1 text-[#e0e0ff]">{match.match_id.substring(0, 8)}...</div>
              <div className="text-[#8888aa] flex justify-between">
                <span>{match.human_count}H / {match.bot_count}B</span>
                <span>{Math.floor(match.duration_s / 60)}m {match.duration_s % 60}s</span>
              </div>
            </button>
          ))}
          {filteredMatches.length === 0 && (
            <div className="text-sm text-[#8888aa] text-center mt-8 italic">No matches found for current filters</div>
          )}
        </div>
      </div>
    </div>
  );
}
