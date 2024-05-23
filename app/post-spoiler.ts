import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { getAnswersWithProxies, getLevelText, getMaxAnswerSize, isStyleOne, messageConfig } from "./post-commons.js";
import { TAnswers, TQuiz } from "./quizzes/quiz.js";

export async function postSpoiler(ctx: Context, quiz: TQuiz) {
  const { id, block, level, topic, question, answers, reference } = quiz;
  const levelText = getLevelText(level);
  const answersWithProxy: TAnswers = getAnswersWithProxies(answers);
  const maxAnswerSize: number = getMaxAnswerSize(quiz);
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
    answersWithProxy
      .map(({ answer, proxy }) => `<b>${proxy}.</b> ${answer}`)
      .join("\n"),
    "<tg-spoiler>",
    "<blockquote>",
    "<b>Ответ:</b>",
    answersWithProxy
      .filter(({ isCorrect }) => isCorrect)
      .map(({ proxy, answer }) => `<b>${proxy}.</b> ${(answer + " ").padEnd(maxAnswerSize, "⠀")}`)
      .join("\n"),
    `${explanation}`,
    "</blockquote>",
    "</tg-spoiler>",
    `[id: ${id}]`,
  ].join("\n");

  await ctx.reply(questionText, messageConfig);
}
