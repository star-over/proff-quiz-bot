import { Bot, InlineKeyboard } from "grammy";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { getRandom } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { postQuiz } from "./post-commons.js";

const botToken = process.env.BOT_TOKEN as string
const bot = new Bot(botToken);


bot.api.setMyCommands([
  {
    command: "constr_management",
    description: "Управление строительством",
  },
  {
    command: "commom",
    description: "Общие знания",
  },
  {
    command: "capital_planning",
    description: "Планирование КВ",
  },
  {
    command: "constr_control",
    description: "Строй контроль",
  },
  {
    command: "engineering",
    description: "Управление ПИР",
  },
  {
    command: "pricing",
    description: "Ценообразование КС",
  },
  {
    command: "projects",
    description: "Проекты",
  },
])


bot.command("start", (ctx) => ctx.reply("Отправьте сообщение боту чтобы получить случайный вопрос по выбранной теме"));

bot.command("commom", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Общие знания");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("capital_planning", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Планирование капитальных вложений");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("constr_control", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Строительный контроль");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("engineering", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Управление проектированием в капитальном строительстве");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("projects", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Управление проектами");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("constr_management", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Управление строительством");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("pricing", async (ctx) => {
  const quizzes = allQuizzes.filter(({ block }) => block === "Ценообразование капитального строительства");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("get", async (ctx) => {
  const questionId = Number(ctx.match);

  const quizzes = allQuizzes.filter(({ id }) => id === questionId)
  if (quizzes.length > 0) {
    await postQuiz(ctx, quizzes.at(0));
  } else {
    await ctx.reply(`Нет вопроса с номером ${ctx.match}`)
  }
});

// bot.callbackQuery("next", async (ctx) => {
//   await ctx.answerCallbackQuery({
//     text: "You were curious, indeed!",
//     show_alert: true,
//   });
// });

bot.on("callback_query:data", async (ctx) => {
  const userName = ctx.update.callback_query.from.first_name;
  // console.log("===>", ctx.update.callback_query.from.first_name);
  // console.log("Unknown button event with payload", ctx);
  await ctx.answerCallbackQuery({
    text: `${userName}, великолепно!`,
    show_alert: true,
  }); // remove loading animation
});

bot.on("message", async (ctx) => {
  // console.log("🚀 > bot.on > ctx:", ctx);

  const quizzes = allQuizzes
    // .filter(isStyleOne)
    .filter(({ answers }) => (answers.length >= 2))
  // .filter(({ answers }) => (2 <= answers.length) && (answers.length <= 10))
  // .filter(({ answers }) => (answers.length < 10))
  // .filter(({ answers }) => answers.some(({ answer }) => answer.length > 100))
  // .filter(isAnswerSizeGt100)
  // .filter(({ reference }) => reference.length <= 200)
  // .filter(({ topic, question }) => topic.length + question.length < 250)
  const quiz: TQuiz = getRandom(quizzes);

  await postQuiz(ctx, quiz);
  // const s = (new URLSearchParams({ a: "1", b: "2" })).toString() // 'a=1&b=2'
  // const o = Object.fromEntries((new URLSearchParams(s)).entries()) // {a: '1', b: '2'}



});

bot.start();
