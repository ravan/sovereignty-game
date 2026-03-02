import { useState, useCallback, useRef } from 'react';
import { GameState, GamePhase, GameAnswer, Question } from '../types';
import { GAME_CONFIG, pickQuestions } from '../data/questions';

const INITIAL_STATE: GameState = {
  phase: 'intro',
  playerName: '',
  currentQuestion: 0,
  score: 0,
  streak: 0,
  maxStreak: 0,
  answers: [],
  questionStartTime: 0,
  lastPoints: null,
};

export function useGame() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [questions, setQuestions] = useState<Question[]>([]);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCountdown = () => {
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const startGame = useCallback((playerName: string) => {
    const picked = pickQuestions(GAME_CONFIG.totalQuestions);
    setQuestions(picked);
    setState({
      ...INITIAL_STATE,
      phase: 'countdown',
      playerName: playerName.trim() || 'Anonymous',
    });
  }, []);

  const beginQuestion = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: 'question',
      questionStartTime: Date.now(),
      lastPoints: null,
    }));
  }, []);

  const submitAnswer = useCallback(
    (chosen: number) => {
      setState((prev) => {
        if (prev.phase !== 'question') return prev;

        const question = questions[prev.currentQuestion];
        if (!question) return prev;

        const timeMs = Date.now() - prev.questionStartTime;
        const timeSec = Math.min(timeMs / 1000, GAME_CONFIG.timePerQuestion);
        const isCorrect = chosen === question.correct;

        // Score = base × speed factor (1.0 → instant, 0.5 → last second)
        const speedFactor = isCorrect
          ? 0.5 + 0.5 * Math.max(0, (GAME_CONFIG.timePerQuestion - timeSec) / GAME_CONFIG.timePerQuestion)
          : 0;
        const points = isCorrect ? Math.round(GAME_CONFIG.basePoints * speedFactor) : 0;

        const newStreak = isCorrect ? prev.streak + 1 : 0;
        const answer: GameAnswer = {
          questionIndex: prev.currentQuestion,
          chosen,
          correct: isCorrect,
          timeMs,
          points,
        };

        return {
          ...prev,
          phase: 'reveal',
          score: prev.score + points,
          streak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
          answers: [...prev.answers, answer],
          lastPoints: points,
        };
      });
    },
    [questions]
  );

  const timeOut = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'question') return prev;

      const answer: GameAnswer = {
        questionIndex: prev.currentQuestion,
        chosen: -1,
        correct: false,
        timeMs: GAME_CONFIG.timePerQuestion * 1000,
        points: 0,
      };

      return {
        ...prev,
        phase: 'reveal',
        streak: 0,
        answers: [...prev.answers, answer],
        lastPoints: 0,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const next = prev.currentQuestion + 1;
      if (next >= questions.length) {
        return { ...prev, phase: 'final' };
      }
      return {
        ...prev,
        phase: 'question',
        currentQuestion: next,
        questionStartTime: Date.now(),
        lastPoints: null,
      };
    });
  }, [questions.length]);

  const showLeaderboard = useCallback(() => {
    setState((prev) => ({ ...prev, phase: 'leaderboard' }));
  }, []);

  const resetGame = useCallback(() => {
    clearCountdown();
    setState(INITIAL_STATE);
    setQuestions([]);
  }, []);

  const setPhase = useCallback((phase: GamePhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const correctCount = state.answers.filter((a) => a.correct).length;

  return {
    state,
    questions,
    correctCount,
    currentQ: questions[state.currentQuestion] ?? null,
    startGame,
    beginQuestion,
    submitAnswer,
    timeOut,
    nextQuestion,
    showLeaderboard,
    resetGame,
    setPhase,
  };
}
