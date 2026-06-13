'use client';

import React from 'react';
import { COLORS } from '@/lib/constants';

export default function EventLegend() {
  return (
    <div className="bg-[#111122]/90 backdrop-blur border border-[#2a2a4a] rounded-lg p-4 text-[#e0e0ff] space-y-3 w-64 shadow-xl">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#8888aa] border-b border-[#2a2a4a] pb-1.5">
        Map Legend
      </h3>
      
      {/* Path Types */}
      <div className="space-y-2">
        <h4 className="text-[10px] uppercase font-semibold text-[#666688]">Path Types</h4>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-6 h-0.5" style={{ backgroundColor: COLORS.humanPath }}></div>
          <span>Human Player Path</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="w-6 h-0.5 border-t border-dashed border-2" style={{ borderColor: COLORS.botPath }}></div>
          <span>Bot Player Path</span>
        </div>
      </div>

      {/* Event Types */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[10px] uppercase font-semibold text-[#666688]">Events</h4>
        
        {/* Kill */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: COLORS.kill }}></div>
          </div>
          <span>Kill Event (Red Diamond)</span>
        </div>

        {/* Death */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 flex items-center justify-center font-bold font-mono" style={{ color: COLORS.death }}>
            ✕
          </div>
          <span>Death (White X)</span>
        </div>

        {/* Loot */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS.loot }}></div>
          </div>
          <span>Loot Box Opened (Gold Circle)</span>
        </div>

        {/* Storm Death */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[9px]" style={{ borderBottomColor: COLORS.storm }}></div>
          </div>
          <span>Storm Death (Purple Triangle)</span>
        </div>
      </div>
    </div>
  );
}
