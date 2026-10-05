import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Sparkles, Layers } from 'lucide-react';
import { ThemeConfig, QuadrantId, TrigFunction } from '../types';
import { soundFx } from '../utils/audio';

interface SliceUnfolderProps {
  currentTheme: ThemeConfig;
  slicesPerQuadrant: number;
  onSlicesPerQuadrantChange: (n: number) => void;
  activeFunction: TrigFunction;
  onSelectFunction: (fn: TrigFunction) => void;
}

interface SliceData {
  index: number;
  quadrant: QuadrantId;
  theta: number;
  deg: number;
  sinVal: number;
  cosVal: number;
  color: string;
}

export const SliceUnfolderVisualizer: React.FC<SliceUnfolderProps> = ({
  currentTheme,
  slicesPerQuadrant,
  onSlicesPerQuadrantChange,
  activeFunction,
  onSelectFunction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantId | 'all'>('all');
  const [colorMode, setColorMode] = useState<'quadrant' | 'spectrum'>('spectrum');
  const [sliceSpeedMs, setSliceSpeedMs] = useState<number>(650); // Default slow motion for learning

  const totalSlices = slicesPerQuadrant * 4;
  const dTheta = (2 * Math.PI) / totalSlices;

  // Generate slice dataset
  const slices: SliceData[] = React.useMemo(() => {
    const list: SliceData[] = [];
    for (let i = 0; i <= totalSlices; i++) {
      const t = i * dTheta;
      const deg = Math.round((t * 180) / Math.PI);
      const q: QuadrantId = t < Math.PI / 2 ? 1 : t < Math.PI ? 2 : t < (3 * Math.PI) / 2 ? 3 : 4;
      const sinVal = Math.sin(t);
      const cosVal = Math.cos(t);

      let col = '#10b981';
      if (colorMode === 'spectrum') {
        const hue = (i / totalSlices) * 320;
        col = `hsl(${hue}, 85%, 60%)`;
      } else {
        if (q === 1) col = '#10b981';
        else if (q === 2) col = '#f59e0b';
        else if (q === 3) col = '#f43f5e';
        else col = '#38bdf8';
      }

      list.push({
        index: i,
        quadrant: q,
        theta: t,
        deg,
        sinVal,
        cosVal,
        color: col,
      });
    }
    return list;
  }, [totalSlices, dTheta, colorMode]);

  // Autoplay loop with slow motion interval
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next > totalSlices) {
          setIsPlaying(false);
          return totalSlices;
        }
        soundFx.playMilestoneChime(slices[next]?.quadrant || 1, next % slicesPerQuadrant === 0);
        return next;
      });
    }, sliceSpeedMs);
    return () => clearInterval(interval);
  }, [isPlaying, totalSlices, slicesPerQuadrant, slices, sliceSpeedMs]);

  // Canvas drawing
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const isMobile = width < 768;
    const circleCenterX = isMobile ? width * 0.5 : width * 0.22;
    const circleCenterY = isMobile ? height * 0.3 : height * 0.5;
    const circleRadius = isMobile ? Math.min(width * 0.32, height * 0.22) : Math.min(width * 0.16, height * 0.36);

    const waveStartX = isMobile ? width * 0.1 : width * 0.44;
    const waveEndX = isMobile ? width * 0.92 : width * 0.96;
    const waveWidth = waveEndX - waveStartX;
    const waveCenterY = isMobile ? height * 0.72 : height * 0.5;
    const waveAmp = circleRadius;

    const toCircle = (x: number, y: number) => ({
      cx: circleCenterX + x * circleRadius,
      cy: circleCenterY - y * circleRadius,
    });

    const toWave = (t: number, y: number) => ({
      wx: waveStartX + (t / (2 * Math.PI)) * waveWidth,
      wy: waveCenterY - y * waveAmp,
    });

    // 1. Draw Unit Circle Axes
    ctx.strokeStyle = currentTheme.accentAxis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(circleCenterX - circleRadius * 1.25, circleCenterY);
    ctx.lineTo(circleCenterX + circleRadius * 1.25, circleCenterY);
    ctx.moveTo(circleCenterX, circleCenterY - circleRadius * 1.25);
    ctx.lineTo(circleCenterX, circleCenterY + circleRadius * 1.25);
    ctx.stroke();

    // 2. Draw Unit Circle
    ctx.beginPath();
    ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = currentTheme.accentCircle;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 3. Draw Wave Axes
    ctx.beginPath();
    ctx.moveTo(waveStartX, waveCenterY);
    ctx.lineTo(waveEndX, waveCenterY);
    ctx.moveTo(waveStartX, waveCenterY - waveAmp * 1.2);
    ctx.lineTo(waveStartX, waveCenterY + waveAmp * 1.2);
    ctx.stroke();

    // Quadrant vertical lines on wave
    const quadMarks = [Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];
    quadMarks.forEach((rad) => {
      const p = toWave(rad, 0);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = currentTheme.accentGrid;
      ctx.beginPath();
      ctx.moveTo(p.wx, waveCenterY - waveAmp * 1.15);
      ctx.lineTo(p.wx, waveCenterY + waveAmp * 1.15);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Tick labels
    ctx.fillStyle = currentTheme.accentAxis;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('0', waveStartX, waveCenterY + 16);
    ctx.fillText('π/2', toWave(Math.PI / 2, 0).wx, waveCenterY + 16);
    ctx.fillText('π', toWave(Math.PI, 0).wx, waveCenterY + 16);
    ctx.fillText('3π/2', toWave((3 * Math.PI) / 2, 0).wx, waveCenterY + 16);
    ctx.fillText('2π', toWave(2 * Math.PI, 0).wx, waveCenterY + 16);

    // 4. DRAW CURVE GUIDELINE (Sine or Cosine)
    ctx.beginPath();
    ctx.strokeStyle = activeFunction === 'cosine' ? 'rgba(14, 165, 233, 0.25)' : 'rgba(251, 191, 36, 0.25)';
    ctx.lineWidth = 1.5;
    for (let t = 0; t <= Math.PI * 2; t += 0.02) {
      const yVal = activeFunction === 'cosine' ? Math.cos(t) : Math.sin(t);
      const p = toWave(t, yVal);
      if (t === 0) ctx.moveTo(p.wx, p.wy);
      else ctx.lineTo(p.wx, p.wy);
    }
    ctx.stroke();

    // 5. DRAW EACH SLICE: EITHER VERTICAL (SINE) OR HORIZONTAL (COSINE)
    slices.forEach((slice) => {
      if (selectedQuadrant !== 'all' && slice.quadrant !== selectedQuadrant) return;

      const isRevealed = slice.index <= activeStep;
      const isCurrentActive = slice.index === activeStep;

      if (activeFunction === 'cosine') {
        // COSINE: Unit circle divided HORIZONTALLY into many parts!
        // In circle: horizontal slice at height sin(theta) from y-axis (0, sin) to (cos, sin)
        const circleOriginY = toCircle(0, slice.sinVal);
        const circleEdge = toCircle(slice.cosVal, slice.sinVal);

        // On wave plane: vertical bar of height cos(theta) at position theta
        const waveBase = toWave(slice.theta, 0);
        const waveTop = toWave(slice.theta, slice.cosVal);

        if (!isRevealed) {
          // Faint slice in circle
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(circleOriginY.cx, circleOriginY.cy);
          ctx.lineTo(circleEdge.cx, circleEdge.cy);
          ctx.stroke();
          return;
        }

        // Draw horizontal part in circle
        ctx.strokeStyle = isCurrentActive ? '#0ea5e9' : slice.color;
        ctx.lineWidth = isCurrentActive ? 3.5 : 1.5;
        if (isCurrentActive) {
          ctx.shadowColor = '#0ea5e9';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.moveTo(circleOriginY.cx, circleOriginY.cy);
        ctx.lineTo(circleEdge.cx, circleEdge.cy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw arranged part in Coordinate Plane
        // (arranged in order: in Q1 from highest part +1 down to 0)
        ctx.strokeStyle = isCurrentActive ? '#0ea5e9' : slice.color;
        ctx.lineWidth = isCurrentActive ? 4 : Math.max(2, Math.min(5, waveWidth / totalSlices - 1));
        if (isCurrentActive) {
          ctx.shadowColor = '#0ea5e9';
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.moveTo(waveBase.wx, waveBase.wy);
        ctx.lineTo(waveTop.wx, waveTop.wy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Cap dot on wave
        ctx.fillStyle = isCurrentActive ? '#0ea5e9' : slice.color;
        ctx.beginPath();
        ctx.arc(waveTop.wx, waveTop.wy, isCurrentActive ? 4 : 2, 0, Math.PI * 2);
        ctx.fill();

        // If current active, draw dynamic rotation arc:
        // shows how the horizontal length in circle maps to vertical height on wave!
        if (isCurrentActive) {
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#0ea5e9';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(circleEdge.cx, circleEdge.cy);
          ctx.quadraticCurveTo(
            (circleEdge.cx + waveTop.wx) / 2,
            Math.min(circleEdge.cy, waveTop.wy) - 30,
            waveTop.wx,
            waveTop.wy
          );
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        // SINE: Unit circle divided VERTICALLY into many parts!
        // In circle: vertical slice from x-axis (cos, 0) to (cos, sin)
        const circleBase = toCircle(slice.cosVal, 0);
        const circleTop = toCircle(slice.cosVal, slice.sinVal);

        const waveBase = toWave(slice.theta, 0);
        const waveTop = toWave(slice.theta, slice.sinVal);

        if (!isRevealed) {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(circleBase.cx, circleBase.cy);
          ctx.lineTo(circleTop.cx, circleTop.cy);
          ctx.stroke();
          return;
        }

        // Draw vertical slice in circle
        ctx.strokeStyle = isCurrentActive ? '#ef4444' : slice.color;
        ctx.lineWidth = isCurrentActive ? 3.5 : 1.5;
        if (isCurrentActive) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.moveTo(circleBase.cx, circleBase.cy);
        ctx.lineTo(circleTop.cx, circleTop.cy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Arranged in order on wave plane: in Q1 from smallest to highest!
        ctx.strokeStyle = isCurrentActive ? '#ef4444' : slice.color;
        ctx.lineWidth = isCurrentActive ? 4 : Math.max(2, Math.min(5, waveWidth / totalSlices - 1));
        if (isCurrentActive) {
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
        }
        ctx.beginPath();
        ctx.moveTo(waveBase.wx, waveBase.wy);
        ctx.lineTo(waveTop.wx, waveTop.wy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = isCurrentActive ? '#ef4444' : slice.color;
        ctx.beginPath();
        ctx.arc(waveTop.wx, waveTop.wy, isCurrentActive ? 4 : 2, 0, Math.PI * 2);
        ctx.fill();

        if (isCurrentActive) {
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(circleTop.cx, circleTop.cy);
          ctx.quadraticCurveTo(
            (circleTop.cx + waveTop.wx) / 2,
            Math.min(circleTop.cy, waveTop.wy) - 30,
            waveTop.wx,
            waveTop.wy
          );
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    });

    ctx.restore();
  }, [
    currentTheme,
    slices,
    activeStep,
    totalSlices,
    selectedQuadrant,
    activeFunction,
  ]);

  useEffect(() => {
    let id: number;
    const loop = () => {
      render();
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [render]);

  const currentSlice = slices[activeStep] || slices[0];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Visual Canvas */}
      <div
        className={`relative w-full h-[400px] sm:h-[460px] rounded-2xl border ${currentTheme.borderClass} overflow-hidden shadow-2xl transition-all`}
        style={{ backgroundColor: currentTheme.canvasBg }}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Current Slice Telemetry Badge */}
        <div className="absolute top-3 left-4 flex flex-wrap items-center gap-2 text-xs pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
            <span className="text-slate-400">Slice:</span>
            <span className="font-mono-math font-bold text-amber-400">
              #{currentSlice.index} of {totalSlices}
            </span>
            <span className="text-slate-500">·</span>
            <span className="font-mono-math text-emerald-400 font-semibold">
              θ = {currentSlice.deg}°
            </span>
          </div>

          {activeFunction === 'cosine' ? (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
              <span className="text-sky-400 font-serif-math">Horizontal Cosine Part:</span>
              <span className="font-mono-math font-bold text-sky-300">
                x = cos(θ) = {currentSlice.cosVal >= 0 ? `+${currentSlice.cosVal.toFixed(3)}` : currentSlice.cosVal.toFixed(3)}
              </span>
            </div>
          ) : (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-3 py-1.5 shadow-lg flex items-center gap-2">
              <span className="text-rose-400 font-serif-math">Vertical Sine Part:</span>
              <span className="font-mono-math font-bold text-rose-300">
                y = sin(θ) = {currentSlice.sinVal >= 0 ? `+${currentSlice.sinVal.toFixed(3)}` : currentSlice.sinVal.toFixed(3)}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Teacher Callout on Canvas */}
        <div className="absolute bottom-3 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-slate-300 shadow-xl">
          <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {activeFunction === 'cosine' ? (
                currentSlice.quadrant === 1
                  ? 'Cosine Q I: Highest to Smallest (+1 to 0)'
                  : currentSlice.quadrant === 2
                  ? 'Cosine Q II: Descending below axis (0 to -1)'
                  : currentSlice.quadrant === 3
                  ? 'Cosine Q III: Ascending toward zero (-1 to 0)'
                  : 'Cosine Q IV: Ascending back to Peak (0 to +1)'
              ) : (
                currentSlice.quadrant === 1
                  ? 'Sine Q I: Smallest to Highest (0 to +1)'
                  : currentSlice.quadrant === 2
                  ? 'Sine Q II: Descending from Peak (+1 to 0)'
                  : currentSlice.quadrant === 3
                  ? 'Sine Q III: Inverting to Trough (0 to -1)'
                  : 'Sine Q IV: Ascending back to Start (-1 to 0)'
              )}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {activeFunction === 'cosine'
              ? currentSlice.quadrant === 1
                ? 'In the unit circle, cosine is divided horizontally. At 0°, the horizontal segment has maximum length 1. As θ climbs to 90°, the horizontal part contracts in order from highest (+1) down to smallest (0) on the coordinate plane!'
                : currentSlice.quadrant === 2
                ? 'In Quadrant II, the horizontal segment extends leftward along the negative x-axis, dropping from 0 to -1 at 180°.'
                : currentSlice.quadrant === 3
                ? 'In Quadrant III, the horizontal segment shrinks back toward the y-axis, rising from -1 to 0 at 270°.'
                : 'In Quadrant IV, the horizontal segment expands rightward, returning from 0 to +1 at 360°, completing the cosine cycle!'
              : currentSlice.quadrant === 1
              ? 'In the unit circle, sine is divided vertically. As θ increases, the vertical leg grows from the smallest part (0) to the highest part (+1), arranging the rising crest on the coordinate plane.'
              : currentSlice.quadrant === 2
              ? 'In Quadrant II, the vertical leg descends from 1 back down to 0 at 180°.'
              : currentSlice.quadrant === 3
              ? 'In Quadrant III, the vertical leg drops below the horizontal axis to -1 at 270°.'
              : 'In Quadrant IV, the vertical leg ascends from -1 back to 0 at 360°.'}
          </p>
        </div>
      </div>

      {/* Control Bar for Unfolding Slices */}
      <div className={`p-4 rounded-xl border ${currentTheme.borderClass} ${currentTheme.panelBg} flex flex-col md:flex-row items-center justify-between gap-4`}>
        {/* Playback & Step Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
          <button
            onClick={() => {
              if (activeStep >= totalSlices) setActiveStep(0);
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-all shadow-md active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play Slices'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((prev) => Math.max(0, prev - 1));
            }}
            disabled={activeStep <= 0}
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-200 border border-white/10 rounded-lg transition-colors"
            title="Step Back One Slice"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((prev) => Math.min(totalSlices, prev + 1));
            }}
            disabled={activeStep >= totalSlices}
            className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-200 border border-white/10 rounded-lg transition-colors"
            title="Step Forward One Slice"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveStep(0);
            }}
            className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg transition-colors"
            title="Reset to 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setActiveStep(totalSlices);
              setIsPlaying(false);
            }}
            className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-lg transition-colors whitespace-nowrap"
          >
            Show All
          </button>
        </div>

        {/* Function Toggle (Sine vs Cosine) */}
        <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-lg border border-white/15 text-xs">
          <span className="text-slate-400 text-[11px] px-1 hidden sm:inline">Slice Function:</span>
          <button
            onClick={() => onSelectFunction('cosine')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeFunction === 'cosine'
                ? 'bg-sky-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            cos(θ) Horizontal Parts
          </button>
          <button
            onClick={() => onSelectFunction('sine')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeFunction === 'sine'
                ? 'bg-rose-500 text-white font-bold shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            sin(θ) Vertical Parts
          </button>
        </div>

        {/* Slice Scrubber / Slider */}
        <div className="flex-1 w-full flex items-center gap-3 max-w-xs">
          <input
            type="range"
            min={0}
            max={totalSlices}
            value={activeStep}
            onChange={(e) => {
              setIsPlaying(false);
              const val = Number(e.target.value);
              setActiveStep(val);
              soundFx.checkAndPlayAngleSound(slices[val]?.deg || 0);
            }}
            className="w-full accent-amber-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono-math text-amber-400 w-12 text-right">
            {activeStep}/{totalSlices}
          </span>
        </div>

        {/* Slice Motion Speed Pacing */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
          <span className="text-slate-400 text-[11px] px-1 hidden lg:inline">Pacing:</span>
          {[
            { ms: 850, label: 'Slow (850ms)' },
            { ms: 600, label: 'Gentle (600ms)' },
            { ms: 350, label: 'Quick (350ms)' },
          ].map((spd) => (
            <button
              key={spd.ms}
              onClick={() => setSliceSpeedMs(spd.ms)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono-math transition-colors ${
                sliceSpeedMs === spd.ms
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd.label}
            </button>
          ))}
        </div>

        {/* Slices Density Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 whitespace-nowrap">Parts / Q:</span>
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            {[4, 8, 12, 16, 24].map((n) => (
              <button
                key={n}
                onClick={() => {
                  onSlicesPerQuadrantChange(n);
                  setActiveStep(0);
                }}
                className={`px-2 py-1 text-xs rounded transition-colors font-mono-math ${
                  slicesPerQuadrant === n
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quadrant Quick Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            q: 1,
            name: 'Quadrant I (0°–90°)',
            desc:
              activeFunction === 'cosine'
                ? 'Horizontal parts: Highest (+1) to Smallest (0)'
                : 'Vertical parts: Smallest (0) to Highest (+1)',
            color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
          },
          {
            q: 2,
            name: 'Quadrant II (90°–180°)',
            desc:
              activeFunction === 'cosine'
                ? 'Horizontal parts: Descend from 0 to -1'
                : 'Vertical parts: Highest (+1) down to 0',
            color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
          },
          {
            q: 3,
            name: 'Quadrant III (180°–270°)',
            desc:
              activeFunction === 'cosine'
                ? 'Horizontal parts: Ascend from -1 to 0'
                : 'Vertical parts: Descend from 0 to -1',
            color: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
          },
          {
            q: 4,
            name: 'Quadrant IV (270°–360°)',
            desc:
              activeFunction === 'cosine'
                ? 'Horizontal parts: Ascend from 0 to +1'
                : 'Vertical parts: Ascend from -1 to 0',
            color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
          },
        ].map((item) => (
          <div
            key={item.q}
            onClick={() => {
              setSelectedQuadrant(selectedQuadrant === item.q ? 'all' : (item.q as QuadrantId));
              setActiveStep(item.q * slicesPerQuadrant);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${item.color} ${
              selectedQuadrant === item.q ? 'ring-2 ring-amber-400 shadow-lg' : 'hover:opacity-90'
            }`}
          >
            <div className="flex items-center justify-between font-semibold text-xs mb-1">
              <span>{item.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono-math">
                {slicesPerQuadrant} slices
              </span>
            </div>
            <p className="text-[11px] opacity-80">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
