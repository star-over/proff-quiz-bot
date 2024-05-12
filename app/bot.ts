import { Bot } from "grammy";
import { testQuiz } from "./quizzes/quizzes.js";
import { postPicturePoll } from "./post-picture-poll.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";
import { getRandom } from "./lib/utils.js";
import { allQuizzes } from "./quizzes/allQuizzes.js";


const botToken = process.env.BOT_TOKEN as string
const bot = new Bot(botToken);


bot.command("start", (ctx) => ctx.reply("Профессиональное тестирование"));
bot.on("message", async (ctx) => {
  console.log("🚀 > bot.on > ctx:", ctx.chat.id);

  const quizzes = allQuizzes
    .filter(({ style }) => style === "one")
    .filter(({ variants }) => variants.every(({ variant }) => variant.length <= 100))
    .filter(({ block, topic, question }) => block.length + topic.length + question.length < 275)
  const quiz = getRandom(quizzes)

  // await postPicturePoll(ctx, quiz);
  await postPoll(ctx, quiz);
  // await postSpoiler(ctx, quiz);

});

bot.start();
