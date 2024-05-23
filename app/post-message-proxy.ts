import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { TAnswers, TQuiz } from "./quizzes/quiz.js";
import { getAnswersWithProxies, getLevelText, makePollConfig, messageConfig } from "./post-commons.js";

export async function postMessageProxy(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, answers, reference } = quiz;

  const levelText: string = getLevelText(level);
  const answersWithProxy: TAnswers = getAnswersWithProxies(answers);
  const pollAnswers: string[] = answersWithProxy.map(({ proxy }) => `${proxy}.`);

  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${levelText}`,
    `\n<b>${extractText(question)}</b>`,
    "",
    answersWithProxy
      .map(({ answer, proxy }) => `<b>${proxy}.</b> ${answer}`)
      .join("\n"),
    "",
    `[id: ${id}]`,
  ].join("\n");

  const questionMessage = await ctx.reply(questionText, messageConfig);

  const pollConfig = {
    ...makePollConfig(answersWithProxy, reference),
    reply_to_message_id: questionMessage.message_id,
  } as const;

  await ctx.replyWithPoll("Выберете единственный ответ:", pollAnswers, pollConfig);
}
