import { MilestoneAngle, QuadrantId, ThemeConfig, ThemeId } from '../types';

export const MILESTONES: MilestoneAngle[] = [
  {
    deg: 0,
    rad: 0,
    radLabel: '0',
    sinExact: '0',
    cosExact: '1',
    sinVal: 0,
    cosVal: 1,
    quadrant: 1,
    teacherNote: 'Starting at 0 rad (0°): The radius is horizontal along the positive x-axis. The vertical opposite side has length 0, so sin(0) = 0!',
  },
  {
    deg: 30,
    rad: Math.PI / 6,
    radLabel: 'π/6',
    sinExact: '1/2',
    cosExact: '√3/2',
    sinVal: 0.5,
    cosVal: Math.sqrt(3) / 2,
    quadrant: 1,
    teacherNote: 'At π/6 (30°): The vertical sine slice has climbed to exactly half the radius height: sin(30°) = 0.5.',
  },
  {
    deg: 45,
    rad: Math.PI / 4,
    radLabel: 'π/4',
    sinExact: '√2/2',
    cosExact: '√2/2',
    sinVal: Math.SQRT2 / 2,
    cosVal: Math.SQRT2 / 2,
    quadrant: 1,
    teacherNote: 'At π/4 (45°): The triangle is an isosceles right triangle! The base (cos) and height (sin) are equal at √2/2 ≈ 0.707.',
  },
  {
    deg: 60,
    rad: Math.PI / 3,
    radLabel: 'π/3',
    sinExact: '√3/2',
    cosExact: '1/2',
    sinVal: Math.sqrt(3) / 2,
    cosVal: 0.5,
    quadrant: 1,
    teacherNote: 'At π/3 (60°): The vertical sine height is almost at the top: √3/2 ≈ 0.866.',
  },
  {
    deg: 90,
    rad: Math.PI / 2,
    radLabel: 'π/2',
    sinExact: '1',
    cosExact: '0',
    sinVal: 1,
    cosVal: 0,
    quadrant: 1,
    teacherNote: 'Peak of Quadrant I at π/2 (90°): The vertical leg reaches its maximum height equal to the full radius: sin(90°) = 1.0!',
  },
  {
    deg: 120,
    rad: (2 * Math.PI) / 3,
    radLabel: '2π/3',
    sinExact: '√3/2',
    cosExact: '-1/2',
    sinVal: Math.sqrt(3) / 2,
    cosVal: -0.5,
    quadrant: 2,
    teacherNote: 'Quadrant II at 2π/3 (120°): The sine height begins descending, perfectly mirroring 60°: sin = √3/2 ≈ 0.866.',
  },
  {
    deg: 135,
    rad: (3 * Math.PI) / 4,
    radLabel: '3π/4',
    sinExact: '√2/2',
    cosExact: '-√2/2',
    sinVal: Math.SQRT2 / 2,
    cosVal: -Math.SQRT2 / 2,
    quadrant: 2,
    teacherNote: 'At 3π/4 (135°): Symmetric to 45°, height is √2/2 ≈ 0.707 while x (cosine) is negative.',
  },
  {
    deg: 150,
    rad: (5 * Math.PI) / 6,
    radLabel: '5π/6',
    sinExact: '1/2',
    cosExact: '-√3/2',
    sinVal: 0.5,
    cosVal: -Math.sqrt(3) / 2,
    quadrant: 2,
    teacherNote: 'At 5π/6 (150°): The vertical sine slice descends to 0.5 as we approach the negative x-axis.',
  },
  {
    deg: 180,
    rad: Math.PI,
    radLabel: 'π',
    sinExact: '0',
    cosExact: '-1',
    sinVal: 0,
    cosVal: -1,
    quadrant: 2,
    teacherNote: 'Half cycle complete at π (180°): Point lies on the negative x-axis (-1, 0). The vertical height is zero: sin(π) = 0.',
  },
  {
    deg: 210,
    rad: (7 * Math.PI) / 6,
    radLabel: '7π/6',
    sinExact: '-1/2',
    cosExact: '-√3/2',
    sinVal: -0.5,
    cosVal: -Math.sqrt(3) / 2,
    quadrant: 3,
    teacherNote: 'Quadrant III at 7π/6 (210°): The sine enters the negative territory! The vertical segment extends downward: sin = -0.5.',
  },
  {
    deg: 225,
    rad: (5 * Math.PI) / 4,
    radLabel: '5π/4',
    sinExact: '-√2/2',
    cosExact: '-√2/2',
    sinVal: -Math.SQRT2 / 2,
    cosVal: -Math.SQRT2 / 2,
    quadrant: 3,
    teacherNote: 'At 5π/4 (225°): Both base and height are negative: cos = -√2/2, sin = -√2/2 ≈ -0.707.',
  },
  {
    deg: 240,
    rad: (4 * Math.PI) / 3,
    radLabel: '4π/3',
    sinExact: '-√3/2',
    cosExact: '-1/2',
    sinVal: -Math.sqrt(3) / 2,
    cosVal: -0.5,
    quadrant: 3,
    teacherNote: 'At 4π/3 (240°): Deep into Quadrant III, vertical distance below axis is -√3/2 ≈ -0.866.',
  },
  {
    deg: 270,
    rad: (3 * Math.PI) / 2,
    radLabel: '3π/2',
    sinExact: '-1',
    cosExact: '0',
    sinVal: -1,
    cosVal: 0,
    quadrant: 3,
    teacherNote: 'Trough of the wave at 3π/2 (270°): Point is at (0, -1). The vertical segment reaches minimum value: sin(3π/2) = -1.0!',
  },
  {
    deg: 300,
    rad: (5 * Math.PI) / 3,
    radLabel: '5π/3',
    sinExact: '-√3/2',
    cosExact: '1/2',
    sinVal: -Math.sqrt(3) / 2,
    cosVal: 0.5,
    quadrant: 4,
    teacherNote: 'Quadrant IV at 5π/3 (300°): Ascending back toward zero! Height is -√3/2 while x is positive again.',
  },
  {
    deg: 315,
    rad: (7 * Math.PI) / 4,
    radLabel: '7π/4',
    sinExact: '-√2/2',
    cosExact: '√2/2',
    sinVal: -Math.SQRT2 / 2,
    cosVal: Math.SQRT2 / 2,
    quadrant: 4,
    teacherNote: 'At 7π/4 (315°): Isosceles right triangle in Q4: height is -√2/2, base is +√2/2.',
  },
  {
    deg: 330,
    rad: (11 * Math.PI) / 6,
    radLabel: '11π/6',
    sinExact: '-1/2',
    cosExact: '√3/2',
    sinVal: -0.5,
    cosVal: Math.sqrt(3) / 2,
    quadrant: 4,
    teacherNote: 'At 11π/6 (330°): Almost home! Vertical sine is just -0.5, returning upward toward 0.',
  },
  {
    deg: 360,
    rad: 2 * Math.PI,
    radLabel: '2π',
    sinExact: '0',
    cosExact: '1',
    sinVal: 0,
    cosVal: 1,
    quadrant: 4,
    teacherNote: 'Full cycle completed at 2π (360°): Back to the starting point! One complete period of the sine wave has been drawn.',
  },
];

export const QUADRANT_INFO: Record<
  QuadrantId,
  {
    title: string;
    rangeDeg: string;
    rangeRad: string;
    behavior: string;
    sineTrend: string;
    badgeColor: string;
    explanation: string;
  }
> = {
  1: {
    title: 'Quadrant I',
    rangeDeg: '0° → 90°',
    rangeRad: '0 → π/2',
    behavior: 'Ascending (0 to +1)',
    sineTrend: 'From smallest vertical part to highest peak',
    badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-700/50',
    explanation:
      'In the first quadrant, as theta increases, the vertical side of the right triangle grows from the smallest part (0) to the highest part (+1).',
  },
  2: {
    title: 'Quadrant II',
    rangeDeg: '90° → 180°',
    rangeRad: 'π/2 → π',
    behavior: 'Descending (+1 to 0)',
    sineTrend: 'From highest peak back down to smallest (0)',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-700/50',
    explanation:
      'In the second quadrant, theta keeps increasing, but the vertical side in the unit circle descends from +1 back to 0 at theta = π.',
  },
  3: {
    title: 'Quadrant III',
    rangeDeg: '180° → 270°',
    rangeRad: 'π → 3π/2',
    behavior: 'Descending below axis (0 to -1)',
    sineTrend: 'Extends downward to the deepest trough (-1)',
    badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-700/50',
    explanation:
      'In the third quadrant, points drop below the horizontal axis, so y = sin(theta) becomes negative, reaching the minimum of -1.',
  },
  4: {
    title: 'Quadrant IV',
    rangeDeg: '270° → 360°',
    rangeRad: '3π/2 → 2π',
    behavior: 'Ascending back to zero (-1 to 0)',
    sineTrend: 'Ascends from trough back to starting baseline (0)',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50',
    explanation:
      'In the fourth quadrant, the vertical leg ascends upward from -1 back to 0, completing one smooth periodic wave cycle.',
  },
};

export const COSINE_QUADRANT_INFO: Record<
  QuadrantId,
  {
    title: string;
    rangeDeg: string;
    rangeRad: string;
    behavior: string;
    cosineTrend: string;
    badgeColor: string;
    explanation: string;
  }
> = {
  1: {
    title: 'Quadrant I',
    rangeDeg: '0° → 90°',
    rangeRad: '0 → π/2',
    behavior: 'Descending (+1 to 0)',
    cosineTrend: 'From highest horizontal part (+1) down to smallest (0)',
    badgeColor: 'text-sky-400 bg-sky-950/60 border-sky-700/50',
    explanation:
      'In the first quadrant, as theta opens from 0 to 90°, the horizontal base leg of the triangle contracts from the full radius length (+1) down to zero.',
  },
  2: {
    title: 'Quadrant II',
    rangeDeg: '90° → 180°',
    rangeRad: 'π/2 → π',
    behavior: 'Descending below axis (0 to -1)',
    cosineTrend: 'Extends leftward along negative x-axis from 0 down to -1',
    badgeColor: 'text-indigo-400 bg-indigo-950/60 border-indigo-700/50',
    explanation:
      'In the second quadrant, the point moves to the left of the y-axis, making x = cos(theta) negative and reaching its minimum of -1 at theta = π.',
  },
  3: {
    title: 'Quadrant III',
    rangeDeg: '180° → 270°',
    rangeRad: 'π → 3π/2',
    behavior: 'Ascending toward zero (-1 to 0)',
    cosineTrend: 'Ascends from negative trough (-1) back to zero line',
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-700/50',
    explanation:
      'In the third quadrant, the horizontal coordinate contracts back toward the vertical y-axis, rising from -1 to 0 at 270°.',
  },
  4: {
    title: 'Quadrant IV',
    rangeDeg: '270° → 360°',
    rangeRad: '3π/2 → 2π',
    behavior: 'Ascending to peak (0 to +1)',
    cosineTrend: 'Expands rightward from zero back to highest part (+1)',
    badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-700/50',
    explanation:
      'In the fourth quadrant, x is positive again, expanding from 0 back to the maximum radius length of +1 at 360° (2π).',
  },
};

export const THEMES: Record<ThemeId, ThemeConfig> = {
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Chalkboard',
    emoji: '🌌',
    bgClass: 'bg-[#090d1a] text-slate-100',
    canvasBg: '#0d1326',
    panelBg: 'bg-[#111936]/80',
    borderClass: 'border-[#1e2952]',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accentCircle: '#38bdf8', // sky cyan
    accentSine: '#fbbf24', // radiant amber
    accentSineFill: 'rgba(251, 191, 36, 0.15)',
    accentTriangle: '#a78bfa', // purple
    accentCosine: '#60a5fa', // blue
    accentGrid: '#182449',
    accentAxis: '#475569',
    accentSlice: '#34d399', // bright emerald
    accentProjection: '#f43f5e', // rose tracer
    glowEffect: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]',
  },
  chalkboard: {
    id: 'chalkboard',
    name: 'Classroom Chalkboard',
    emoji: '✏️',
    bgClass: 'bg-[#112019] text-emerald-50',
    canvasBg: '#152920',
    panelBg: 'bg-[#1a3328]/85',
    borderClass: 'border-[#264939]',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200/70',
    accentCircle: '#7dd3fc', // pale blue chalk
    accentSine: '#fde047', // yellow chalk
    accentSineFill: 'rgba(253, 224, 71, 0.12)',
    accentTriangle: '#f472b6', // pink chalk
    accentCosine: '#6ee7b7', // mint chalk
    accentGrid: '#1f3d30',
    accentAxis: '#52796f',
    accentSlice: '#a7f3d0', // pale chalk green
    accentProjection: '#f87171', // soft red chalk
    glowEffect: 'drop-shadow-[0_0_6px_rgba(253,224,71,0.4)]',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Math Lab',
    emoji: '🌅',
    bgClass: 'bg-[#1a0f26] text-amber-50',
    canvasBg: '#231433',
    panelBg: 'bg-[#2f1b44]/80',
    borderClass: 'border-[#4c2d6e]',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-pink-200/70',
    accentCircle: '#f472b6', // neon pink
    accentSine: '#fb923c', // vibrant orange
    accentSineFill: 'rgba(251, 146, 60, 0.18)',
    accentTriangle: '#c084fc', // purple
    accentCosine: '#38bdf8', // cyan
    accentGrid: '#351d4e',
    accentAxis: '#6b4c8a',
    accentSlice: '#facc15', // yellow
    accentProjection: '#ec4899', // bright pink
    glowEffect: 'drop-shadow-[0_0_8px_rgba(251,146,60,0.5)]',
  },
  blueprint: {
    id: 'blueprint',
    name: 'Architect Blueprint',
    emoji: '📐',
    bgClass: 'bg-[#08182b] text-sky-100',
    canvasBg: '#0c223c',
    panelBg: 'bg-[#112d4e]/85',
    borderClass: 'border-[#1b436e]',
    textPrimary: 'text-sky-100',
    textSecondary: 'text-sky-300/70',
    accentCircle: '#38bdf8', // blueprint cyan
    accentSine: '#22d3ee', // bright cyan
    accentSineFill: 'rgba(34, 211, 238, 0.14)',
    accentTriangle: '#e2e8f0', // crisp white
    accentCosine: '#93c5fd', // soft blue
    accentGrid: '#14375f',
    accentAxis: '#2563eb',
    accentSlice: '#4ade80', // sharp green
    accentProjection: '#f97316', // bright orange
    glowEffect: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]',
  },
  daylight: {
    id: 'daylight',
    name: 'Daylight Paper Grid',
    emoji: '☀️',
    bgClass: 'bg-[#f8fafc] text-slate-900',
    canvasBg: '#ffffff',
    panelBg: 'bg-white/90 shadow-sm',
    borderClass: 'border-slate-200',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-500',
    accentCircle: '#0284c7', // royal blue
    accentSine: '#d97706', // amber gold
    accentSineFill: 'rgba(217, 119, 6, 0.12)',
    accentTriangle: '#7c3aed', // violet
    accentCosine: '#2563eb', // blue
    accentGrid: '#e2e8f0',
    accentAxis: '#94a3b8',
    accentSlice: '#059669', // emerald
    accentProjection: '#e11d48', // rose
    glowEffect: '',
  },
};

export function getQuadrant(theta: number): QuadrantId {
  // Normalize theta to [0, 2pi)
  const normalized = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  if (normalized < Math.PI / 2) return 1;
  if (normalized < Math.PI) return 2;
  if (normalized < (3 * Math.PI) / 2) return 3;
  return 4;
}

export function formatRad(theta: number): string {
  const norm = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  // Check exact milestones
  const milestone = MILESTONES.find((m) => Math.abs(m.rad - norm) < 0.02);
  if (milestone) return milestone.radLabel;
  return `${(norm / Math.PI).toFixed(2)}π`;
}
