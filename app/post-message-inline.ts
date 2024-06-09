import { Context, InlineKeyboard } from "grammy";
import { extractText, objStringify } from "./lib/utils.js";
import { TAnswers, TQuiz } from "./quizzes/quiz.js";
import { getAnswersWithProxies, getLevelText, messageConfig } from "./post-commons.js";

export async function postMessageInline(ctx: Context, quiz: TQuiz) {
  const { id: questionId, block, level, topic, question, answers } = quiz;

  const answersWithProxy: TAnswers = getAnswersWithProxies(answers);
  const correctProxy = answersWithProxy.find(({ isCorrect }) => isCorrect).proxy;
  const buttonAnswers = answersWithProxy
    .map(({ proxy, id: answerId }) => [proxy, objStringify({ questionId, answerId, correctProxy })])

  const buttonRow = buttonAnswers
    .map(([label, data]) => InlineKeyboard.text(label, data));
  const inlineKeyboard = InlineKeyboard.from([buttonRow]);

  const questionText = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `<b>Уровень:</b> ${"⭐️".repeat(level || 1)}`,
    `\n<b>${extractText(question)}</b>`,
    "",
    answersWithProxy
      .map(({ answer, proxy }) => `${proxy} ${answer}`)
      .join("\n"),
    "",
    `[id: ${questionId}]`,
  ].join("\n");

  const { chat: { id: chat_id }, message_id } = await ctx.reply(
    questionText,
    {
      ...messageConfig,
      reply_markup: inlineKeyboard
    }
  );
  // console.log("🚀 > postMessageInline > message:", chat_id, message_id);
  // await ctx.api.editMessageReplyMarkup(chat_id, message_id, { reply_markup: null })


}
