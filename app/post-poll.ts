import { Context } from "grammy";
import { extractText } from "./lib/utils.js";
import { getVariants, makePollConfig } from "./post-commons.js";
import { TQuiz } from "./quizzes/quiz.js";

export async function postPoll(ctx: Context, quiz: TQuiz) {
  const { id, topic, question, variants, reference } = quiz;

  const pollQuestion = [
    `Тема: ${topic}`,
    ``,
    `Вопрос: ${extractText(question)}`,
    `[id:${id}]`,
  ].join("\n");

  const pollVariants = getVariants(variants).map((variant) => ({ text: variant }));
  const pollConfig = makePollConfig(variants, reference)

  await ctx.replyWithPoll(pollQuestion, pollVariants, pollConfig);
}
