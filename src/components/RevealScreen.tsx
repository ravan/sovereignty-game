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
    if (countdown <= 0) {
      onNext();
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, onNext]);

  const chosenText = answer.chosen >= 0 ? question.options[answer.chosen] : null;
  const correctText = question.options[question.correct];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-5 3xl:px-12 3xl:py-16 3xl:gap-10 4xl:px-20 4xl:py-20 4xl:gap-14 max-w-3xl 3xl:max-w-6xl 4xl:max-w-[90rem] mx-auto w-full screen-enter">
      {/* Result badge */}
      <div className="text-center">
        {isTimeout ? (
          <div className="flex flex-col items-center gap-2 3xl:gap-5 4xl:gap-7">
            <Clock className="w-16 h-16 3xl:w-28 3xl:h-28 4xl:w-36 4xl:h-36" style={{ color: '#bd3314' }} />
            <h2 className="font-orbitron font-black text-2xl md:text-4xl 3xl:text-7xl 4xl:text-8xl" style={{ color: '#bd3314' }}>Time's Up!</h2>
          </div>
        ) : isCorrect ? (
          <div className="flex flex-col items-center gap-2 3xl:gap-5 4xl:gap-7">
            <CheckCircle2 className="w-16 h-16 3xl:w-28 3xl:h-28 4xl:w-36 4xl:h-36" style={{ color: '#30ba78' }} />
            <h2 className="font-orbitron font-black text-2xl md:text-4xl 3xl:text-7xl 4xl:text-8xl" style={{ color: '#30ba78' }}>You Picked the Right Answer!</h2>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 3xl:gap-5 4xl:gap-7">
            <XCircle className="w-16 h-16 3xl:w-28 3xl:h-28 4xl:w-36 4xl:h-36" style={{ color: '#bd3314' }} />
            <h2 className="font-orbitron font-black text-2xl md:text-4xl 3xl:text-7xl 4xl:text-8xl" style={{ color: '#bd3314' }}>Wrong!</h2>
          </div>
        )}
      </div>

      {/* Points earned */}
      {showPoints && answer.points > 0 && (
        <div className="font-orbitron font-black text-3xl md:text-5xl 3xl:text-8xl 4xl:text-9xl neon-green screen-enter" style={{ color: '#fff' }} >
          +{answer.points.toLocaleString()} pts
        </div>
      )}

      {/* Wrong / Timeout: show picked answer and correct answer only */}
      {!isCorrect && (
        <div className="w-full glass rounded-xl neon-border-cyan p-5 3xl:p-10 4xl:p-14 space-y-4 3xl:space-y-8 4xl:space-y-10">
          {chosenText && (
            <div>
              <p className="font-orbitron text-xs 3xl:text-xl 4xl:text-2xl tracking-widest mb-1 3xl:mb-4" style={{ color: '#bd3314' }}>You Picked:</p>
              <p className="font-orbitron text-sm 3xl:text-2xl 4xl:text-3xl leading-snug" style={{ color: '#d6f0e5' }}>{chosenText}</p>
            </div>
          )}
          <div>
            <p className="font-orbitron text-xs 3xl:text-xl 4xl:text-2xl tracking-widest mb-1 3xl:mb-4" style={{ color: '#30ba78' }}>The Right Answer Is:</p>
            <p className="font-orbitron text-sm 3xl:text-2xl 4xl:text-3xl leading-snug" style={{ color: '#d6f0e5' }}>{correctText}</p>
          </div>
        </div>
      )}

      {/* Score + Next countdown */}
      <div className="flex items-center justify-between w-full">
        <div>
          <span className="font-orbitron text-xs 3xl:text-xl 4xl:text-2xl tracking-widest" style={{ color: '#ffffff' }}>SCORE </span>
          <span className="font-orbitron font-bold text-xl 3xl:text-4xl 4xl:text-5xl neon-green">{score.toLocaleString()}</span>
        </div>
        <button
          onClick={onNext}
          className="font-orbitron text-xs 3xl:text-xl 4xl:text-2xl px-4 py-2 3xl:px-8 3xl:py-4 4xl:px-12 4xl:py-6 rounded-lg transition-all"
          style={{ background: 'rgba(48,186,120,0.1)', border: '1px solid rgba(48,186,120,0.4)', color: '#30ba78' }}
        >
          {questionNumber < totalQuestions ? `Next (${countdown})` : `Finish (${countdown})`}
        </button>
      </div>
    </div>
  );
}
