
export enum GameState {
  Start,
  Playing,
  Finished,
}

export enum Difficulty {
  Easy,
  Medium,
  Hard,
}

export interface Country {
  name: string;
  code: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  difficulty: Difficulty;
  date: string;
}

export interface User {
  email: string;
  // Note: In a real app, never store passwords in plain text.
  // This is a simulation for client-side only.
  password: string;
}
