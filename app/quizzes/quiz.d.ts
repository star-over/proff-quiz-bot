import { ParseMode } from "grammy/types";

export type TQuizBundle = TQuiz[];

export type TQuiz = {
  id: number;
  isActive: boolean;
  topic: string;
  question: string;
  answers: TAnswers;
  reference?: string | null;
}

export type TAnswers = TAnswer[];
export type TAnswer = {
  answer: string;
  isCorrect: boolean;
  proxy?: string;
}
