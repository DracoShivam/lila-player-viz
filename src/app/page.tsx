'use client';

import React from 'react';
import FilterPanel from '@/components/FilterPanel';
import MapCanvas from '@/components/MapCanvas';
import TimelineSlider from '@/components/TimelineSlider';
import StatsBar from '@/components/StatsBar';
import EventLegend from '@/components/EventLegend';
import { useMatchData } from '@/hooks/useMatchData';

export default function Home() {
  // Fetch initial aggregates, matches index, and selected match details
  useMatchData();

  return (
    <div className="flex h-screen bg-[#0b0b16] text-[#e0e0ff] overflow-hidden font-sans">
      {/* Sidebar Filters */}
      <FilterPanel />

      {/* Main Analysis Dashboard */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Statistics Bar */}
        <StatsBar />

        {/* Map Visualization Viewport */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-y-auto min-h-0 bg-[#07070f] pattern-grid">
          <div className="relative flex items-center justify-center w-full max-w-[80vh] aspect-square max-h-[80vh]">
            <MapCanvas />
            
            {/* Hover Event Legend Overlay */}
            <div className="absolute bottom-4 right-4 pointer-events-auto hidden lg:block z-20">
              <EventLegend />
            </div>
          </div>
        </div>

        {/* Timeline Control Slider */}
        <TimelineSlider />
      </div>
    </div>
  );
}
