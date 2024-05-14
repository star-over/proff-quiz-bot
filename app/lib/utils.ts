import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TAnswers } from "../quizzes/quiz";

export const proxies = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
  "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z"];

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
};

export function extractText(html: string) {
  return html.replace(/<[^>]+>/g, '');
};

export function getRandom(items) {
  // "|" for a kinda "int div"
  return items[items.length * Math.random() | 0];
}

// https://stackoverflow.com/a/1199420/87713
function truncate(str: string, n: number, useWordBoundary: boolean) {
  if (str.length <= n) { return str; }
  const subString = str.slice(0, n - 2); // the original check
  return (useWordBoundary
    ? subString.slice(0, subString.lastIndexOf(" "))
    : subString) + "...";
};

export function makeExplanation(answers: TAnswers, correct_option_id: number, reference: string) {
  const explanation = [
    `<b>Номер правильного ответа:</b> ${correct_option_id + 1}`,
    `<b>Верный ответ:</b> ${answers[correct_option_id].answer}`,
    `<b>Источник:</b> ${reference}`
  ].join("\n");
  return truncate(explanation, 200, true)
}
