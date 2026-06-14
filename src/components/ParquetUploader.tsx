'use client';

import React, { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { parseParquetFiles } from '@/lib/parquetParser';

export default function ParquetUploader() {
  const { setUploadedMatchData, clearUploadedData, isUploadMode, uploadedMatchData } = useAppStore();
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setParsing(true);
    setError(null);
    
    try {
      const fileArray = Array.from(files);
      const matchData = await parseParquetFiles(fileArray);
      setUploadedMatchData(matchData);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to parse Parquet file(s).');
    } finally {
      setParsing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="p-4 border-b border-[#2a2a4a] bg-[#141426]">
      <h2 className="text-sm font-bold uppercase tracking-wider text-[#8888aa] mb-2 flex justify-between items-center">
        <span>Level Design Upload</span>
        {isUploadMode && (
          <span className="text-[10px] font-bold uppercase bg-[#FF6B35] text-black px-1.5 py-0.5 rounded animate-pulse">
            Active
          </span>
        )}
      </h2>

      {isUploadMode && uploadedMatchData ? (
        <div className="flex flex-col gap-2 p-3 rounded bg-[#20203a] border border-[#ff6b35]/30">
          <div className="text-xs text-[#8888aa] font-mono truncate">
            ID: <span className="text-[#00D4FF]">{uploadedMatchData.match_id.substring(0, 12)}...</span>
          </div>
          <div className="text-xs flex justify-between items-center text-[#e0e0ff]">
            <span>Map: <strong className="text-white">{uploadedMatchData.map_id}</strong></span>
            <span>{uploadedMatchData.human_count}H / {uploadedMatchData.bot_count}B</span>
          </div>
          <button
            onClick={clearUploadedData}
            className="mt-1 w-full py-1.5 px-3 text-xs font-semibold rounded bg-[#ff3366] hover:bg-[#ff5588] text-white transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-md hover:shadow-[#ff3366]/20"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Custom Upload
          </button>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
            dragging
              ? 'border-[#00D4FF] bg-[#00d4ff]/5 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
              : 'border-[#2a2a4a] hover:border-[#00D4FF]/50 bg-[#17172e] hover:bg-[#1f1f3d]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            multiple
            accept=".parquet,*"
            className="hidden"
          />

          {parsing ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="w-6 h-6 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-[#00D4FF] font-semibold animate-pulse">Parsing Parquet files...</span>
            </div>
          ) : (
            <>
              <svg
                className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${
                  dragging ? 'text-[#00D4FF]' : 'text-[#8888aa] group-hover:text-[#00D4FF]/80'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div className="text-xs font-semibold text-[#e0e0ff] group-hover:text-white">
                Drag & drop Parquet files
              </div>
              <div className="text-[10px] text-[#8888aa]">
                or click to browse files
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 rounded bg-[#3d1a22] border border-[#ff0044]/30 text-xs text-[#ffb3c1] flex justify-between items-start gap-2">
          <span className="flex-1 leading-snug">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-[#ffb3c1] hover:text-white text-sm font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
