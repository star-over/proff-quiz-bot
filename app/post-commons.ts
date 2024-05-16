import { truncate } from "./lib/utils.js";
import { TAnswers } from "./quizzes/quiz.js";


export const proxies = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
  "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z"];

export const messageConfig = {
  parse_mode: "HTML",
  disable_notification: true
} as const;

function getAnswerIndex(answers: TAnswers) {
  return answers.findIndex(({ isCorrect }) => isCorrect);
};

function getAnswerText(answers: TAnswers) {
  const answerId = getAnswerIndex(answers);
  const answer = answers.at(answerId);

  return answer?.proxy
    ? `${answer.proxy}. ${answer.answer}`
    : answer.answer;
};

export function getAnswersWithProxies(answers: TAnswers) {
  return answers.map((answer, i) => ({ ...answer, proxy: proxies[i] }));
};


export function makePollConfig(answers: TAnswers, reference: string) {
  return {
    type: "quiz",
    explanation_parse_mode: "HTML",
    disable_notification: true,
    correct_option_id: getAnswerIndex(answers),
    explanation: makeExplanation(answers, reference),
  } as const;
};

export function getAnswers(answers: TAnswers) {
  return answers.map(({ answer }) => answer ?? "");
};

export function makeExplanation(answers: TAnswers, reference: string) {
  // todo: maximaze info in explanation. Optimasing truncate algorithm.
  // const explanationSizeLimit = 200;

  const answerText = truncate(getAnswerText(answers), 100, false);
  const explanation = [
    // `<b>Номер:</b> ${correct_option_id + 1}`,
    // `<b>Ответ:</b> ${anserText}`,
    `<b>${answerText}</b>`,
    "",
    `${reference}`,
    // `<b>Источник:</b> ${reference}`,
  ].join("\n");
  return truncate(explanation, 200, true);
};
