import { InputFile } from "grammy";
import { renderToStaticMarkup } from "react-dom/server";
import { extractText } from "./lib/utils.js";
import { render } from "./puppeteer/render.js";
import { Card1 } from "./templates/card1.js";
import { numberProxies } from "./post-commons.js";

export async function postPicturePoll(ctx, quiz) {

  const { question, answers, reference } = quiz;
  const botName = process.env.BOT_NAME as string;
  const botDescription = process.env.BOT_DESCRIPTION as string;
  const pollQuestion = extractText(question);

  const answersWithProxies = answers
    .map((answer, i) => ({ ...answer, proxy: numberProxies[i] }));

  const pollAnswersProxy = answersWithProxies
    .map(({ proxy }) => proxy ?? "");

  const cardProps = {
    ...quiz,
    botName,
    botDescription,
    answers: answersWithProxies,
  };
  const jsx = Card1(cardProps);
  const html = renderToStaticMarkup(jsx);
  const picture = await render(html) as Buffer;
  const pictureResponse = await ctx.replyWithPhoto(new InputFile(picture));

  const pollConfig = {
    type: "quiz",
    correct_option_id: answersWithProxies.findIndex(({ isCorrect }) => isCorrect),
    explanation: reference,
    explanation_parse_mode: "HTML",
    reply_to_message_id: pictureResponse.message_id,
  } as const;

  await ctx.replyWithPoll(pollQuestion, pollAnswersProxy, pollConfig);
}
