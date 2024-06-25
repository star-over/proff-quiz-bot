import { Context } from "grammy";
import { getRandom, objParse, truncate } from "./lib/utils.js";
import { postMessagePoll } from "./post-message-poll.js";
import { postMessageProxy } from "./post-message-proxy.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";
import { TVariants, TQuiz, TQuizBundle } from "./quizzes/quiz.js";
// import { postMessageInline } from "./post-message-inline.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { negativePhrases, numberProxies, positivePhrases } from "./lib/strings.js";
import { assert } from "console";
import { postMultiVariants } from "./post-multi-variants.js";
import { postMessageInline } from "./post-message-inline.js";

export const messageConfig = {
  parse_mode: "HTML",
  disable_notification: true,
} as const;

export function getChunkSize(variantsCount: number, maxProxies: number): number {
  const row = variantsCount > 10 ? 10 : variantsCount;
  const col = maxProxies > 9 ? 9 : maxProxies;
  const mapTable = {
    //  1  2  3  4  5  6  7  8  9
    1: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    2: [2, 2, 2, 2, 2, 2, 2, 2, 2],
    3: [3, 3, 3, 3, 3, 3, 3, 3, 3],
    4: [4, 4, 2, 2, 2, 2, 2, 2, 2],
    5: [5, 5, 3, 3, 3, 3, 3, 3, 3],
    6: [3, 3, 3, 3, 3, 3, 3, 3, 3],
    7: [4, 4, 3, 3, 3, 3, 3, 3, 3],
    8: [4, 4, 3, 3, 3, 3, 2, 2, 2],
    9: [3, 3, 3, 3, 3, 3, 3, 3, 3],
    10: [5, 5, 2, 2, 2, 2, 2, 2, 2],
  };

  return mapTable[row][col - 1];
}

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

export function getCorrectVariantsText(variants: TVariants): string {
  return variants
    .filter(({ isCorrect }) => isCorrect)
    .map(({ variant, proxy }) => `${proxy} ${variant}`)
    .join("\n");
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

export async function postQuiz(ctx: Context, quiz: TQuiz) {

  //delete source message
  await ctx.api.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(() => { });

  if (!isStyleOne(quiz)) {
    return await postMultiVariants(ctx, quiz);
  }

  return await postMessageInline(ctx, quiz);

  // if (quiz.variants.length > 10) {
  //   await postMultiVariants(ctx, quiz);
  // }

  // if (isVariantSizeGt100(quiz)) {
  //   await postMessageInline(ctx, quiz);
  // }
  // if (isQuestionGt250(quiz)) {
  //   await postMessagePoll(ctx, quiz);
  // }
  // await postPoll(ctx, quiz);
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

export function makeIndicator(payload): string {
  const { isCorrect } = objParse(payload)
  if (isCorrect) {
    return "✅✅✅✅✅✅";
  }
  return "❌❌❌❌❌❌";
}

export function makeExplanation3({ userId, firstName, queryData }): string {
  const query = objParse(queryData);
  const quiz = getQuizById(allQuizzes, Number(query.questionId));
  const variant = getVariantById(quiz, 0); //Number(query.variantId)
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
    `${0} ${answerText}`, //${query.correctProxy}
    "",
    `<b>Источник:</b>`,
    quiz.reference,
    "</tg-spoiler>",
  ].join("\n");
};

export function makeExplanation4({ userId, firstName, payload }): string {
  const { questionId, isCorrect, variantsOrder } = objParse(payload);
  const { variants, reference } = getQuizById(allQuizzes, questionId);
  const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
  const answerText = getCorrectVariantsText(variantsWithProxy);
  const mention = `<a href="tg://user?id=${userId}">${firstName}</a>`;

  if (isCorrect) {
    return [
      "✅✅✅✅✅✅",
      mention,
      `${getRandom(positivePhrases)}`,
    ].join("\n");
  };

  return [
    "❌❌❌❌❌❌",
    "<tg-spoiler>",
    mention,
    `${getRandom(negativePhrases)}`,
    "",
    "<b>Ответ был:</b>",
    answerText,
    "",
    `<b>Источник:</b>`,
    reference,
    "</tg-spoiler>",
  ].join("\n");
}

export function commonFilters(quizzes: TQuiz[]): TQuiz[] {
  return quizzes
    // .filter((quiz) => isStyleOne(quiz))
    .filter(({ variants }) => (variants.length >= 2))
  // .filter(({ variants }) => (2 <= variants.length) && (variants.length <= 10))
  // .filter(({ variants }) => (variants.length < 10))
  // .filter(({ variants }) => variants.some(({ variant }) => variant.length > 100))
  // .filter(isVariantSizeGt100)
  // .filter(({ reference }) => reference.length <= 200)
  // .filter(({ topic, question }) => topic.length + question.length < 250)
}
