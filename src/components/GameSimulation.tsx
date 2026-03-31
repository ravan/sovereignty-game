import { useEffect, useState, useCallback, useMemo, useRef, ReactNode } from 'react';
import { DashboardLeftPanel } from './DashboardLeftPanel';
import { QuestionScreen } from './QuestionScreen';
import { RevealScreen } from './RevealScreen';
import { DEMO_SCRIPT, DEMO_QUESTIONS, DEMO_TOTAL_QUESTIONS, DEMO_RESULTS } from '../data/demoScript';
import { GameAnswer } from '../types';
import { GAME_CONFIG } from '../data/questions';
import { Target, Zap, Flame } from 'lucide-react';

type SimPhase = 'countdown' | 'question' | 'reveal' | 'final';

interface GameSimulationProps {
  gameUrl: string;
  onComplete: () => void;
  slideIndicator?: ReactNode;
}

// Rank calculation (mirrors FinalScreen logic)
const RANKS = [
  { min: 9500, color: '#30ba78', label: 'SUSE Certified Sovereign' },
  { min: 8000, color: '#ffffff', label: 'Digital Freedom Master' },
  { min: 6500, color: '#5fd4a0', label: 'Open Source Guardian' },
  { min: 4500, color: '#bd3314', label: 'Sovereignty Advocate' },
  { min: 2500, color: '#ffffff', label: 'Data Defender' },
  { min: 0, color: '#8fba9e', label: 'Sovereignty Rookie' },
];

function getRank(score: number) {
  return RANKS.find((r) => score >= r.min) ?? RANKS[RANKS.length - 1];
}

function ScoreTicker({ target }: { target: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayed(current);
      if (current >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target]);
  return <>{displayed.toLocaleString()}</>;
}

export function GameSimulation({ gameUrl, onComplete, slideIndicator }: GameSimulationProps) {
  const [phase, setPhase] = useState<SimPhase>('countdown');
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answers, setAnswers] = useState<GameAnswer[]>([]);
  const [countdownNum, setCountdownNum] = useState(3);
  const answerTriggeredRef = useRef(false);

  const currentStep = DEMO_SCRIPT[stepIndex];
  const currentQuestion = DEMO_QUESTIONS[stepIndex];

  // Countdown phase: 3-2-1-Go then start questions
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdownNum <= 0) {
      const id = setTimeout(() => setPhase('question'), 600);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setCountdownNum((n) => n - 1), 900);
    return () => clearTimeout(id);
  }, [phase, countdownNum]);

  // Auto-answer during question phase
  useEffect(() => {
    if (phase !== 'question') return;
    answerTriggeredRef.current = false;
    const timer = setTimeout(() => {
      if (!answerTriggeredRef.current) {
        answerTriggeredRef.current = true;
        handleAnswer(currentStep.chosenAnswer);
      }
    }, currentStep.delayBeforeAnswer);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, stepIndex]);

  // Final screen auto-advance
  useEffect(() => {
    if (phase !== 'final') return;
    const id = setTimeout(onComplete, 8000);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  const handleAnswer = useCallback((chosenOriginalIdx: number) => {
    const question = DEMO_QUESTIONS[stepIndex];
    const isCorrect = chosenOriginalIdx === question.correct;
    const timeMs = DEMO_SCRIPT[stepIndex].delayBeforeAnswer;
    const timeLeft = GAME_CONFIG.timePerQuestion * 1000 - timeMs;
    const speedFactor = 0.5 + 0.5 * (timeLeft / (GAME_CONFIG.timePerQuestion * 1000));
    const points = isCorrect ? Math.round(GAME_CONFIG.basePoints * speedFactor) : 0;

    setScore((s) => s + points);
    setStreak((s) => isCorrect ? s + 1 : 0);
    setAnswers((prev) => [
      ...prev,
      { questionIndex: stepIndex, chosen: chosenOriginalIdx, correct: isCorrect, timeMs, points },
    ]);
    setPhase('reveal');
  }, [stepIndex]);

  const handleNext = useCallback(() => {
    if (stepIndex >= DEMO_TOTAL_QUESTIONS - 1) {
      setPhase('final');
    } else {
      setStepIndex((i) => i + 1);
      setPhase('question');
    }
  }, [stepIndex]);

  // no-ops for QuestionScreen props
  const noOp = useCallback(() => {}, []);

  const lastAnswer = answers[answers.length - 1];
  const rank = useMemo(() => getRank(DEMO_RESULTS.score), []);
  const correctCount = DEMO_RESULTS.answers.filter((a) => a.correct).length;
  const avgTime = Math.round(DEMO_RESULTS.answers.reduce((s, a) => s + a.timeMs, 0) / DEMO_RESULTS.answers.length / 100) / 10;

  return (
    <div className="relative z-10 flex h-screen w-screen overflow-hidden">
      {/* Left panel — same as dashboard */}
      <DashboardLeftPanel gameUrl={gameUrl} slideIndicator={slideIndicator} />

      {/* Right panel — game simulation */}
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* DEMO badge — inline so it doesn't overlap the question header */}
        <div className="flex justify-end px-4 pt-2 pb-0 shrink-0">
          <div className="demo-badge rounded-full px-4 py-1 font-orbitron text-xs tracking-widest">
            DEMO
          </div>
        </div>

        {/* Countdown */}
        {phase === 'countdown' && (
          <div className="flex items-center justify-center flex-1 screen-enter">
            <div className="text-center">
              {countdownNum > 0 ? (
                <div
                  key={countdownNum}
                  className="font-orbitron font-black countdown-num"
                  style={{ fontSize: 'clamp(6rem, 20vw, 12rem)', color: '#30ba78' }}
                >
                  {countdownNum}
                </div>
              ) : (
                <div
                  className="font-orbitron font-black countdown-num"
                  style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', color: '#fe7c3f' }}
                >
                  GO!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question phase */}
        {phase === 'question' && currentQuestion && (
          <div className="sim-game-wrapper">
            <QuestionScreen
              key={stepIndex}
              question={currentQuestion}
              questionNumber={stepIndex + 1}
              totalQuestions={DEMO_TOTAL_QUESTIONS}
              score={score}
              streak={streak}
              onAnswer={handleAnswer}
              onTimeout={noOp}
              onQuit={noOp}
            />
          </div>
        )}

        {/* Reveal phase */}
        {phase === 'reveal' && currentQuestion && lastAnswer && (
          <div className="sim-game-wrapper">
            <RevealScreen
              key={`reveal-${stepIndex}`}
              question={currentQuestion}
              answer={lastAnswer}
              questionNumber={stepIndex + 1}
              totalQuestions={DEMO_TOTAL_QUESTIONS}
              score={score}
              onNext={handleNext}
            />
          </div>
        )}

        {/* Final screen (simplified) */}
        {phase === 'final' && (
          <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 gap-5 max-w-2xl mx-auto w-full screen-enter">
            {/* Header */}
            <div className="text-center">
              <p className="font-orbitron text-xs mb-1" style={{ color: '#ffffff' }}>Game Over</p>
              <h1 className="font-orbitron font-black" style={{ fontSize: 'clamp(1.8rem, 6vw, 3.5rem)', color: '#30ba78' }}>
                Mission Complete
              </h1>
            </div>

            {/* Score */}
            <div className="text-center">
              <div
                className="font-orbitron font-black"
                style={{ fontSize: 'clamp(3rem, 12vw, 7rem)', color: rank.color, lineHeight: 1 }}
              >
                <ScoreTicker target={DEMO_RESULTS.score} />
              </div>
              <div className="font-orbitron text-xs mt-1 opacity-50">POINTS</div>
            </div>

            {/* Rank badge */}
            <div
              className="rank-glow rounded-2xl px-6 py-4 text-center"
              style={{ border: `2px solid ${rank.color}`, color: rank.color }}
            >
              <div className="font-orbitron font-bold text-xl md:text-2xl">{rank.label}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="glass rounded-xl p-3 text-center neon-border-cyan">
                <Target className="w-5 h-5 mx-auto mb-1" style={{ color: '#30ba78' }} />
                <div className="font-orbitron font-bold text-lg neon-green">{correctCount}/{DEMO_TOTAL_QUESTIONS}</div>
                <div className="text-xs opacity-50">CORRECT</div>
              </div>
              <div className="glass rounded-xl p-3 text-center neon-border-purple">
                <Zap className="w-5 h-5 mx-auto mb-1" style={{ color: '#ffffff' }} />
                <div className="font-orbitron font-bold text-lg" style={{ color: '#ffffff' }}>{avgTime}s</div>
                <div className="text-xs opacity-50">AVG TIME</div>
              </div>
              <div className="glass rounded-xl p-3 text-center" style={{ border: '1px solid rgba(189,51,20,0.3)' }}>
                <Flame className="w-5 h-5 mx-auto mb-1" style={{ color: '#bd3314' }} />
                <div className="font-orbitron font-bold text-lg" style={{ color: '#bd3314' }}>{DEMO_RESULTS.maxStreak}</div>
                <div className="text-xs opacity-50">BEST STREAK</div>
              </div>
            </div>

            {/* CTA reminder */}
            <div
              className="rounded-xl px-6 py-3 text-center"
              style={{
                background: 'rgba(48,186,120,0.1)',
                border: '1px solid rgba(48,186,120,0.3)',
              }}
            >
              <p className="font-orbitron text-sm" style={{ color: '#30ba78' }}>
                Scan the QR code to play and test your sovereignty knowledge!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
