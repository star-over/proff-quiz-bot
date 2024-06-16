import { Context, InlineKeyboard } from "grammy";
import { numberProxies } from "./lib/strings.js";
import { extractText, getWeightedRandomItem, objStringify, shuffle } from "./lib/utils.js";
import { getQuizById, getVariantsWithProxies, messageConfig } from "./post-commons.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { TQuiz, TVariants } from "./quizzes/quiz.js";

// how many variants show to user to choose
const variantRates = [
  { count: 3, weight: 10 }, { count: 4, weight: 90 },
];

// how many proxyes in variant [1, 2, 3]
const proxyRates = [
  { count: 1, weight: 3 }, { count: 2, weight: 50 }, { count: 3, weight: 47 },
];

const quiz = getQuizById(allQuizzes, 1);
const { variants } = quiz;
const variantsWithProxy: TVariants = getVariantsWithProxies(variants);


function getCorrectVariantText(variants: TVariants): string {
  return variants
    .filter(({ isCorrect }) => isCorrect)
    .map(({ proxy }) => proxy)
    .join(" ");
};

function makeFakeVariantText(variants: TVariants) {
  const proxyCount = getWeightedRandomItem(proxyRates).count;
  const proxyVariants = numberProxies
    .slice(0, variants.length);
  return shuffle(proxyVariants)
    .slice(0, proxyCount)
    .sort()
    .join("");
};

function makeMaskedVariants(variants: TVariants) {
  const correctVariantText = getCorrectVariantText(variants);
  const variantCount = getWeightedRandomItem(variantRates).count;
  const maskedVariants = [correctVariantText];

  // todo make guard for infinite loop
  while (maskedVariants.length < variantCount) {
    const fakeVariantText = makeFakeVariantText(variantsWithProxy);
    if (!maskedVariants.includes(fakeVariantText)) {
      maskedVariants.push(fakeVariantText);
    };
  };

  return maskedVariants;
}

export async function postMultiVariants(ctx: Context, quiz: TQuiz) {
  const { id, topic, question, variants } = quiz;

  const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
  const variantsOrder: number[] = variantsWithProxy.map(({ id }) => id);
  const maskedVariants = makeMaskedVariants(variantsWithProxy);

  const buttonVariants = maskedVariants
    .map((proxy, index) => [
      proxy, objStringify({ questionId: id, variantsOrder, isCorrect: !Boolean(index) }) // 0 index always is correct
    ]);

  const inlineButtons = buttonVariants
    .map(([text, payload]) => InlineKeyboard.text(text, payload));
  const inlineKeyboard = InlineKeyboard.from([inlineButtons]);

  const questionText = [
    // `<b>Блок:</b> ${block}`,
    "<b>Тема:</b>",
    `${topic}`,
    // `<b>Уровень:</b> ${"⭐️".repeat(level || 1)}`,
    "",
    `<b>Вопрос:</b> [id: ${id}]`,
    `${extractText(question)}`,
    "",
    "<i>В вопросе несколько верных вариантов</i> 🎓 🎓 🎓",
    "<b>Варианты ответов:</b>",
    variantsWithProxy
      .map(({ variant, proxy }) => `${proxy} ${variant}`)
      .join("\n"),
    "",
    "<b>Выберете единственный ответ:</b>",
  ].join("\n");

  await ctx.reply(questionText,
    {
      ...messageConfig,
      reply_markup: inlineKeyboard
    }
  );
}
