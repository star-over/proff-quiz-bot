import { proxies } from "./post-commons.js";

export async function postSpoiler(ctx, quiz) {

  const { question, answers, reference, topic } = quiz;
  const pollAnswers = answers
    .map((answer, i) => (
      {
        ...answer,
        text: `${proxies[i]}. ${answer.answer}`
      }
    ));
  const correctAnswer = pollAnswers
    .find(({ isCorrect }) => isCorrect)
    .text;

  const message = [
    `Тема: <b>${topic}</b>`,
    "",
    question,
    "",
    pollAnswers.map(({ text }) => text).join("\n"),
    "",
    "Ответ:",
    `<tg-spoiler>\
    ${correctAnswer.padStart(20, " ")}\
    <blockquote>${reference}</blockquote>\
    </tg-spoiler>`,
  ].join("\n");

  const config = {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  } as const;

  await ctx.reply(message, config);
}
