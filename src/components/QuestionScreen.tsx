import { useEffect, useState, useRef, useMemo } from 'react';
import { Question } from '../types';
import { GAME_CONFIG } from '../data/questions';
import { TimerRing } from './TimerRing';
import { Flame, Italic } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  streak: number;
  onAnswer: (index: number) => void;
  onTimeout: () => void;
  onQuit: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const CARD_STYLE = { bg: 'rgba(12,50,44,0.7)', border: 'rgba(48,186,120,0.3)' };
const LABEL_COLORS = ['#30ba78', '#30ba78', '#30ba78', '#30ba78'];

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  score,
  streak,
  onAnswer,
  onTimeout,
  onQuit,
}: QuestionScreenProps) {
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.timePerQuestion);
  const [selected, setSelected] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const shuffledOptions = useMemo(() => {
    const indices = [0, 1, 2, 3];
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.map((originalIdx) => ({
      text: question.options[originalIdx],
      originalIdx,
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

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
    onAnswer(shuffledOptions[idx].originalIdx);
  };

  const progress = questionNumber / totalQuestions;

  return (
    <div className="relative z-10 flex flex-col min-h-screen px-4 py-4 gap-3 sm:gap-5 max-w-4xl mx-auto w-full">
      {/* Header bar: question counter + score */}
      <div className="flex items-center justify-between glass rounded-xl px-4 py-2 neon-border-cyan">
        <div className="flex flex-col gap-0.5">
          <span className="font-suse text-xs tracking-widest" style={{ color: '#ffffff' }}>QUESTION</span>
          <span className="font-suse font-bold text-lg neon-green">{questionNumber} / {totalQuestions}</span>
        </div>
        <TimerRing seconds={timeLeft} total={GAME_CONFIG.timePerQuestion} size={64} />
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-suse text-xs tracking-widest" style={{ color: '#ffffff' }}>SCORE</span>
          <span className="font-suse font-bold text-lg neon-green">{score.toLocaleString()}</span>
          {streak >= 2 && (
            <div className="streak-badge flex items-center gap-1 text-xs font-suse" style={{ color: '#bd3314' }}>
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

      {/* Question text — fixed 3-line height, lighter weight for hierarchy */}
      <div className="quiz-question  rounded-xl px-5 py-3  text-center flex-shrink-0 flex items-center justify-center"
        style={{ minHeight: 'calc(3 * 1.5em + 1.5rem)', fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',  }}
      >
        <p
          className="font-suse leading-relaxed"
          style={{ color: '#fff',  fontWeight: 400,  }}
        >
          {question.question}
        </p>
      </div>

      {/* Answer grid — WWTBAM hexagonal style: 1 col mobile, 2 col sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-6 sm:gap-y-4 max-w-5xl mx-auto w-full">
        {shuffledOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={selected !== null}
            className="answer-btn hex-btn px-6 py-2.5 text-left flex items-center gap-3 transition-all"
            style={{
              background: CARD_STYLE.bg,
              minHeight: 'calc(3 * 1.375em + 1.25rem)',
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
            }}
          >
            <span
              className="font-suse font-black shrink-0 rounded-md flex items-center justify-center"
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
                width: '1.8em',
                height: '1.8em',
                background: LABEL_COLORS[idx],
                color: '#0c322c',
                boxShadow: `0 0 40px ${LABEL_COLORS[idx]}`,
              }}
            >
              {OPTION_LABELS[idx]}
            </span>
            <span
              className="font-suse  leading-snug"
              style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#ffffff' }}
            >
              {opt.text}
            </span>
          </button>
        ))}
      </div>

      {/* Quit button */}
      <div className="flex justify-center mt-auto pb-2">
        <button
          onClick={onQuit}
          className="font-suse text-xs tracking-wider uppercase transition-all opacity-40 hover:opacity-80"
          style={{ color: '#fe7c3f', letterSpacing: '0.15em' }}
        >
          Quit Game
        </button>
      </div>
    </div>
  );
}
