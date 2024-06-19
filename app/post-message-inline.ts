import { Context, InlineKeyboard } from "grammy";
import { chunk, extractText, objStringify } from "./lib/utils.js";
import { TVariants, TQuiz } from "./quizzes/quiz.js";
import { getVariantsWithProxies, messageConfig } from "./post-commons.js";

export async function postMessageInline(ctx: Context, quiz: TQuiz) {
  const { id: questionId, topic, question, variants } = quiz;
  const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
  const variantsOrder: number[] = variantsWithProxy.map(({ id }) => id);

  //#region
  const buttonVariants = variantsWithProxy
    .map(({ proxy, isCorrect }) => [
      proxy, objStringify({ questionId, variantsOrder, isCorrect })
    ]);
  //#endregion
  //#region
  const inlineButtons = buttonVariants
    .map(([label, data]) => InlineKeyboard.text(label, data));

  // TODO make chunk dynamic, depends on buttons count
  const inlineKeyboard = InlineKeyboard.from(chunk(inlineButtons, 2));
  //#endregion
  //#region questionText
  const questionText = [
    // `<b>Блок:</b> ${block}`,
    `📙 <b>Тема:</b> ${topic}`,
    // `<b>Уровень:</b> ${"⭐️".repeat(level || 1)}`,
    "",
    `<b>Вопрос:</b> ❓ <i>[id: ${questionId}]</i>`,
    `${extractText(question)}`,
    "",
    "<b>Варианты ответов:</b>",
    variantsWithProxy
      .map(({ variant, proxy }) => `${proxy} ${variant}`)
      .join("\n"),
    "",
    "<b>Выберете единственный ответ:</b>",
  ].join("\n");
  //#endregion

  await ctx.reply(questionText, { ...messageConfig, reply_markup: inlineKeyboard });
}
