import { useEffect, useState, useRef } from 'react';
import { Question } from '../types';
import { GAME_CONFIG } from '../data/questions';
import { TimerRing } from './TimerRing';
import { Flame } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  streak: number;
  onAnswer: (index: number) => void;
  onTimeout: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const CARD_STYLE = { bg: 'rgba(12,50,44,0.7)', border: 'rgba(48,186,120,0.3)' };
const LABEL_COLORS = ['#30ba78', '#5fd4a0', '#bd3314', '#ffffff'];

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  score,
  streak,
  onAnswer,
  onTimeout,
}: QuestionScreenProps) {
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.timePerQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTimeLeft(GAME_CONFIG.timePerQuestion);
    setSelected(null);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.05) {
          clearInterval(intervalRef.current!);
          onTimeout();
          return 0;
        }
        return t - 0.05;
      });
    }, 50);
    return () => clearInterval(intervalRef.current!);
  }, [question.id, onTimeout]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    clearInterval(intervalRef.current!);
    setSelected(idx);
    onAnswer(idx);
  };

  const progress = questionNumber / totalQuestions;

  return (
    <div className="relative z-10 flex flex-col min-h-screen px-4 py-4 gap-3 max-w-4xl mx-auto w-full">
      {/* Header bar: question counter + score */}
      <div className="flex items-center justify-between glass rounded-xl px-4 py-2 neon-border-cyan">
        <div className="flex flex-col gap-0.5">
          <span className="font-orbitron text-xs tracking-widest" style={{ color: '#ffffff' }}>QUESTION</span>
          <span className="font-orbitron font-bold text-lg neon-green">{questionNumber} / {totalQuestions}</span>
        </div>
        <TimerRing seconds={timeLeft} total={GAME_CONFIG.timePerQuestion} size={64} />
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-orbitron text-xs tracking-widest" style={{ color: '#ffffff' }}>SCORE</span>
          <span className="font-orbitron font-bold text-lg neon-green">{score.toLocaleString()}</span>
          {streak >= 2 && (
            <div className="streak-badge flex items-center gap-1 text-xs font-orbitron" style={{ color: '#bd3314' }}>
              <Flame className="w-3 h-3" />
              {streak}x STREAK
            </div>
          )}
        </div>
      </div>

      {/* Full-width progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%`, background: 'linear-gradient(90deg, #30ba78, #5fd4a0)' }}
        />
      </div>

      {/* Category badge */}
      <div>
        <span
          className="inline-block font-orbitron text-xs tracking-widest px-3 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#ffffff',
          }}
        >
          {question.categoryIcon} {question.category.toUpperCase()}
        </span>
      </div>

      {/* Question text */}
      <div className="glass rounded-xl px-5 py-4 neon-border-cyan text-center flex-shrink-0">
        <p
          className="font-orbitron font-semibold leading-snug"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#d6f0e5' }}
        >
          {question.question}
        </p>
      </div>

      {/* Answer grid — 1 col on mobile, 2 col on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={selected !== null}
            className="answer-btn rounded-lg px-3 py-3 text-left flex items-start gap-3 transition-all"
            style={{
              background: CARD_STYLE.bg,
              border: `1px solid ${CARD_STYLE.border}`,
              minHeight: 52,
            }}
          >
            <span
              className="font-orbitron font-black shrink-0 rounded flex items-center justify-center"
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                width: '1.6em',
                height: '1.6em',
                background: LABEL_COLORS[idx],
                color: '#061a16',
                boxShadow: `0 0 8px ${LABEL_COLORS[idx]}`,
              }}
            >
              {OPTION_LABELS[idx]}
            </span>
            <span
              className="font-orbitron font-semibold leading-snug"
              style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#d6f0e5' }}
            >
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
