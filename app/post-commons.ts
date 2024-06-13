import { Context } from "grammy";
import { customKeyboard } from "./keyboard.js";
import { getRandom, objParse, shuffle, truncate } from "./lib/utils.js";
import { postMessagePoll } from "./post-message-poll.js";
import { postMessageProxy } from "./post-message-proxy.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";
import { TVariants, TQuiz, TQuizBundle } from "./quizzes/quiz.js";
import { postMessageInline } from "./post-message-inline.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { negativePhrases, numberProxies, positivePhrases } from "./lib/strings.js";
import { assert } from "console";


export const messageConfig = {
  parse_mode: "HTML",
  disable_notification: true,
} as const;

function getCorrectVariantIndex(variants: TVariants): number {
  return variants.findIndex(({ isCorrect }) => isCorrect);
};

function getCorrectVariantText(variants: TVariants): string {
  const variantId = getCorrectVariantIndex(variants);
  const variant = variants.at(variantId);

  return variant?.proxy
    ? `${variant.proxy}. ${variant.variant}`
    : variant.variant;
};

export function getVariantsWithProxies(variants: TVariants): TVariants {
  // const randomizedProxy = shuffle(proxies);
  const randomizedProxy = numberProxies;
  return variants.map((variant, i) => ({ ...variant, proxy: randomizedProxy[i] }));
};

export function makePollConfig(variants: TVariants, reference: string) {
  return {
    type: "quiz",
    explanation_parse_mode: "HTML",
    disable_notification: true,
    correct_option_id: getCorrectVariantIndex(variants),
    explanation: makeExplanation(variants, reference),
  } as const;
};

export function getVariants(variants: TVariants) {
  return variants.map(({ variant }) => variant ?? "");
};

export function getLevelText(level): string {
  return (level?.length > 0) ? `<b>Уровень:</b> ${level}` : "";
}

export function isStyleOne(quiz: TQuiz): boolean {
  return quiz.variants.filter(({ isCorrect }) => isCorrect).length === 1;
}

export function isVariantSizeGt100(quiz: TQuiz): boolean {
  return quiz.variants.some(({ variant }) => variant.length > 100);
}

export function getMaxVariantSize(quiz: TQuiz): number {
  return quiz.variants
    .map(({ variant }) => variant.length)
    .sort((a, b) => a - b)
    .at(-1);
}

export function isQuestionGt250(quiz: TQuiz): boolean {
  return (quiz.topic.length + quiz.question.length) > 250;
}

export async function postQuiz(ctx: Context, quiz: TQuiz): Promise<void> {
  if (isStyleOne(quiz) === false) {
    await postSpoiler(ctx, quiz);
  } else if (quiz.variants.length > 10) {
    await postSpoiler(ctx, quiz);
  } else if (isVariantSizeGt100(quiz)) {
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

export function getVariantById(quiz: TQuiz, variantId: number) {
  return quiz.variants.find(({ id }) => id === variantId);
};

//todo make it get quiz: TQuiz only
export function makeExplanation(variants: TVariants, reference: string): string {
  // todo: maximaze info in explanation. Optimasing truncate algorithm.
  // const explanationSizeLimit = 200;

  const answerText = truncate(getCorrectVariantText(variants), 100, false);
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

export function makeExplanation2(phrase: string, proxy: string, answers: TVariants, reference: string): string {
  // todo: maximaze info in explanation. Optimasing truncate algorithm.
  // const explanationSizeLimit = 200;

  const answerText = truncate(getCorrectVariantText(answers), 100, false);
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

function isVariantCorrect(queryData): boolean {
  const query = objParse(queryData);
  const quiz = getQuizById(allQuizzes, Number(query.questionId));
  const variant = getVariantById(quiz, Number(query.variantId));
  return variant.isCorrect;
};

export function makeIndicator(queryData): string {
  if (isVariantCorrect(queryData)) {
    return "✅✅✅✅✅✅";
  }
  return "❌❌❌❌❌❌";
}

export function makeExplanation3({ userId, firstName, queryData }): string {
  const query = objParse(queryData);
  const quiz = getQuizById(allQuizzes, Number(query.questionId));
  const variant = getVariantById(quiz, Number(query.variantId));
  const answerText = getCorrectVariantText(quiz.variants);
  const mention = `<a href="tg://user?id=${userId}">${firstName}</a>`;

  if (variant.isCorrect) {
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
    `${query.correctProxy} ${answerText}`,
    "",
    `<b>Источник:</b>`,
    quiz.reference,
    "</tg-spoiler>",
  ].join("\n");
};

export function commonFilters(quizzes: TQuiz[]): TQuiz[] {
  return quizzes
    .filter((quiz) => !isStyleOne(quiz))
    .filter(({ variants }) => (variants.length >= 2))
  // .filter(({ variants }) => (2 <= variants.length) && (variants.length <= 10))
  // .filter(({ variants }) => (variants.length < 10))
  // .filter(({ variants }) => variants.some(({ variant }) => variant.length > 100))
  // .filter(isVariantSizeGt100)
  // .filter(({ reference }) => reference.length <= 200)
  // .filter(({ topic, question }) => topic.length + question.length < 250)
}
