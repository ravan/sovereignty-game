import { ALL_QUESTIONS, GAME_CONFIG } from './questions';
import { GameAnswer } from '../types';

export interface DemoStep {
  questionIndex: number;   // index into ALL_QUESTIONS
  chosenAnswer: number;    // original option index the "player" picks
  delayBeforeAnswer: number; // ms to wait before auto-answering
}

// Pick 5 diverse questions: mix categories, correct/wrong, visual variety
export const DEMO_SCRIPT: DemoStep[] = [
  // Q1: Linux Independence (easy) — CORRECT (answer quickly for high points)
  { questionIndex: 0, chosenAnswer: 0, delayBeforeAnswer: 4000 },
  // Q2: Cloud Strategy — WRONG (picks option 0 but correct is 3)
  { questionIndex: 5, chosenAnswer: 0, delayBeforeAnswer: 6000 },
  // Q3: Supply Chain Security — CORRECT
  { questionIndex: 7, chosenAnswer: 1, delayBeforeAnswer: 3500 },
  // Q4: Sovereign AI — WRONG (picks option 0 but correct is 3)
  { questionIndex: 9, chosenAnswer: 0, delayBeforeAnswer: 5500 },
  // Q5: Edge Computing — CORRECT (fast answer)
  { questionIndex: 12, chosenAnswer: 3, delayBeforeAnswer: 3000 },
];

export const DEMO_TOTAL_QUESTIONS = DEMO_SCRIPT.length;

// Pre-build the demo questions array
export const DEMO_QUESTIONS = DEMO_SCRIPT.map((step) => ALL_QUESTIONS[step.questionIndex]);

// Calculate demo answers and final score ahead of time for the final screen
function buildDemoResults() {
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  const answers: GameAnswer[] = [];

  for (let i = 0; i < DEMO_SCRIPT.length; i++) {
    const step = DEMO_SCRIPT[i];
    const question = ALL_QUESTIONS[step.questionIndex];
    const isCorrect = step.chosenAnswer === question.correct;
    const timeMs = step.delayBeforeAnswer;
    const timeLeft = GAME_CONFIG.timePerQuestion * 1000 - timeMs;
    const speedFactor = 0.5 + 0.5 * (timeLeft / (GAME_CONFIG.timePerQuestion * 1000));
    const points = isCorrect ? Math.round(GAME_CONFIG.basePoints * speedFactor) : 0;

    if (isCorrect) {
      streak++;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }

    score += points;
    answers.push({
      questionIndex: i,
      chosen: step.chosenAnswer,
      correct: isCorrect,
      timeMs,
      points,
    });
  }

  return { score, maxStreak, answers, streak };
}

export const DEMO_RESULTS = buildDemoResults();
