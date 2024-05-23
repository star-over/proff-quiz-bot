import { truncate } from "./lib/utils.js";
import { TAnswers, TQuiz } from "./quizzes/quiz.js";


export const proxies = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
  "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z"];

export const messageConfig = {
  parse_mode: "HTML",
  disable_notification: true
} as const;

function getCorrectAnswerIndex(answers: TAnswers): number {
  return answers.findIndex(({ isCorrect }) => isCorrect);
};

function getCorrectAnswerText(answers: TAnswers): string {
  const answerId = getCorrectAnswerIndex(answers);
  const answer = answers.at(answerId);

  return answer?.proxy
    ? `${answer.proxy}. ${answer.answer}`
    : answer.answer;
};


export function getAnswersWithProxies(answers: TAnswers): TAnswers {
  return answers.map((answer, i) => ({ ...answer, proxy: proxies[i] }));
};


export function makePollConfig(answers: TAnswers, reference: string) {
  return {
    type: "quiz",
    explanation_parse_mode: "HTML",
    disable_notification: true,
    correct_option_id: getCorrectAnswerIndex(answers),
    explanation: makeExplanation(answers, reference),
  } as const;
};

export function getAnswers(answers: TAnswers): string[] {
  return answers.map(({ answer }) => answer ?? "");
};

export function getLevelText(level): string {
  return (level?.length > 0) ? `<b>Уровень:</b> ${level}` : "";
}

export function isStyleOne(quiz: TQuiz): boolean {
  return quiz.answers.filter(({ isCorrect }) => isCorrect).length === 1;
}

export function isAnswerSizeGt100(quiz: TQuiz): boolean {
  return quiz.answers.some(({ answer }) => answer.length > 100);
}

export function getMaxAnswerSize(quiz: TQuiz): number {
  return quiz.answers
    .map(({ answer }) => answer.length)
    .sort((a, b) => a - b)
    .at(-1);
}

export function isPollQuestionGt250(quiz: TQuiz): boolean {
  return (quiz.topic.length + quiz.question.length) > 250;
}



export function makeExplanation(answers: TAnswers, reference: string): string {
  // todo: maximaze info in explanation. Optimasing truncate algorithm.
  // const explanationSizeLimit = 200;

  const answerText = truncate(getCorrectAnswerText(answers), 100, false);
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
