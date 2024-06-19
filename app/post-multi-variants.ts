import { Context, InlineKeyboard } from "grammy";
import { numberProxies } from "./lib/strings.js";
import { chunk, extractText, getWeightedRandomItem, hasDuplicates, objStringify } from "./lib/utils.js";
import { getVariantsWithProxies, messageConfig } from "./post-commons.js";
import { TQuiz, TVariants } from "./quizzes/quiz.js";
import { assert } from "console";
import _ from "lodash";

// how many variants show to user to choose
const variantRates = [
  // { count: 3, weight: 10 },
  { count: 4, weight: 90 },
];

// how many proxyes in variant [1, 2, 3]
const proxyRates = [
  { count: 1, weight: 3 }, { count: 2, weight: 50 }, { count: 3, weight: 47 },
];

function getCorrectVariantText(variants: TVariants): string {
  return variants
    .filter(({ isCorrect }) => isCorrect)
    .map(({ proxy }) => proxy)
    .join("");
};

function makeFakeVariantText(variants: TVariants) {
  const proxyCount = getWeightedRandomItem(proxyRates).count;
  const proxyVariants = numberProxies
    .slice(0, variants.length);

  return _.shuffle(proxyVariants)
    .slice(0, proxyCount)
    .sort()
    .join("");
};

function makeMaskedVariants(variants: TVariants) {
  const correctVariantText = getCorrectVariantText(variants);
  const variantCount = getWeightedRandomItem(variantRates).count;
  const maskedVariants = [correctVariantText];

  // TODO make guard for infinite loop
  while (maskedVariants.length < variantCount) {
    const fakeVariantText = makeFakeVariantText(variants);
    if (!maskedVariants.includes(fakeVariantText)) {
      maskedVariants.push(fakeVariantText);
    };
  };

  // * Assert
  assert(!hasDuplicates(maskedVariants), "🤡 > post-multi-variants.ts > makeMaskedVariants > Variants not unique", "\n", maskedVariants);
  return maskedVariants;
}

export async function postMultiVariants(ctx: Context, quiz: TQuiz) {
  const { id: questionId, topic, question, variants } = quiz;
  const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
  const variantsOrder: number[] = variantsWithProxy.map(({ id }) => id);
  const maskedVariants = makeMaskedVariants(variantsWithProxy);

  //#region
  const buttonVariants = maskedVariants
    .map((proxy, index) => [
      proxy, objStringify({ questionId, variantsOrder, isCorrect: !Boolean(index) }) // 0 index always is correct
    ]);
  //#endregion
  //#region
  const inlineButtons = _.shuffle(buttonVariants)
    .map(([text, payload]) => InlineKeyboard.text(text, payload));

  // TODO make chunk dynamic, depends on buttons count
  const inlineKeyboard = InlineKeyboard.from(chunk(inlineButtons, 2));
  //#endregion
  //#region questionText
  const questionText = [
    // `<b>Блок:</b> ${block}`,
    `📗 <b>Тема:</b> ${topic}`,
    // `<b>Уровень:</b> ${"⭐️".repeat(level || 1)}`,
    "",
    `<b>Вопрос:</b> ⁉️ <i>[id: ${questionId}]</i>`,
    `${extractText(question)}`,
    "",
    "<b>Варианты ответов:</b>",
    "<i>В вопросе несколько верных вариантов</i> ☑️☑️☑️",
    "",
    variantsWithProxy
      .map(({ variant, proxy }) => `${proxy} ${variant}`)
      .join("\n"),
    "",
    "<b>Выберете единственный ответ:</b>",
  ].join("\n");
  //#endregion

  await ctx.reply(questionText, { ...messageConfig, reply_markup: inlineKeyboard });
}
