// Type definitions for TypeScript
export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  totalQuestions: number;
  passingScore: number;
  created: string;
  author: string;
  questions: Question[];
  settings: QuizSettings;
  scoring: ScoringSystem;
}

export interface Question {
  id: string;
  type:
    | "multiple-choice"
    | "true-false"
    | "multiple-select"
    | "fill-in-the-blank"
    | "ordering";
  question: string;
  options?: Option[];
  correctAnswers?: string[];
  explanation: string;
  points: Points;
  timeLimit: number;
}

export interface Points {
  correct: number;
  incorrect: number;
  skipped: number;
}

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  correctOrder?: number;
}

export interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showExplanations: boolean;
  allowRetake: boolean;
  showScoreImmediately: boolean;
}

export interface ScoringSystem {
  totalPoints: number;
  gradeScale: GradeScale[];
}

export interface GradeScale {
  min: number;
  max: number;
  grade: string;
  description: string;
}
