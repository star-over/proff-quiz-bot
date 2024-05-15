import { extractText } from "./lib/utils.js";
import { getAnswers, makePollConfig } from "./post-commons.js";
import { TQuiz } from "./quizzes/quiz.js";

export async function postPoll(ctx, quiz: TQuiz) {
  const { id, topic, question, answers, reference } = quiz;

  const pollQuestion = [
    `Тема: ${topic}`,
    ``,
    `Вопрос: ${extractText(question)}`,
    `[id:${id}]`,
  ].join("\n");

  const pollAnswers = getAnswers(answers);
  const pollConfig = makePollConfig(answers, reference)

  await ctx.replyWithPoll(pollQuestion, pollAnswers, pollConfig);
}
