/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { THEMES } from './utils/mathConstants';
import { ThemeId, QuadrantId, TrigFunction } from './types';
import { Header } from './components/Header';
import { MainVisualizer } from './components/MainVisualizer';
import { SliceUnfolderVisualizer } from './components/SliceUnfolderVisualizer';
import { PlaybackControls } from './components/PlaybackControls';
import { TeacherVoiceover } from './components/TeacherVoiceover';
import { StudentQuiz } from './components/StudentQuiz';
import { ControlsPanel } from './components/ControlsPanel';
import { soundFx } from './utils/audio';

export default function App() {
  // Theme state
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('cosmic');
  const currentTheme = THEMES[currentThemeId];

  // Sound state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'visualizer' | 'unfolder' | 'lesson' | 'quiz'>('visualizer');

  // Trigonometric Function: 'cosine' | 'sine' | 'both'
  const [activeFunction, setActiveFunction] = useState<TrigFunction>('cosine');

  // Video Animation state (default slow motion for classroom pacing)
  const [theta, setTheta] = useState<number>(Math.PI / 4); // start at 45 deg
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.5);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [activeQuadrant, setActiveQuadrant] = useState<QuadrantId | 'all'>('all');

  // Visual dissection controls
  const [sliceCountPerQuadrant, setSliceCountPerQuadrant] = useState<number>(12);
  const [showRightTriangle, setShowRightTriangle] = useState<boolean>(true);
  const [showCosineBase, setShowCosineBase] = useState<boolean>(true);
  const [showProjectionRay, setShowProjectionRay] = useState<boolean>(true);
  const [showDiscreteSlices, setShowDiscreteSlices] = useState<boolean>(true);
  const [showSmoothCurve, setShowSmoothCurve] = useState<boolean>(true);
  const [showCoordinatesHUD, setShowCoordinatesHUD] = useState<boolean>(true);
  const [showAngleArc, setShowAngleArc] = useState<boolean>(true);

  // Sync soundFx mute state
  useEffect(() => {
    soundFx.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Video Animation Loop via requestAnimationFrame
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let animId: number;

    const animate = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Full 2pi cycle takes ~24 seconds at 1.0x speed (calm, slow, student-friendly pacing)
      const angularSpeed = (2 * Math.PI) / 24;
      const step = angularSpeed * playbackSpeed * dt;

      setTheta((prev) => {
        let next = prev + step;
        if (next >= 2 * Math.PI) {
          if (isLooping) {
            next = next % (2 * Math.PI);
          } else {
            next = 2 * Math.PI;
            setIsPlaying(false);
          }
        }
        soundFx.checkAndPlayAngleSound((next * 180) / Math.PI);
        return next;
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed, isLooping]);

  const handleThetaChange = (newTheta: number) => {
    setTheta(newTheta);
  };

  const handleTogglePlay = () => {
    if (theta >= 2 * Math.PI - 0.01) {
      setTheta(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTheta(0);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${currentTheme.bgClass}`}
    >
      {/* Top Header Contract */}
      <Header
        currentTheme={currentTheme}
        onSelectTheme={setCurrentThemeId}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeFunction={activeFunction}
        onSelectFunction={setActiveFunction}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6">
        {/* Banner Title & Pedagogical Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
              <span>Classroom Interactive Animation</span>
              <span aria-hidden="true">·</span>
              <span>
                {activeFunction === 'cosine'
                  ? 'Unit Circle (r = 1) to y = cos(θ) [Horizontal Parts]'
                  : activeFunction === 'sine'
                  ? 'Unit Circle (r = 1) to y = sin(θ) [Vertical Parts]'
                  : 'Dual Unit Circle: sin(θ) & cos(θ) Comparison'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-serif-math">
              {activeFunction === 'cosine'
                ? 'The Genesis of the Cosine Curve: Horizontal Parts in Motion'
                : activeFunction === 'sine'
                ? 'The Genesis of the Sine Curve: Vertical Slices in Motion'
                : 'Trigonometric Symmetry: Sine vs. Cosine Phase Shift'}
            </h1>
          </div>

          {/* Quick Curve Toggle Buttons in Banner */}
          <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveFunction('cosine')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                activeFunction === 'cosine'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              cos(θ) Horizontal
            </button>
            <button
              onClick={() => setActiveFunction('sine')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                activeFunction === 'sine'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              sin(θ) Vertical
            </button>
            <button
              onClick={() => setActiveFunction('both')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                activeFunction === 'both'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Compare Both
            </button>
          </div>
        </div>

        {/* Tab 1: Primary Interactive Circle & Wave Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-5">
            <MainVisualizer
              currentTheme={currentTheme}
              theta={theta}
              onThetaChange={handleThetaChange}
              sliceCountPerQuadrant={sliceCountPerQuadrant}
              showRightTriangle={showRightTriangle}
              showCosineBase={showCosineBase}
              showProjectionRay={showProjectionRay}
              showDiscreteSlices={showDiscreteSlices}
              showSmoothCurve={showSmoothCurve}
              showCoordinatesHUD={showCoordinatesHUD}
              showAngleArc={showAngleArc}
              activeQuadrant={activeQuadrant}
              activeFunction={activeFunction}
              onSelectFunction={setActiveFunction}
            />

            <PlaybackControls
              currentTheme={currentTheme}
              theta={theta}
              onThetaChange={handleThetaChange}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleReset}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              isLooping={isLooping}
              onToggleLoop={() => setIsLooping(!isLooping)}
              activeQuadrant={activeQuadrant}
              onSelectQuadrant={setActiveQuadrant}
            />

            <ControlsPanel
              currentTheme={currentTheme}
              sliceCountPerQuadrant={sliceCountPerQuadrant}
              onSliceCountChange={setSliceCountPerQuadrant}
              showRightTriangle={showRightTriangle}
              onToggleRightTriangle={() => setShowRightTriangle(!showRightTriangle)}
              showCosineBase={showCosineBase}
              onToggleCosineBase={() => setShowCosineBase(!showCosineBase)}
              showProjectionRay={showProjectionRay}
              onToggleProjectionRay={() => setShowProjectionRay(!showProjectionRay)}
              showDiscreteSlices={showDiscreteSlices}
              onToggleDiscreteSlices={() => setShowDiscreteSlices(!showDiscreteSlices)}
              showSmoothCurve={showSmoothCurve}
              onToggleSmoothCurve={() => setShowSmoothCurve(!showSmoothCurve)}
              showCoordinatesHUD={showCoordinatesHUD}
              onToggleCoordinatesHUD={() => setShowCoordinatesHUD(!showCoordinatesHUD)}
              showAngleArc={showAngleArc}
              onToggleAngleArc={() => setShowAngleArc(!showAngleArc)}
              activeFunction={activeFunction}
              onSelectFunction={setActiveFunction}
            />

            <TeacherVoiceover
              currentTheme={currentTheme}
              theta={theta}
              activeFunction={activeFunction}
            />
          </div>
        )}

        {/* Tab 2: Specialized Slice Unfolding Breakdown Visualizer */}
        {activeTab === 'unfolder' && (
          <div className="flex flex-col gap-5">
            <SliceUnfolderVisualizer
              currentTheme={currentTheme}
              slicesPerQuadrant={sliceCountPerQuadrant}
              onSlicesPerQuadrantChange={setSliceCountPerQuadrant}
              activeFunction={activeFunction}
              onSelectFunction={setActiveFunction}
            />

            <TeacherVoiceover
              currentTheme={currentTheme}
              theta={theta}
              activeFunction={activeFunction}
            />
          </div>
        )}

        {/* Tab 3: Teacher Lesson Notes */}
        {activeTab === 'lesson' && (
          <div className="flex flex-col gap-5">
            <TeacherVoiceover
              currentTheme={currentTheme}
              theta={theta}
              activeFunction={activeFunction}
            />
            <ControlsPanel
              currentTheme={currentTheme}
              sliceCountPerQuadrant={sliceCountPerQuadrant}
              onSliceCountChange={setSliceCountPerQuadrant}
              showRightTriangle={showRightTriangle}
              onToggleRightTriangle={() => setShowRightTriangle(!showRightTriangle)}
              showCosineBase={showCosineBase}
              onToggleCosineBase={() => setShowCosineBase(!showCosineBase)}
              showProjectionRay={showProjectionRay}
              onToggleProjectionRay={() => setShowProjectionRay(!showProjectionRay)}
              showDiscreteSlices={showDiscreteSlices}
              onToggleDiscreteSlices={() => setShowDiscreteSlices(!showDiscreteSlices)}
              showSmoothCurve={showSmoothCurve}
              onToggleSmoothCurve={() => setShowSmoothCurve(!showSmoothCurve)}
              showCoordinatesHUD={showCoordinatesHUD}
              onToggleCoordinatesHUD={() => setShowCoordinatesHUD(!showCoordinatesHUD)}
              showAngleArc={showAngleArc}
              onToggleAngleArc={() => setShowAngleArc(!showAngleArc)}
              activeFunction={activeFunction}
              onSelectFunction={setActiveFunction}
            />
          </div>
        )}

        {/* Tab 4: Student Challenge Quiz */}
        {activeTab === 'quiz' && (
          <div className="flex flex-col gap-5">
            <StudentQuiz
              currentTheme={currentTheme}
              onJumpToAngle={(targetRad) => {
                setTheta(targetRad);
                setActiveTab('visualizer');
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={`w-full border-t ${currentTheme.borderClass} py-4 mt-8 text-center text-xs text-slate-500`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TrigVerse Mathematics Simulation · Sine & Cosine Curve Animation</span>
          <span>Interactive Unit Circle Dissection (Vertical & Horizontal Parts)</span>
        </div>
      </footer>
    </div>
  );
}
