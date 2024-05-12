import { extractText } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";

export async function postPoll(ctx, quiz: TQuiz) {

  const { id, topic, question, variants, reference } = quiz;
  const pollQuestion = [
    `Тема: ${topic}`,
    ``,
    `Вопрос: ${extractText(question)}`,
    `[id: ${id}]`,
  ].join("\n");
  // const pollQuestion = `Тема: ${topic}\n\n${extractText(question)}`;
  // const pollQuestion = extractText(question);
  const pollAnswers = variants.map(({ variant }) => variant ?? "");
  const pollConfig = {
    type: "quiz",
    correct_option_id: variants.findIndex(({ key }) => key),
    explanation: reference,
    explanation_parse_mode: "HTML",
  } as const;

  await ctx.replyWithPoll(pollQuestion, pollAnswers, pollConfig);
}
