import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";

export async function postMessagePoll(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, answers, explanation } = quiz;
  const complexity = (level?.length > 0) ? `<b>Уровень:</b> ${level}` : "";

  const pollQuestion = [
    `<b>Блок:</b> ${block}`,
    `<b>Тема:</b> ${topic}`,
    `${complexity}`,
    `\n<b>${extractText(question)}</b>`,
    `[id: ${id}]`,
  ].join("\n");

  const pollAnswers = answers.map(({ answer }) => answer ?? "");

  const message = await ctx.reply(pollQuestion, { parse_mode: "HTML" });

  const pollConfig = {
    type: "quiz",
    correct_option_id: answers.findIndex(({ isCorrect }) => isCorrect),
    explanation,
    explanation_parse_mode: "HTML",
    reply_to_message_id: message.message_id,
  } as const;

  await ctx.replyWithPoll("Выберете единственный ответ:", pollAnswers, pollConfig);
}
