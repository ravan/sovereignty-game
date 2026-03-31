import { useCallback, useEffect } from 'react';
import { IntroScreen } from './components/IntroScreen';
import { CountdownScreen } from './components/CountdownScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { RevealScreen } from './components/RevealScreen';
import { FinalScreen } from './components/FinalScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { DisplayMode } from './components/DisplayMode';
import { ConferenceDisplay } from './components/ConferenceDisplay';
import { useGame } from './hooks/useGame';
import { useMarketo } from './hooks/useMarketo';

function getGameUrl(): string {
  const base = window.location.origin + window.location.pathname;
  return base.replace(/\?.*$/, '').replace(/\/dashboard\/?$/, '').replace(/\/$/, '');
}

function isDashboard(): boolean {
  return window.location.pathname.replace(/\/+$/, '').endsWith('/dashboard');
}

function isConferenceMode(): boolean {
  return window.location.pathname.replace(/\/+$/, '').endsWith('/conference');
}

function isDisplayMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has('display') || isDashboard();
}

export default function App() {
  const {
    state,
    questions,
    correctCount,
    currentQ,
    startGame,
    beginQuestion,
    submitAnswer,
    timeOut,
    nextQuestion,
    showLeaderboard,
    resetGame,
    setPhase,
  } = useGame();

  const { isReady: isMarketoReady, submitForm: submitMarketoForm } = useMarketo();

  // When countdown ends, begin the first question
  const handleCountdownDone = useCallback(() => {
    beginQuestion();
  }, [beginQuestion]);

  const handleQuit = useCallback(() => {
    setPhase('final');
  }, [setPhase]);

  // When question reveal auto-advances
  const handleNext = useCallback(() => {
    nextQuestion();
  }, [nextQuestion]);

  // Keyboard shortcut: press 1-4 or A-D to answer
  useEffect(() => {
    if (state.phase !== 'question') return;
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, number> = {
        '1': 0, 'a': 0, 'A': 0,
        '2': 1, 'b': 1, 'B': 1,
        '3': 2, 'c': 2, 'C': 2,
        '4': 3, 'd': 3, 'D': 3,
      };
      if (e.key in map) submitAnswer(map[e.key]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.phase, submitAnswer]);

  if (isConferenceMode()) {
    return (
      <div className="relative bg-grid scanline" style={{ minHeight: '100vh' }}>
        <ConferenceDisplay gameUrl={getGameUrl()} />
      </div>
    );
  }

  if (isDisplayMode()) {
    return (
      <div className="relative bg-grid scanline" style={{ minHeight: '100vh' }}>
        <DisplayMode gameUrl={getGameUrl()} />
      </div>
    );
  }

  return (
    <div className="relative bg-grid scanline" style={{ minHeight: '100vh', overflow: 'hidden' }}>


      {state.phase === 'intro' && (
        <IntroScreen onStart={startGame} />
      )}

      {state.phase === 'countdown' && (
        <CountdownScreen onDone={handleCountdownDone} />
      )}

      {state.phase === 'question' && currentQ && (
        <QuestionScreen
          key={state.currentQuestion}
          question={currentQ}
          questionNumber={state.currentQuestion + 1}
          totalQuestions={questions.length}
          score={state.score}
          streak={state.streak}
          onAnswer={submitAnswer}
          onTimeout={timeOut}
          onQuit={handleQuit}
        />
      )}

      {state.phase === 'reveal' && currentQ && state.answers.length > 0 && (
        <RevealScreen
          key={`reveal-${state.currentQuestion}`}
          question={currentQ}
          answer={state.answers[state.answers.length - 1]}
          questionNumber={state.currentQuestion + 1}
          totalQuestions={questions.length}
          score={state.score}
          onNext={handleNext}
        />
      )}

      {state.phase === 'final' && (
        <FinalScreen
          state={state}
          questions={questions}
          correctCount={correctCount}
          onLeaderboard={showLeaderboard}
          onPlayAgain={resetGame}
          isMarketoReady={isMarketoReady}
          submitMarketoForm={submitMarketoForm}
        />
      )}

      {state.phase === 'leaderboard' && (
        <LeaderboardScreen
          playerScore={state.score}
          playerName={state.playerName}
          onPlayAgain={resetGame}
        />
      )}
    </div>
  );
}
