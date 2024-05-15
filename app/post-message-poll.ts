import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { getAnswers, makePollConfig, messageConfig } from "./post-commons.js";

export async function postMessagePoll(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, answers, reference } = quiz;

  const levelText = (level?.length > 0) ? `<b>Уровень:</b> ${level}` : "";
  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${levelText}`,
    `\n<b>${extractText(question)}</b>`,
    `[id: ${id}]`,
  ].join("\n");

  const questionMessage = await ctx.reply(questionText, messageConfig);


  const pollAnswers = getAnswers(answers);
  const pollConfig = {
    ...makePollConfig(answers, reference),
    reply_to_message_id: questionMessage.message_id,
  } as const;

  await ctx.replyWithPoll("Выберете единственный ответ:", pollAnswers, pollConfig);
}
