export interface Question {
  id: number;
  category: string;
  categoryIcon: string;
  scenario?: string;   // 1–2 sentence context shown above the question
  question: string;
  options: string[];
  correct: number; // index 0–3
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type GamePhase =
  | 'intro'
  | 'countdown'
  | 'question'
  | 'reveal'
  | 'final'
  | 'leaderboard';

export interface GameAnswer {
  questionIndex: number;
  chosen: number;
  correct: boolean;
  timeMs: number;
  points: number;
}

export interface GameState {
  phase: GamePhase;
  playerName: string;
  currentQuestion: number;
  score: number;
  streak: number;
  maxStreak: number;
  answers: GameAnswer[];
  questionStartTime: number;
  lastPoints: number | null;
}

export interface LeaderboardEntry {
  id?: string;
  player_name: string;
  score: number;
  correct_answers: number;
  max_streak: number;
  played_at?: string;
  session_date?: string;
}

export interface GameConfig {
  totalQuestions: number;
  timePerQuestion: number; // seconds
  basePoints: number;
  maxSpeedBonus: number;
}
