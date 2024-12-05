// src/types/quiz.ts

// Base interface for timestamps
export interface Timestamps {
  created_at: string;
  updated_at?: string;
}

// Option interface
export interface Option {
  _id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
}

// Question interface
export interface Question {
  _id: number;
  quiz_id: number;
  question_text: string;
  options: Option[];
}

// Quiz interface
export interface Quiz {
  _id: number;
  title: string;
  description: string;
  questions: Question[];
  created_at: string;
}

// API Response interfaces
export interface QuizListResponse {
  quizzes: Omit<Quiz, "questions">[];
}

export interface QuizDetailResponse {
  quiz: Quiz;
}

// State interfaces for components
export interface QuizState {
  answers: Record<number, number | null>;
  submitted: boolean;
  score: number | null;
}

// Props interfaces for components
export interface QuizCardProps {
  quiz: Omit<Quiz, "questions">;
}

export interface QuestionCardProps {
  question: Question;
  index: number;
  selectedOption: number | null;
  isSubmitted: boolean;
  onOptionSelect: (questionId: number, optionId: number) => void;
}

// Error handling
export interface ApiError {
  message: string;
  status: number;
}

// Quiz Progress
export interface QuizProgress {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
  progressPercentage: number;
}

// Quiz Results
export interface QuizResults {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: Record<
    number,
    {
      questionId: number;
      selectedOption: number;
      isCorrect: boolean;
    }
  >;
}
