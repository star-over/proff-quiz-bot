import { Bot, InputFile } from "grammy";
import { render } from "./puppeteer/render.js";
import { Card1 } from "./templates/card1.js";
import { renderToStaticMarkup } from "react-dom/server";
import { testQuiz } from "./quizzes/quizzes.js";
import { TAnswers } from "./quizzes/quiz.js";



const BOT_NAME = process.env.BOT_NAME as string;
const BOT_TOKEN = process.env.BOT_TOKEN as string
const BOT_DESCRIPTION = process.env.BOT_DESCRIPTION as string;
const proxies = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K",
"L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Z"];
const bot = new Bot(BOT_TOKEN);

const quizzes = testQuiz;
function getQuiz(index: number) {
  const question = quizzes[index];
  const answersWithProxies: TAnswers = question.answers
    .map((answer, i) => ({ ...answer, proxy: proxies[i] }));

  return { ...question, id: index, answers: answersWithProxies };
}

bot.command("start", (ctx) => ctx.reply("Профессиональное тестирование"));
bot.on("message", async (ctx) => {

  const quiz = getQuiz(0);

  // const quiz = {
  //   id: 500,
  //   topic: "Стихи",
  //   question: "О сколько нам открытий чудных",
  //   botDescription: BOT_DESCRIPTION,
  //   botName: BOT_NAME
  // }
  const jsx = Card1({ ...quiz, botDescription: BOT_DESCRIPTION, botName: BOT_NAME})
  const html = renderToStaticMarkup(jsx)
  // const html = Template1({ val: "hello hello" })

  // const other = {
  //   type: "quiz",
  //   correct_option_id: variants.findIndex(({ isCorrect }) => isCorrect),
  //   explanation: reference?.html,
  //   explanation_parse_mode: "HTML",
  //   reply_to_message_id: pictureMessageResponse.message_id,
  // } as const;

  // await ctx.replyWithPoll(
  //   "How do you think?",
  //   ["hello", "gggg", "Not at all"],
  //   {type: "quiz", correct_option_id: 0, reply_to_message_id: ctx.message.message_id});

  const picture = await render(html) as Buffer;
  const pictureMessageResponse = await ctx.replyWithPhoto(new InputFile(picture));

});

bot.start().then().catch(Error);;
