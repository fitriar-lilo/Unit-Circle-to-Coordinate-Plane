export type QuadrantId = 1 | 2 | 3 | 4;

export type TrigFunction = 'sine' | 'cosine' | 'both';

export type ThemeId = 'cosmic' | 'chalkboard' | 'sunset' | 'blueprint' | 'daylight';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  emoji: string;
  bgClass: string;
  canvasBg: string;
  panelBg: string;
  borderClass: string;
  textPrimary: string;
  textSecondary: string;
  accentCircle: string;
  accentSine: string;
  accentSineFill: string;
  accentTriangle: string;
  accentCosine: string;
  accentGrid: string;
  accentAxis: string;
  accentSlice: string;
  accentProjection: string;
  glowEffect: string;
}

export interface MilestoneAngle {
  deg: number;
  rad: number;
  radLabel: string;
  sinExact: string;
  cosExact: string;
  sinVal: number;
  cosVal: number;
  quadrant: QuadrantId;
  teacherNote: string;
}

export type AnimationMode = 'continuous' | 'discrete-slices' | 'unfolding-transfer';

export interface AppSettings {
  sliceCountPerQuadrant: number; // e.g., 4, 8, 12, 16, 24
  showRightTriangle: boolean;
  showCosineBase: boolean;
  showProjectionRay: boolean;
  showDiscreteSlices: boolean;
  showSmoothCurve: boolean;
  showCoordinatesHUD: boolean;
  showAngleArc: boolean;
  soundEnabled: boolean;
  autoPlay: boolean;
  playbackSpeed: number; // 0.25 to 2.0
  activeQuadrant: QuadrantId | 'all';
}
