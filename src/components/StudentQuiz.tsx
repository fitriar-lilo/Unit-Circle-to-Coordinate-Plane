import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import { ThemeConfig } from '../types';

interface StudentQuizProps {
  currentTheme: ThemeConfig;
  onJumpToAngle: (rad: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  targetRad?: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'Why is the vertical coordinate y on the unit circle exactly equal to sin(θ)?',
    options: [
      'Because the circle radius is r = 1, so opposite/hypotenuse = y/1 = y',
      'Because sine is always equal to cosine on any circle',
      'Because the unit circle has a circumference of 1',
      'Because the angle is measured in degrees instead of radians',
    ],
    correctIndex: 0,
    explanation:
      'In a right triangle on the unit circle, hypotenuse = radius = 1. Therefore, sin(θ) = Opposite / Hypotenuse = y / 1 = y!',
  },
  {
    id: 2,
    question: 'In the First Quadrant (0° to 90°), how do the vertical sine slices behave when arranged in order?',
    options: [
      'They decrease from 1 down to -1',
      'They grow from the smallest part (0) to the highest part (+1)',
      'They remain constant at 0.5',
      'They drop below the horizontal axis',
    ],
    correctIndex: 1,
    explanation:
      'As θ increases from 0 to π/2, the vertical opposite leg climbs steadily from height 0 up to its peak height of 1 at 90°!',
  },
  {
    id: 3,
    question: 'At which angle does the sine curve hit its lowest minimum (trough) of -1?',
    options: ['90° (π/2)', '180° (π)', '270° (3π/2)', '360° (2π)'],
    correctIndex: 2,
    targetRad: (3 * Math.PI) / 2,
    explanation:
      'At 270° (3π/2), the radius points straight down along the negative y-axis at (0, -1), giving sin(270°) = -1.0!',
  },
  {
    id: 4,
    question: 'What happens when we divide the quadrants into more and more vertical or horizontal parts?',
    options: [
      'The wave becomes a jagged triangle',
      'The discrete bars approximate the smooth continuous trigonometric curve with perfect accuracy',
      'The circle shrinks in size',
      'The wavelength doubles in frequency',
    ],
    correctIndex: 1,
    explanation:
      'This is the heart of calculus! As the slices become infinitely thin (Δθ → 0), the discrete parts blend seamlessly into the continuous sinusoidal curve.',
  },
  {
    id: 5,
    question: 'For the Cosine curve, how is the unit circle divided and how do parts behave in Quadrant I (0° to 90°)?',
    options: [
      'Divided vertically, parts grow from 0 to 1',
      'Divided horizontally, parts contract in order from the highest part (+1) down to smallest (0)',
      'Divided diagonally, parts stay at 1/2',
      'Divided horizontally, parts start at -1 and go to +1',
    ],
    correctIndex: 1,
    targetRad: 0,
    explanation:
      'In the unit circle, cos(θ) is the horizontal segment x = adjacent/1. At θ = 0°, it has maximum length 1. As θ approaches 90°, the horizontal slice shrinks down to 0!',
  },
  {
    id: 6,
    question: 'What is the relationship between the Sine curve and the Cosine curve on the coordinate plane?',
    options: [
      'They are completely unrelated and have different wavelengths',
      'The Cosine curve is simply the Sine curve shifted by 90° (π/2 radians): cos(θ) = sin(θ + 90°)',
      'Cosine is always negative while Sine is always positive',
      'Cosine has twice the frequency of Sine',
    ],
    correctIndex: 1,
    explanation:
      'Because cos(θ) = sin(θ + π/2), the cosine wave has the exact same sinusoidal shape, leading the sine wave by a 90° phase shift!',
  },
];

export const StudentQuiz: React.FC<StudentQuizProps> = ({ currentTheme, onJumpToAngle }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, optIdx]) => {
    const q = QUESTIONS.find((item) => item.id === Number(qId));
    return q && q.correctIndex === optIdx ? acc + 1 : acc;
  }, 0);

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div
      className={`w-full p-6 rounded-2xl border ${currentTheme.borderClass} ${currentTheme.panelBg} backdrop-blur-md shadow-xl flex flex-col gap-6 transition-colors`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 font-serif-math">
              Student Concept Challenge
            </h2>
            <p className="text-xs text-slate-400">
              Test your understanding of the unit circle slices and the sine wave!
            </p>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>Score: {score} / {QUESTIONS.length}</span>
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
              title="Try Again"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-5">
        {QUESTIONS.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = submitted && userChoice === q.correctIndex;
          const isWrong = submitted && isAnswered && userChoice !== q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-4 rounded-xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-rose-500/50 bg-rose-950/20'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-medium text-slate-200">
                  <span className="text-amber-400 font-mono-math font-bold mr-2">Q{idx + 1}.</span>
                  {q.question}
                </h3>
                {submitted && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isThisSelected = userChoice === oIdx;
                  let optStyle = 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-300';

                  if (isThisSelected && !submitted) {
                    optStyle = 'border-amber-400 bg-amber-500/20 text-amber-200 font-medium';
                  } else if (submitted) {
                    if (oIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-semibold';
                    } else if (isThisSelected && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-500/20 text-rose-200 line-through';
                    } else {
                      optStyle = 'opacity-50 border-white/5 text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(q.id, oIdx)}
                      disabled={submitted}
                      className={`text-left p-3 rounded-lg border text-xs transition-colors flex items-center gap-2 ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-mono-math shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {submitted && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 flex flex-col gap-1">
                  <p>
                    <strong className="text-amber-400">Teacher's Note: </strong>
                    {q.explanation}
                  </p>
                  {q.targetRad !== undefined && (
                    <button
                      onClick={() => onJumpToAngle(q.targetRad!)}
                      className="self-start text-[11px] text-sky-400 hover:underline mt-1"
                    >
                      → See this point on the interactive canvas
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(selectedAnswers).length === 0}
          className="self-center px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg transition-transform active:scale-95"
        >
          Check My Answers
        </button>
      ) : (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 text-xs font-medium transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};
