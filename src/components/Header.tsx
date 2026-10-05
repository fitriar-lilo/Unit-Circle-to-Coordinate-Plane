import React from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle, GraduationCap, Layers } from 'lucide-react';
import { ThemeId, ThemeConfig, TrigFunction } from '../types';
import { THEMES } from '../utils/mathConstants';

interface HeaderProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (id: ThemeId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: 'visualizer' | 'unfolder' | 'lesson' | 'quiz';
  onSelectTab: (tab: 'visualizer' | 'unfolder' | 'lesson' | 'quiz') => void;
  activeFunction: TrigFunction;
  onSelectFunction: (fn: TrigFunction) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  activeTab,
  onSelectTab,
  activeFunction,
  onSelectFunction,
}) => {
  return (
    <header className={`w-full border-b ${currentTheme.borderClass} ${currentTheme.panelBg} backdrop-blur-md sticky top-0 z-30 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('visualizer');
            }}
            className="text-xl font-bold tracking-tight font-serif-math flex items-center gap-2 text-inherit hover:opacity-90 transition-opacity"
          >
            <span>TrigVerse</span>
            <span className="text-xs px-2 py-0.5 rounded border border-amber-500/40 text-amber-400 bg-amber-500/10 font-sans font-medium hidden sm:inline-block">
              Trig Curves Studio
            </span>
          </a>
        </div>

        {/* Zone 2: Clean 4 nav controls */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('visualizer')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'visualizer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Circle & Wave</span>
          </button>

          <button
            onClick={() => onSelectTab('unfolder')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'unfolder'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Slice Unfolder</span>
          </button>

          <button
            onClick={() => onSelectTab('lesson')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap hidden md:flex items-center gap-1.5 ${
              activeTab === 'lesson'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Teacher Notes</span>
          </button>

          <button
            onClick={() => onSelectTab('quiz')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap hidden sm:flex items-center gap-1.5 ${
              activeTab === 'quiz'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Student Check</span>
          </button>
        </nav>

        {/* Zone 3: Function Selector & Theme / Sound */}
        <div className="flex items-center gap-2">
          {/* Sine / Cosine Toggle */}
          <div className="flex items-center bg-white/10 p-0.5 rounded-lg border border-white/15 text-xs">
            <button
              onClick={() => onSelectFunction('sine')}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeFunction === 'sine'
                  ? 'bg-rose-500 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Sine curve (vertical parts)"
            >
              sin(θ)
            </button>
            <button
              onClick={() => onSelectFunction('cosine')}
              className={`px-2 py-1 rounded-md transition-colors ${
                activeFunction === 'cosine'
                  ? 'bg-sky-500 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Cosine curve (horizontal parts)"
            >
              cos(θ)
            </button>
            <button
              onClick={() => onSelectFunction('both')}
              className={`px-2 py-1 rounded-md transition-colors hidden sm:block ${
                activeFunction === 'both'
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Compare Sine and Cosine together"
            >
              Both
            </button>
          </div>

          {/* Theme switcher */}
          <div className="relative group">
            <select
              value={currentTheme.id}
              onChange={(e) => onSelectTheme(e.target.value as ThemeId)}
              className="text-xs bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg px-2.5 py-1.5 cursor-pointer appearance-none pr-7 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
              aria-label="Select student visual theme"
            >
              {(Object.keys(THEMES) as ThemeId[]).map((tId) => (
                <option key={tId} value={tId} className="bg-slate-900 text-slate-100">
                  {THEMES[tId].emoji} {THEMES[tId].name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs opacity-60">
              ▼
            </div>
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute audio tones' : 'Enable audio feedback'}
            className="p-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
