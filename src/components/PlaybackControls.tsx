import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Repeat, FastForward, Clock } from 'lucide-react';
import { ThemeConfig, QuadrantId } from '../types';

interface PlaybackControlsProps {
  currentTheme: ThemeConfig;
  theta: number;
  onThetaChange: (t: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  activeQuadrant: QuadrantId | 'all';
  onSelectQuadrant: (q: QuadrantId | 'all') => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentTheme,
  theta,
  onThetaChange,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  onSpeedChange,
  isLooping,
  onToggleLoop,
  activeQuadrant,
  onSelectQuadrant,
}) => {
  // Step +/- deg
  const handleStepDeg = (degAmount: number) => {
    const delta = (degAmount * Math.PI) / 180;
    let next = theta + delta;
    if (next < 0) next = 0;
    if (next > 2 * Math.PI) next = 2 * Math.PI;
    onThetaChange(next);
  };

  const cycleDurationSec = Math.round(24 / playbackSpeed);

  return (
    <div
      className={`w-full p-4 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.panelBg} backdrop-blur-md shadow-xl flex flex-col gap-3 transition-colors`}
    >
      {/* Top Row: Timeline Scrubber with Quadrant Flags */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono-math">
          <span>0 (0°)</span>
          <span className="text-emerald-400">Q I (90°)</span>
          <span className="text-amber-400">Q II (180°)</span>
          <span className="text-rose-400">Q III (270°)</span>
          <span className="text-cyan-400">Q IV (360°)</span>
          <span>2π</span>
        </div>

        {/* Video Scrubber Input */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={2 * Math.PI}
            step={0.002}
            value={theta}
            onChange={(e) => onThetaChange(parseFloat(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
            aria-label="Timeline scrubber for theta angle"
          />
        </div>
      </div>

      {/* Bottom Row: Control Buttons, Slow Motion Speeds & Precision Step */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
        {/* Play / Step Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
            aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
          </button>

          {/* Micro Precision Step: 1 deg and 5 deg */}
          <button
            onClick={() => handleStepDeg(-5)}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition-colors text-xs font-mono-math"
            title="Step Back 5°"
            aria-label="Step back 5 degrees"
          >
            <div className="flex items-center gap-0.5">
              <SkipBack className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">-5°</span>
            </div>
          </button>

          <button
            onClick={() => handleStepDeg(-1)}
            className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition-colors text-[11px] font-mono-math"
            title="Slow Micro Step Back 1°"
            aria-label="Slow micro step back 1 degree"
          >
            -1°
          </button>

          <button
            onClick={() => handleStepDeg(1)}
            className="px-2 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition-colors text-[11px] font-mono-math"
            title="Slow Micro Step Forward 1°"
            aria-label="Slow micro step forward 1 degree"
          >
            +1°
          </button>

          <button
            onClick={() => handleStepDeg(5)}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl transition-colors text-xs font-mono-math"
            title="Step Forward 5°"
            aria-label="Step forward 5 degrees"
          >
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] hidden sm:inline">+5°</span>
              <SkipForward className="w-3.5 h-3.5" />
            </div>
          </button>

          <button
            onClick={onReset}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 border border-white/10 rounded-xl transition-colors"
            title="Reset to 0"
            aria-label="Reset animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleLoop}
            className={`p-2 rounded-xl border transition-colors ${
              isLooping
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
            title="Toggle Repeat Loop"
            aria-label="Toggle loop"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Slow Motion Speed Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Motion Speed:</span>
          </div>
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            {[
              { val: 0.1, label: '0.1x (Slowest)' },
              { val: 0.25, label: '0.25x' },
              { val: 0.5, label: '0.5x (Slow)' },
              { val: 0.75, label: '0.75x' },
              { val: 1.0, label: '1.0x' },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => onSpeedChange(item.val)}
                className={`px-2 py-1 text-xs rounded-lg font-mono-math transition-colors ${
                  playbackSpeed === item.val
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Pacing: ~${Math.round(24 / item.val)}s per cycle`}
              >
                {item.val}x
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-mono-math hidden md:inline">
            (~{cycleDurationSec}s / cycle)
          </span>
        </div>

        {/* Quadrant Quick Jumps */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400 mr-1 hidden lg:inline">Quadrant:</span>
          <button
            onClick={() => onSelectQuadrant('all')}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors font-medium ${
              activeQuadrant === 'all'
                ? 'bg-white/20 text-white border-white/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            All 0–2π
          </button>

          {([1, 2, 3, 4] as QuadrantId[]).map((q) => (
            <button
              key={q}
              onClick={() => {
                onSelectQuadrant(q);
                const startTheta = (q - 1) * (Math.PI / 2);
                onThetaChange(startTheta);
              }}
              className={`px-2 py-1 text-xs rounded-lg border transition-colors font-mono-math ${
                activeQuadrant === q
                  ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
              }`}
            >
              Q{q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
