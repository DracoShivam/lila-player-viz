'use client';

import React, { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { CANVAS_SIZE } from '@/lib/constants';
import simpleheat from 'simpleheat';

export default function HeatmapOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedMap, showHeatmap, heatmapType, aggregateData } = useAppStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Always clear the canvas first
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (!showHeatmap || !aggregateData || !aggregateData[selectedMap]) {
      return;
    }

    const mapData = aggregateData[selectedMap];
    let points: [number, number][] = [];

    if (heatmapType === 'kills') {
      points = mapData.kills || [];
    } else if (heatmapType === 'deaths') {
      points = mapData.deaths || [];
    } else if (heatmapType === 'traffic') {
      points = mapData.positions || [];
    }

    if (points.length === 0) return;

    // Convert coordinates to [x, y, value] for simpleheat
    const heatData = points.map(([x, y]) => [x, y, 1] as [number, number, number]);

    // Initialize simpleheat on our canvas
    const heat = simpleheat(canvas);
    heat.data(heatData);

    // Customize radius and blur based on type
    if (heatmapType === 'traffic') {
      heat.radius(8, 5);
    } else {
      heat.radius(12, 8);
    }

    // Set max intensity. More points = higher max so it doesn't get fully saturated too quickly.
    const maxVal = Math.min(60, Math.max(8, points.length / 80));
    heat.max(maxVal);

    // Customize gradient color palette if needed
    // Defaults: {0.4: 'blue', 0.65: 'lime', 1: 'red'}
    // Let's use a nice custom palette matching the cyber/gaming theme:
    // Dark cyan -> lime -> yellow -> red/magenta
    heat.gradient({
      0.25: '#00D4FF', // Cyan
      0.55: '#00FF66', // Lime Green
      0.85: '#FFD700', // Gold/Yellow
      1.0: '#FF0044',  // Red
    });

    heat.draw(0.05);
  }, [selectedMap, showHeatmap, heatmapType, aggregateData]);

  if (!showHeatmap) return null;

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none opacity-70 z-10"
    />
  );
}
