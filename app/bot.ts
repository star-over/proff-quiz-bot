import { Bot } from "grammy";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { getRandom, objParse } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { commonFilters, getAnswerById, getQuizById, isStyleOne, makeExplanation2, makeExplanation3, negativePhrases, positivePhrases, postQuiz } from "./post-commons.js";

const filteredQuizess = commonFilters(allQuizzes);
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
  const quizzes = filteredQuizess.filter(({ block }) => block === "Общие знания");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("capital_planning", async (ctx) => {
  const quizzes = filteredQuizess.filter(({ block }) => block === "Планирование капитальных вложений");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("constr_control", async (ctx) => {
  const quizzes = filteredQuizess.filter(({ block }) => block === "Строительный контроль");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("engineering", async (ctx) => {
  const quizzes = filteredQuizess.filter(({ block }) => block === "Управление проектированием в капитальном строительстве");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("projects", async (ctx) => {
  const quizzes = filteredQuizess.filter(({ block }) => block === "Управление проектами");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("constr_management", async (ctx) => {
  const quizzes = filteredQuizess.filter(({ block }) => block === "Управление строительством");
  const quiz: TQuiz = getRandom(quizzes);
  await postQuiz(ctx, quiz);
});

bot.command("pricing", async (ctx) => {
  const quizzes = filteredQuizess.filter(({ block }) => block === "Ценообразование капитального строительства");
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


bot.on("callback_query:data", async (ctx) => {
  const message_id = ctx.update.callback_query.message.message_id;
  const chat_id = ctx.update.callback_query.message.chat.id;
  const username = ctx.update.callback_query.from.username;
  const firstName = ctx.update.callback_query.from.first_name;
  const userId = ctx.update.callback_query.from.id;
  const queryData = ctx.update.callback_query.data;

  // await ctx.api.editMessageReplyMarkup(chat_id, message_id, { reply_markup: null }); //hide inline keyboard
  const text = makeExplanation3({ userId, firstName, queryData });
  await ctx.reply(text, { reply_to_message_id: message_id, parse_mode: "HTML" });
  await ctx.answerCallbackQuery(); // remove loading animation

});

bot.on("message", async (ctx) => {
  const quiz: TQuiz = getRandom(filteredQuizess);
  await postQuiz(ctx, quiz);
});

bot.start();
