import React from 'react';
import { GraduationCap, Lightbulb, Compass, Award } from 'lucide-react';
import { ThemeConfig, TrigFunction } from '../types';
import { MILESTONES, QUADRANT_INFO, COSINE_QUADRANT_INFO, getQuadrant } from '../utils/mathConstants';

interface TeacherVoiceoverProps {
  currentTheme: ThemeConfig;
  theta: number;
  activeFunction: TrigFunction;
}

export const TeacherVoiceover: React.FC<TeacherVoiceoverProps> = ({
  currentTheme,
  theta,
  activeFunction,
}) => {
  const currentQ = getQuadrant(theta);
  const isCos = activeFunction === 'cosine';
  const qInfo = isCos ? COSINE_QUADRANT_INFO[currentQ] : QUADRANT_INFO[currentQ];
  const sinVal = Math.sin(theta);
  const cosVal = Math.cos(theta);
  const deg = Math.round((theta * 180) / Math.PI) % 360;

  const nearestMilestone = MILESTONES.reduce((prev, curr) =>
    Math.abs(curr.rad - theta) < Math.abs(prev.rad - theta) ? curr : prev
  );

  return (
    <div
      className={`w-full p-5 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.panelBg} backdrop-blur-md shadow-xl flex flex-col gap-4 transition-colors`}
    >
      {/* Teacher Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 font-serif-math">
              Teacher's Classroom: {isCos ? 'Cosine Curve cos(θ)' : activeFunction === 'both' ? 'Sine & Cosine Comparison' : 'Sine Curve sin(θ)'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Phase: {qInfo.title}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-mono-math">θ = {deg}°</span>
              <span aria-hidden="true">·</span>
              <span className="text-sky-400 font-mono-math">cos(θ) = {cosVal.toFixed(3)}</span>
              <span aria-hidden="true">·</span>
              <span className="text-rose-400 font-mono-math">sin(θ) = {sinVal.toFixed(3)}</span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-math font-medium">
            Radius r = 1
          </span>
          {isCos ? (
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono-math font-medium">
              cos(θ) = Adjacent / 1 = x
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono-math font-medium">
              sin(θ) = Opposite / 1 = y
            </span>
          )}
        </div>
      </div>

      {/* Main Pedagogical Guidance Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Geometric Definition */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1.5">
              <Compass className="w-4 h-4" />
              <span>1. {isCos ? 'Horizontal Slices (Cosine)' : 'Vertical Slices (Sine)'}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isCos ? (
                <>
                  Because the hypotenuse is <strong>r = 1</strong>, the adjacent base leg gives{' '}
                  <span className="font-mono-math text-sky-300">cos(θ) = x / 1 = x</span>. The unit
                  circle is divided horizontally into parts. Arranging each horizontal part in order
                  on the coordinate plane creates the cosine wave!
                </>
              ) : (
                <>
                  Because the hypotenuse is <strong>r = 1</strong>, the opposite vertical leg gives{' '}
                  <span className="font-mono-math text-rose-300">sin(θ) = y / 1 = y</span>. The unit
                  circle is divided vertically into parts, forming the sine wave!
                </>
              )}
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-mono-math bg-black/20 p-2 rounded-lg">
            Point P = ({cosVal.toFixed(2)}, {sinVal.toFixed(2)})
          </div>
        </div>

        {/* Card 2: Quadrant Behavior */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1.5">
              <Lightbulb className="w-4 h-4" />
              <span>2. {qInfo.title} Progression</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {qInfo.explanation}
            </p>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-800/40 p-2 rounded-lg">
            Trend: {isCos ? (qInfo as typeof COSINE_QUADRANT_INFO[1]).cosineTrend : (qInfo as typeof QUADRANT_INFO[1]).sineTrend}
          </div>
        </div>

        {/* Card 3: Milestone & Relationship */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400 mb-1.5">
              <Award className="w-4 h-4" />
              <span>3. Exact Value Reference</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isCos ? (
                <>
                  Notice the symmetry: At {nearestMilestone.radLabel} ({nearestMilestone.deg}°),{' '}
                  cos = <strong>{nearestMilestone.cosExact}</strong>. The cosine curve is identical to
                  the sine curve shifted horizontally by π/2 (90°): cos(θ) = sin(θ + 90°)!
                </>
              ) : (
                nearestMilestone.teacherNote
              )}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] bg-sky-950/30 border border-sky-800/40 p-2 rounded-lg font-mono-math text-sky-300">
            <span>cos({nearestMilestone.radLabel}) = {nearestMilestone.cosExact}</span>
            <span>sin = {nearestMilestone.sinExact}</span>
          </div>
        </div>
      </div>

      {/* 4 Quadrants Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-xs">
        <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-700/30 flex flex-col gap-0.5">
          <span className="font-semibold text-emerald-400">Quadrant I (0° → 90°)</span>
          <span className="text-[11px] text-slate-300">
            {isCos ? 'Descends: +1 → 0 (Highest to smallest)' : 'Ascends: 0 → +1 (Smallest to highest)'}
          </span>
          <span className="text-[10px] text-emerald-400/80">
            {isCos ? 'Starts at peak +1' : 'Starts at baseline 0'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-700/30 flex flex-col gap-0.5">
          <span className="font-semibold text-amber-400">Quadrant II (90° → 180°)</span>
          <span className="text-[11px] text-slate-300">
            {isCos ? 'Descends: 0 → -1 (Leftward on x-axis)' : 'Descends: +1 → 0 (Back to baseline)'}
          </span>
          <span className="text-[10px] text-amber-400/80">
            {isCos ? 'Reaches minimum -1 at 180°' : 'Zero at 180°'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-700/30 flex flex-col gap-0.5">
          <span className="font-semibold text-rose-400">Quadrant III (180° → 270°)</span>
          <span className="text-[11px] text-slate-300">
            {isCos ? 'Ascends: -1 → 0 (Back toward y-axis)' : 'Descends: 0 → -1 (Deepest trough)'}
          </span>
          <span className="text-[10px] text-rose-400/80">
            {isCos ? 'Returns to 0 at 270°' : 'Reaches minimum -1 at 270°'}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-700/30 flex flex-col gap-0.5">
          <span className="font-semibold text-cyan-400">Quadrant IV (270° → 360°)</span>
          <span className="text-[11px] text-slate-300">
            {isCos ? 'Ascends: 0 → +1 (Expands rightward)' : 'Ascends: -1 → 0 (Returns to baseline)'}
          </span>
          <span className="text-[10px] text-cyan-400/80">
            {isCos ? 'Completes cycle at +1' : 'Completes cycle at 0'}
          </span>
        </div>
      </div>
    </div>
  );
};
