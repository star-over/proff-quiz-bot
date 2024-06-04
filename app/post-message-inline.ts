import { Context, InlineKeyboard } from "grammy";
import { extractText, objStringify } from "./lib/utils.js";
import { TAnswers, TQuiz } from "./quizzes/quiz.js";
import { getAnswersWithProxies, getLevelText, makePollConfig, messageConfig } from "./post-commons.js";

export async function postMessageInline(ctx: Context, quiz: TQuiz) {
  const { id: questionId, block, level, topic, question, answers, reference } = quiz;

  const levelText: string = getLevelText(level);
  const answersWithProxy: TAnswers = getAnswersWithProxies(answers);
  const correctProxy = answersWithProxy.find(({ isCorrect }) => isCorrect).proxy;
  const pollAnswers: string[] = answersWithProxy.map(({ proxy }) => `${proxy}.`);
  const buttonAnswers = answersWithProxy
    .map(({ proxy, id: answerId }) => [proxy, objStringify({ questionId, answerId, correctProxy })])

  const buttonRow = buttonAnswers
    .map(([label, data]) => InlineKeyboard.text(label, data));
  const inlineKeyboard = InlineKeyboard.from([buttonRow]);

  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${levelText}`,
    `\n<b>${extractText(question)}</b>`,
    "",
    answersWithProxy
      .map(({ answer, proxy }) => `${proxy} ${answer}`)
      .join("\n"),
    "",
    `[id: ${questionId}]`,
  ].join("\n");

  await ctx.reply(
    questionText,
    {
      ...messageConfig,
      reply_markup: inlineKeyboard
    }
  );


}
