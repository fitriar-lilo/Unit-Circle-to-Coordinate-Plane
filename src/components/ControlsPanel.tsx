import React from 'react';
import { Sliders, Eye, Triangle, Layers, Activity, Ruler } from 'lucide-react';
import { ThemeConfig, TrigFunction } from '../types';

interface ControlsPanelProps {
  currentTheme: ThemeConfig;
  sliceCountPerQuadrant: number;
  onSliceCountChange: (count: number) => void;
  showRightTriangle: boolean;
  onToggleRightTriangle: () => void;
  showCosineBase: boolean;
  onToggleCosineBase: () => void;
  showProjectionRay: boolean;
  onToggleProjectionRay: () => void;
  showDiscreteSlices: boolean;
  onToggleDiscreteSlices: () => void;
  showSmoothCurve: boolean;
  onToggleSmoothCurve: () => void;
  showCoordinatesHUD: boolean;
  onToggleCoordinatesHUD: () => void;
  showAngleArc: boolean;
  onToggleAngleArc: () => void;
  activeFunction: TrigFunction;
  onSelectFunction: (fn: TrigFunction) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  currentTheme,
  sliceCountPerQuadrant,
  onSliceCountChange,
  showRightTriangle,
  onToggleRightTriangle,
  showCosineBase,
  onToggleCosineBase,
  showProjectionRay,
  onToggleProjectionRay,
  showDiscreteSlices,
  onToggleDiscreteSlices,
  showSmoothCurve,
  onToggleSmoothCurve,
  showCoordinatesHUD,
  onToggleCoordinatesHUD,
  showAngleArc,
  onToggleAngleArc,
  activeFunction,
  onSelectFunction,
}) => {
  return (
    <div
      className={`w-full p-4 sm:p-5 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.panelBg} backdrop-blur-md shadow-xl flex flex-col gap-4 transition-colors`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-100 font-serif-math">
            Visual Layer & Dissection Controls
          </h3>
        </div>

        {/* Function Switcher in Controls Panel */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
          <span className="text-slate-400 text-[11px] px-1 hidden sm:inline">Active Curve:</span>
          <button
            onClick={() => onSelectFunction('sine')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              activeFunction === 'sine'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            sin(θ) Vertical Parts
          </button>
          <button
            onClick={() => onSelectFunction('cosine')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              activeFunction === 'cosine'
                ? 'bg-sky-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            cos(θ) Horizontal Parts
          </button>
          <button
            onClick={() => onSelectFunction('both')}
            className={`px-3 py-1 rounded-lg transition-colors font-medium ${
              activeFunction === 'both'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Both Curves
          </button>
        </div>
      </div>

      {/* Slices Density Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            {activeFunction === 'cosine' ? 'Horizontal Slices' : 'Vertical Slices'} per Quadrant (Dissection Density):
          </span>
          <span className="font-mono-math font-bold text-amber-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            {sliceCountPerQuadrant} parts ({sliceCountPerQuadrant * 4} total in 2π)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">Coarse (4)</span>
          <input
            type="range"
            min={4}
            max={32}
            step={4}
            value={sliceCountPerQuadrant}
            onChange={(e) => onSliceCountChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            aria-label="Dissection slice density"
          />
          <span className="text-[11px] text-slate-400">Fine (32)</span>
        </div>
      </div>

      {/* Layer Toggles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
        <button
          onClick={onToggleDiscreteSlices}
          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1 items-start text-left ${
            showDiscreteSlices
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] opacity-75">{showDiscreteSlices ? 'ON' : 'OFF'}</span>
          </div>
          <span>{activeFunction === 'cosine' ? 'Horizontal Slices' : 'Discrete Slices'}</span>
        </button>

        <button
          onClick={onToggleSmoothCurve}
          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1 items-start text-left ${
            showSmoothCurve
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] opacity-75">{showSmoothCurve ? 'ON' : 'OFF'}</span>
          </div>
          <span>Continuous Wave</span>
        </button>

        <button
          onClick={onToggleProjectionRay}
          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1 items-start text-left ${
            showProjectionRay
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Ruler className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] opacity-75">{showProjectionRay ? 'ON' : 'OFF'}</span>
          </div>
          <span>Projection Tracer</span>
        </button>

        <button
          onClick={onToggleRightTriangle}
          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1 items-start text-left ${
            showRightTriangle
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Triangle className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-[10px] opacity-75">{showRightTriangle ? 'ON' : 'OFF'}</span>
          </div>
          <span>Right Triangle (r=1)</span>
        </button>

        <button
          onClick={onToggleCosineBase}
          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1 items-start text-left ${
            showCosineBase
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] opacity-75">{showCosineBase ? 'ON' : 'OFF'}</span>
          </div>
          <span>Cosine Base Leg</span>
        </button>

        <button
          onClick={onToggleCoordinatesHUD}
          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex flex-col gap-1 items-start text-left ${
            showCoordinatesHUD
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
              : 'bg-white/5 text-slate-400 border-white/10 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] opacity-75">{showCoordinatesHUD ? 'ON' : 'OFF'}</span>
          </div>
          <span>Coordinates HUD</span>
        </button>
      </div>
    </div>
  );
};
