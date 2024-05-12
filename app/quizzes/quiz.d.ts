import { ParseMode } from "grammy/types";

export type TQuizBundle = TQuiz[];

export type TQuiz = {
  id: number;
  isActive: boolean;
  block?: string | null;
  topic: string;
  level?: string | null;
  reference?: string | null;
  style?: string | null;
  question: string;
  variants: TVariants;
}

export type TVariants = TVariant[];
export type TVariant = {
  variant: string;
  key: boolean;
  proxy?: string;
}
