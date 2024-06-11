import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { TVariants, TQuiz } from "./quizzes/quiz.js";
import { getVariantsWithProxies, getLevelText, makePollConfig, messageConfig } from "./post-commons.js";

export async function postMessageProxy(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, variants, reference } = quiz;

  const levelText: string = getLevelText(level);
  const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
  const pollVariants = variantsWithProxy.map(({ proxy }) => ({ text: `${proxy}` }));


  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${levelText}`,
    `\n<b>${extractText(question)}</b>`,
    "",
    variantsWithProxy
      .map(({ variant, proxy }) => `<b>${proxy}.</b> ${variant}`)
      .join("\n"),
    "",
    `[id: ${id}]`,
  ].join("\n");

  const questionMessage = await ctx.reply(questionText, messageConfig);

  const pollConfig = {
    ...makePollConfig(variantsWithProxy, reference),
    reply_to_message_id: questionMessage.message_id,
  } as const;

  await ctx.replyWithPoll("Выберете единственный ответ:", pollVariants, pollConfig);
}
