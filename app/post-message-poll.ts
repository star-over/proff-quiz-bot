import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { getVariants, makePollConfig, messageConfig } from "./post-commons.js";

export async function postMessagePoll(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, variants, reference } = quiz;

  const levelText = (level > 0) ? `<b>Уровень:</b> ${level}` : "";
  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${levelText}`,
    `\n<b>${extractText(question)}</b>`,
    `[id: ${id}]`,
  ].join("\n");

  const questionMessage = await ctx.reply(questionText, messageConfig);


  const pollVariants = getVariants(variants).map((variant) => ({ text: variant}));
  const pollConfig = {
    ...makePollConfig(variants, reference),
    reply_to_message_id: questionMessage.message_id,
  } as const;

  await ctx.replyWithPoll("Выберете единственный ответ:", pollVariants, pollConfig);
}
