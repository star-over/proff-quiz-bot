// poll limits:
// question	 1-300 characters
// answer	 1-100 characters, 2-10 answer options
// explanation 0-200 characters
// https://core.telegram.org/bots/api#polloption

import { ParseMode } from "grammy/types";

export type TQuizBundle = TQuiz[];

export type TQuiz = {
  id: number;
  isActive: boolean;
  block?: string | null;
  topic: string;
  level?: number;
  reference?: string | null;
  style?: string | null;
  question: string;
  answers: TAnswers;
}

export type TAnswers = TAnswer[];
export type TAnswer = {
  id: number;
  answer: string;
  isCorrect: boolean;
  proxy?: string;
}
