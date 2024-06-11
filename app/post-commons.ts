import { Context } from "grammy";
import { customKeyboard } from "./keyboard.js";
import { getRandom, objParse, shuffle, truncate } from "./lib/utils.js";
import { postMessagePoll } from "./post-message-poll.js";
import { postMessageProxy } from "./post-message-proxy.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";
import { TAnswers, TQuiz, TQuizBundle } from "./quizzes/quiz.js";
import { postMessageInline } from "./post-message-inline.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { negativePhrases, numberProxies, positivePhrases } from "./lib/strings.js";
import { assert } from "console";


export const messageConfig = {
  parse_mode: "HTML",
  disable_notification: true,
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
  // const randomizedProxy = shuffle(proxies);
  const randomizedProxy = numberProxies;
  return answers.map((answer, i) => ({ ...answer, proxy: randomizedProxy[i] }));
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

export function getAnswers(answers: TAnswers) {
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

export function isQuestionGt250(quiz: TQuiz): boolean {
  return (quiz.topic.length + quiz.question.length) > 250;
}

export async function postQuiz(ctx: Context, quiz: TQuiz): Promise<void> {
  if (isStyleOne(quiz) === false) {
    await postSpoiler(ctx, quiz);
  } else if (quiz.answers.length > 10) {
    await postSpoiler(ctx, quiz);
  } else if (isAnswerSizeGt100(quiz)) {
    await postMessageInline(ctx, quiz);
  } else if (isQuestionGt250(quiz)) {
    // await postMessagePoll(ctx, quiz);
    await postMessageInline(ctx, quiz);
  } else {
    // await postPoll(ctx, quiz);
    await postMessageInline(ctx, quiz);
  }
};

export function getQuizById(quizzes: TQuizBundle, questionId: number) {
  return quizzes.find(({ id }) => id === questionId);
};

export function getAnswerById(quiz: TQuiz, answerId: number) {
  return quiz.answers.find(({ id }) => id === answerId);
};

//todo make it get quiz: TQuiz only
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
  return truncate(explanation, 170, true);
};

export function makeExplanation2(phrase: string, proxy: string, answers: TAnswers, reference: string): string {
  // todo: maximaze info in explanation. Optimasing truncate algorithm.
  // const explanationSizeLimit = 200;

  const answerText = truncate(getCorrectAnswerText(answers), 100, false);
  const explanation = [
    phrase,
    "",
    `${proxy} ${answerText}`,
    "",
    reference,
    // `<b>Источник:</b> ${reference}`,
  ].join("\n");
  return truncate(explanation, 200, true);
};

export function makeExplanation3({ userId, firstName, queryData }): string {
  const query = objParse(queryData);
  const quiz = getQuizById(allQuizzes, Number(query.questionId));
  const answer = getAnswerById(quiz, Number(query.answerId));
  const correctAnswerText = getCorrectAnswerText(quiz.answers);
  const mention = `<a href="tg://user?id=${userId}">${firstName}</a>`;

  if (answer.isCorrect) {
    return [
      "✅✅✅✅✅✅",
      "<tg-spoiler>",
      mention,
      `${getRandom(positivePhrases)}`,
      "</tg-spoiler>",
    ].join("\n");
  };

  return [
    "❌❌❌❌❌❌",
    "<tg-spoiler>",
    mention,
    `${getRandom(negativePhrases)}`,
    "",
    "<b>Ответ был:</b>",
    `${query.correctProxy} ${correctAnswerText}`,
    "",
    `<b>Источник:</b>`,
    quiz.reference,
    "</tg-spoiler>",
  ].join("\n");
};

export function commonFilters(quizzes: TQuiz[]): TQuiz[] {
  return quizzes
    .filter(isStyleOne)
    .filter(({ answers }) => (answers.length >= 2))
    .filter(({ answers }) => (2 <= answers.length) && (answers.length <= 10))
  // .filter(({ answers }) => (answers.length < 10))
  // .filter(({ answers }) => answers.some(({ answer }) => answer.length > 100))
  // .filter(isAnswerSizeGt100)
  // .filter(({ reference }) => reference.length <= 200)
  // .filter(({ topic, question }) => topic.length + question.length < 250)
}
