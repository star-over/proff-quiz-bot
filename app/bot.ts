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


bot.api.setMyCommands([
  {
    command: "construction_management",
    description: "Управление строительством",
  },
  {
    command: "commom",
    description: "Общие знания",
  },
  {
    command: "capital_planning",
    description: "Планирование капитальных вложений",
  },
  {
    command: "construction_control",
    description: "Строительный контроль",
  },
  {
    command: "engineering",
    description: "Управление проектированием в капитальном строительстве",
  },
  {
    command: "pricing",
    description: "Ценообразование капитального строительства",
  },
  {
    command: "projects",
    description: "Управление проектами",
  },
])


bot.command("start", (ctx) => ctx.reply("Отправьте сообщение боту чтобы получить случайный вопрос по выбранной теме"));

bot.command("commom", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Общие знания");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("capital_planning", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Планирование капитальных вложений");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("construction_control", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Строительный контроль");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("engineering", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Управление проектированием в капитальном строительстве");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("projects", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Управление проектами");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("construction_management", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Управление строительством");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("pricing", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Ценообразование капитального строительства");
  const quiz: TQuiz = getRandom(quizzes);
  await postSpoiler(ctx, quiz);
});

bot.command("get", async (ctx) => {
  console.log("🚀 > match:", typeof ctx.match);
  const questionId = Number(ctx.match);

  const quizzes = allQuizzes.filter(({ id }) => id === questionId)
  if (quizzes.length > 0) {
    await postSpoiler(ctx, quizzes.at(0));
  } else {
    await ctx.reply(`Нет вопроса с номером ${ctx.match}`)
  }

});

bot.on("message", async (ctx) => {
  console.log("🚀 > bot.on > ctx:", ctx);

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
