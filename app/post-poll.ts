import { extractText } from "./lib/utils.js";

export async function postPoll(ctx, quiz) {

  const { question, answers, reference, topic } = quiz;
  const pollQuestion = `Тема: ${topic}\n\n${extractText(question)}`;
  const pollAnswers = answers.map(({ answer }) => answer ?? "");
  const pollConfig = {
    type: "quiz",
    correct_option_id: answers.findIndex(({ isCorrect }) => isCorrect),
    explanation: reference,
    explanation_parse_mode: "HTML",
  } as const;

  await ctx.replyWithPoll(pollQuestion, pollAnswers, pollConfig);
}
