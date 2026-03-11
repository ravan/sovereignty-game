import { useEffect, useState } from 'react';
import { GameAnswer } from '../types';
import { Question } from '../types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface RevealScreenProps {
  question: Question;
  answer: GameAnswer;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onNext: () => void;
}

export function RevealScreen({ question, answer, questionNumber, totalQuestions, score, onNext }: RevealScreenProps) {
  const [showPoints, setShowPoints] = useState(false);

  const isCorrect = answer.correct;
  const isTimeout = answer.chosen === -1;
  const countdownStart = isCorrect ? 3 : 6;
  const [countdown, setCountdown] = useState(countdownStart);

  useEffect(() => {
    const t1 = setTimeout(() => setShowPoints(true), 200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(id); onNext(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [onNext]);

  const chosenText = answer.chosen >= 0 ? question.options[answer.chosen] : null;
  const correctText = question.options[question.correct];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-5 max-w-3xl mx-auto w-full screen-enter">
      {/* Result badge */}
      <div className="text-center">
        {isTimeout ? (
          <div className="flex flex-col items-center gap-2">
            <Clock className="w-16 h-16" style={{ color: '#bd3314' }} />
            <h2 className="font-orbitron font-black text-2xl md:text-4xl" style={{ color: '#bd3314' }}>Time's Up!</h2>
          </div>
        ) : isCorrect ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-16 h-16" style={{ color: '#30ba78' }} />
            <h2 className="font-orbitron font-black text-2xl md:text-4xl" style={{ color: '#30ba78' }}>You Picked the Right Answer!</h2>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="w-16 h-16" style={{ color: '#bd3314' }} />
            <h2 className="font-orbitron font-black text-2xl md:text-4xl" style={{ color: '#bd3314' }}>Wrong!</h2>
          </div>
        )}
      </div>

      {/* Points earned */}
      {showPoints && answer.points > 0 && (
        <div className="font-orbitron font-black text-3xl md:text-5xl neon-green screen-enter" style={{ color: '#fff' }} >
          +{answer.points.toLocaleString()} pts
        </div>
      )}

      {/* Wrong / Timeout: show picked answer and correct answer only */}
      {!isCorrect && (
        <div className="w-full glass rounded-xl neon-border-cyan p-5 space-y-4">
          {chosenText && (
            <div>
              <p className="font-orbitron text-xs tracking-widest mb-1" style={{ color: '#bd3314' }}>You Picked:</p>
              <p className="font-orbitron text-sm leading-snug" style={{ color: '#d6f0e5' }}>{chosenText}</p>
            </div>
          )}
          <div>
            <p className="font-orbitron text-xs tracking-widest mb-1" style={{ color: '#30ba78' }}>The Right Answer Is:</p>
            <p className="font-orbitron text-sm leading-snug" style={{ color: '#d6f0e5' }}>{correctText}</p>
          </div>
        </div>
      )}

      {/* Score + Next countdown */}
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="font-orbitron text-xs tracking-widest" style={{ color: '#ffffff' }}>SCORE </span>
          <span className="font-orbitron font-bold text-xl neon-green">{score.toLocaleString()}</span>
        </div>
        <button
          onClick={onNext}
          className="font-orbitron text-xs px-4 py-2 rounded-lg transition-all"
          style={{ background: 'rgba(48,186,120,0.1)', border: '1px solid rgba(48,186,120,0.4)', color: '#30ba78' }}
        >
          {questionNumber < totalQuestions ? `Next (${countdown})` : `Finish (${countdown})`}
        </button>
      </div>
    </div>
  );
}
