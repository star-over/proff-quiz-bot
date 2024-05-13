import { extractText } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";

export async function postPoll(ctx, quiz: TQuiz) {
  const { id, topic, question, answers, explanation } = quiz;

  const pollQuestion = [
    `Тема: ${topic}`,
    ``,
    `Вопрос: ${extractText(question)}`,
    `[id: ${id}]`,
  ].join("\n");
  
  const pollAnswers = answers.map(({ answer }) => answer ?? "");
  const pollConfig = {
    type: "quiz",
    correct_option_id: answers.findIndex(({ isCorrect }) => isCorrect),
    explanation,
    explanation_parse_mode: "HTML",
  } as const;

  await ctx.replyWithPoll(pollQuestion, pollAnswers, pollConfig);
}
