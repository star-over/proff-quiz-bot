export async function postSpoiler(ctx, { quiz }) {

  const { question, answers, reference, topic } = quiz;

  const correctAnswer = answers
    .find(({ isCorrect }) => isCorrect)
    .answer;

  const message = [
    `Тема: <b>${topic}</b>`,
    "",
    question,
    "",
    "Ответ:",
    `<tg-spoiler>\
    ${correctAnswer.padStart(30, " ")}\
    <blockquote>${reference}</blockquote>\
    </tg-spoiler>`,
  ].join("\n");

  const config = {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  } as const;

  await ctx.reply(message, config);
}
