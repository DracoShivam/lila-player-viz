'use client';
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TimelineSlider() {
  const { 
    currentTime, 
    maxTime, 
    isPlaying, 
    playbackSpeed, 
    setCurrentTime, 
    togglePlay, 
    setPlaybackSpeed, 
    tick 
  } = useAppStore();

  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined && isPlaying) {
        const deltaTime = time - previousTimeRef.current;
        tick(deltaTime);
      }
      previousTimeRef.current = time;
      if (isPlaying) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      previousTimeRef.current = undefined;
    };
  }, [isPlaying, tick]);

  return (
    <div className="h-16 bg-[#1a1a2e] border-t border-[#2a2a4a] flex items-center px-4 gap-4 text-[#e0e0ff]">
      <button 
        onClick={togglePlay} 
        disabled={maxTime === 0}
        className="px-4 py-2 bg-[#2a2a4a] rounded hover:bg-[#3a3a5a] disabled:opacity-50 disabled:cursor-not-allowed w-28 text-center flex-shrink-0"
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      
      <input 
        type="range" 
        min={0} 
        max={maxTime} 
        value={currentTime} 
        onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
        disabled={maxTime === 0}
        className="flex-1 accent-[#00D4FF] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="font-mono text-sm whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(maxTime)}
      </div>
      
      <div className="flex gap-1 ml-4 border-l border-[#2a2a4a] pl-4">
        {[1, 2, 4, 8].map(speed => (
          <button 
            key={speed}
            onClick={() => setPlaybackSpeed(speed)}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              playbackSpeed === speed 
                ? 'bg-[#00D4FF] text-black' 
                : 'bg-[#2a2a4a] text-[#8888aa] hover:bg-[#3a3a5a] hover:text-white'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
}
