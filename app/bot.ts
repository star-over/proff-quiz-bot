import { Bot } from "grammy";
import { testQuiz } from "./quizzes/quizzes.js";
import { postPicturePoll } from "./post-picture-poll.js";
import { postPoll } from "./post-poll.js";
import { postSpoiler } from "./post-spoiler.js";

const botName = process.env.BOT_NAME as string;
const botDescription = process.env.BOT_DESCRIPTION as string;
const botToken = process.env.BOT_TOKEN as string
const quizzes = testQuiz;

const bot = new Bot(botToken);

function getQuiz(index: number) {
  const question = quizzes[index];
  return { ...question, id: index };
}

bot.command("start", (ctx) => ctx.reply("Профессиональное тестирование"));
bot.on("message", async (ctx) => {

  const quiz = getQuiz(0);

  // await postPicturePoll(ctx, { quiz, botName, botDescription});
  await postPoll(ctx, { quiz });
  // await postSpoiler(ctx, { quiz });

});

bot.start().then().catch(Error);;
