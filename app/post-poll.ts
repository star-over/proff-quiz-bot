import { extractText, makeExplanation } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";

export async function postPoll(ctx, quiz: TQuiz) {
  const { id, topic, question, answers, reference } = quiz;

  const pollQuestion = [
    `Тема: ${topic}`,
    ``,
    `Вопрос: ${extractText(question)}`,
    `[id:${id}]`,
  ].join("\n");

  const pollAnswers = answers.map(({ answer }) => answer ?? "");
  const correct_option_id = answers.findIndex(({ isCorrect }) => isCorrect);
  const explanation = makeExplanation(answers, correct_option_id, reference);
  const pollConfig = {
    type: "quiz",
    correct_option_id,
    explanation,
    explanation_parse_mode: "HTML",
  } as const;

  await ctx.replyWithPoll(pollQuestion, pollAnswers, pollConfig);
}
