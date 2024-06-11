import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { getVariantsWithProxies, getLevelText, getMaxVariantSize, isStyleOne, messageConfig } from "./post-commons.js";
import { TVariants, TQuiz } from "./quizzes/quiz.js";

export async function postSpoiler(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, variants, reference } = quiz;
  const levelText = getLevelText(level);
  const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
  const maxVariantSize: number = getMaxVariantSize(quiz);
  const explanation = (reference?.length > 0) ? `\n<b>Источник:</b>\n${reference}` : "";
  const chooseText = isStyleOne(quiz)
    ? "Выберете <b>один</b> верный ответ:"
    : "Выберете <b>несколько</b> верных ответов:";

  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${levelText}`,
    "\n<b>Вопрос:</b>",
    `${extractText(question)}`,
    "",
    `${chooseText}`,
    "",
    variantsWithProxy
      .map(({ variant, proxy }) => `<b>${proxy}.</b> ${variant}`)
      .join("\n"),
    "<tg-spoiler>",
    "<blockquote>",
    "<b>Ответ:</b>",
    variantsWithProxy
      .filter(({ isCorrect }) => isCorrect)
      .map(({ proxy, variant }) => `<b>${proxy}.</b> ${(variant + " ").padEnd(maxVariantSize, "⠀")}`)
      .join("\n"),
    `${explanation}`,
    "</blockquote>",
    "</tg-spoiler>",
    `[id: ${id}]`,
  ].join("\n");

  await ctx.reply(questionText, messageConfig);
}
