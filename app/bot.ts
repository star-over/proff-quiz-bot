import { Bot } from "grammy";
import { testQuiz } from "./quizzes/quizzes.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";
import { postMessagePoll } from "./post-message-poll.js";
import { postPicturePoll } from "./post-picture-poll.js";
import { postMessageProxy } from "./post-message-proxy.js";
import { getRandom } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { isAnswerSizeGt100, isPollQuestionGt250, isStyleOne } from "./post-commons.js";

const botToken = process.env.BOT_TOKEN as string
const bot = new Bot(botToken);

bot.command("start", (ctx) => ctx.reply("Профессиональное тестирование"));
bot.on("message", async (ctx) => {
  console.log("🚀 > bot.on > ctx:", ctx.chat.id);

  const quizzes = allQuizzes
  // .filter(isStyleOne)
  // .filter(({ answers }) => (2 <= answers.length) && (answers.length <= 10))
  // .filter(({ answers }) => (answers.length < 10))
  // .filter(({ answers }) => answers.some(({ answer }) => answer.length > 100))
  // .filter(isAnswerSizeGt100)
  // .filter(({ reference }) => reference.length <= 200)
  // .filter(({ topic, question }) => topic.length + question.length < 250)
  const quiz: TQuiz = getRandom(quizzes)

  // await postPicturePoll(ctx, quiz);
  // await postMessagePoll(ctx, quiz);
  // await postMessageProxy(ctx, quiz);
  // await postPoll(ctx, quiz);


  // if (isStyleOne(quiz) === false) {
  //   await postSpoiler(ctx, quiz);
  // } else if (isAnswerSizeGt100(quiz)) {
  //   await postSpoiler(ctx, quiz);
  // } else if (isPollQuestionGt250(quiz)) {
  //   await postSpoiler(ctx, quiz);
  // } else if (quiz.answers.length > 10) {
  //   await postSpoiler(ctx, quiz);
  // } else {
  //   await postPoll(ctx, quiz);
  // }
  
  await postSpoiler(ctx, quiz);
});

bot.start();
