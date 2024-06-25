import { Bot } from "grammy";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { getRandom } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { commonFilters, postQuiz, makeIndicator, messageConfig, makeExplanation4, getQuizById } from "./post-commons.js";
import { commands } from "./commands.js";

const filteredQuizess = commonFilters(allQuizzes);
const botToken = process.env.BOT_TOKEN as string
const bot = new Bot(botToken);

bot.api.setMyCommands(commands)

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
  const quiz = getQuizById(allQuizzes, questionId)
  if (quiz) {
    await postQuiz(ctx, quiz);
    return null;
  }

  await ctx.reply(`Нет вопроса с номером ${ctx.match}`)
});

bot.on("callback_query:data", async (ctx) => {
  const userId = ctx.from.id;
  const firstName = ctx.from.first_name;
  const username = ctx.from.username;
  const message_id = ctx.update.callback_query.message.message_id;
  const payload = ctx.update.callback_query.data;

  // hide inline keyboard
  // await ctx.api.editMessageReplyMarkup(ctx.chat.id, message_id, { reply_markup: null });

  const text = makeExplanation4({ userId, firstName, payload });
  const feedback = await ctx.reply(text, { ...messageConfig, reply_to_message_id: message_id });

  setTimeout(() => {
    ctx.api.deleteMessage(ctx.chat.id, feedback.message_id).catch(() => { });
    ctx.api.deleteMessage(ctx.chat.id, message_id).catch(() => { });
  }, 60_000);

  // remove loading animation
  await ctx.answerCallbackQuery({ text: makeIndicator(payload) });
});

bot.on("message", async (ctx) => {
  const quiz: TQuiz = getRandom(filteredQuizess);

  await postQuiz(ctx, quiz);
});

bot.start();
