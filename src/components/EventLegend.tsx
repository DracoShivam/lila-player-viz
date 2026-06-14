'use client';

import React, { useState } from 'react';
import { COLORS } from '@/lib/constants';

export default function EventLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-[#2a2a4a] bg-[#141424]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#8888aa] hover:text-white transition-colors"
      >
        <span>Map Legend</span>
        <span className="text-xs transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {/* Path Types */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-semibold text-[#666688]">Path Types</h4>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-6 h-0.5" style={{ backgroundColor: COLORS.humanPath }}></div>
              <span>Human Player Path</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="w-6.5 h-0 border-t-2 border-dashed" style={{ borderColor: COLORS.botPath }}></div>
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
              <div className="w-4 h-4 flex items-center justify-center font-bold font-mono text-white">
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
      )}
    </div>
  );
}

