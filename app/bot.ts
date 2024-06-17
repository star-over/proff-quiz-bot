import { Bot } from "grammy";
import { allQuizzes } from "./quizzes/allQuizzes.js";
import { getRandom, objParse } from "./lib/utils.js";
import { TQuiz } from "./quizzes/quiz.js";
import { commonFilters, makeExplanation3, postQuiz, makeIndicator, messageConfig, makeExplanation4 } from "./post-commons.js";
import { postMultiVariants } from "./post-multi-variants.js";

const filteredQuizess = commonFilters(allQuizzes);
const botToken = process.env.BOT_TOKEN as string
const bot = new Bot(botToken);
type InlineKeyboardButton = {
  text: string;
  callback_data: string;
}

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
    // await postQuiz(ctx, quizzes.at(0));
    await postMultiVariants(ctx, quizzes.at(0));
  } else {
    await ctx.reply(`Нет вопроса с номером ${ctx.match}`)
  }
});

bot.on("callback_query:data", async (ctx) => {
  // console.log("🚀 > bot.on > ctx:");
  // console.dir(ctx, { depth: null });
  const chat_id = ctx.update.callback_query.message.chat.id;
  const username = ctx.update.callback_query.from.username;
  const message_id = ctx.update.callback_query.message.message_id;
  const firstName = ctx.update.callback_query.from.first_name;
  const userId = ctx.update.callback_query.from.id;
  const payload = ctx.update.callback_query.data;
  const inline_keyboard = ctx.update.callback_query.message.reply_markup.inline_keyboard
  const correctProxy = inline_keyboard
    .flat()
    .find((button: InlineKeyboardButton) => objParse(button.callback_data)?.isCorrect)
    ?.text

  // await ctx.api.editMessageReplyMarkup(chat_id, message_id, { reply_markup: null }); //hide inline keyboard

  const text = makeExplanation4({ userId, firstName, payload });
  await ctx.reply(text, { reply_to_message_id: message_id, parse_mode: "HTML" });

  // await ctx.answerCallbackQuery(); // remove loading animation
  await ctx.answerCallbackQuery({ text: makeIndicator(payload) }); // remove loading animation

});

bot.on("message", async (ctx) => {
  const quiz: TQuiz = getRandom(filteredQuizess);

  // const text = makeMaskedVariants();
  // await ctx.reply(text.toString(), messageConfig);
  await postMultiVariants(ctx, quiz);
  // await postQuiz(ctx, quiz);
});

bot.start();
