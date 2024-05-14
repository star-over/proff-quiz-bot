import { Bot } from "grammy";
import { testQuiz } from "./quizzes/quizzes.js";
import { postPicturePoll } from "./post-picture-poll.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";
import { getRandom } from "./lib/utils.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { postMessagePoll } from "./post-message-poll.js";


const botToken = process.env.BOT_TOKEN as string
const bot = new Bot(botToken);


bot.command("start", (ctx) => ctx.reply("Профессиональное тестирование"));
bot.on("message", async (ctx) => {
  console.log("🚀 > bot.on > ctx:", ctx.chat.id);

  const quizzes = allQuizzes
    .filter(({ style }) => style === "one")
    .filter(({ answers }) => (2 <= answers.length) && (answers.length <= 10))
    .filter(({ answers }) => answers.every(({ answer }) => answer.length <= 100))
  // .filter(({ reference }) => reference.length <= 200)
  // .filter(({ topic, question }) => topic.length + question.length < 250)
  const quiz = getRandom(quizzes)

  // await postPicturePoll(ctx, quiz);
  // await postSpoiler(ctx, quiz);
  const pollQuestionSize = quiz.topic.length + quiz.question.length;
  if (pollQuestionSize < 250) {
    await postPoll(ctx, quiz);
  } else {
    await postMessagePoll(ctx, quiz);
  }

});

bot.start();
