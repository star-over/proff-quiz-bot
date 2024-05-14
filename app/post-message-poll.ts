import { Context } from "grammy";
import { extractText, makeExplanation, } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";

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

  const messageConfig = {
    parse_mode: "HTML",
    disable_notification: true
  } as const

  const questionMessage = await ctx.reply(questionText, messageConfig);


  const pollAnswers = answers.map(({ answer }) => answer ?? "");
  const correct_option_id = answers.findIndex(({ isCorrect }) => isCorrect);
  const explanation = makeExplanation(answers, correct_option_id, reference);
  const pollConfig = {
    type: "quiz",
    correct_option_id,
    explanation,
    explanation_parse_mode: "HTML",
    reply_to_message_id: questionMessage.message_id,
    disable_notification: true,
  } as const;

  await ctx.replyWithPoll("Выберете единственный ответ:", pollAnswers, pollConfig);


}
