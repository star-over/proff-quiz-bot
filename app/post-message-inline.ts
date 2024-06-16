import { Context, InlineKeyboard } from "grammy";
import { extractText, objStringify } from "./lib/utils.js";
import { TVariants, TQuiz } from "./quizzes/quiz.js";
import { getVariantsWithProxies, getLevelText, messageConfig } from "./post-commons.js";

// export async function postMessageInline(ctx: Context, quiz: TQuiz) {
//   const { id: questionId, block, level, topic, question, variants } = quiz;

//   const variantsWithProxy: TVariants = getVariantsWithProxies(variants);
//   const correctProxy = variantsWithProxy.find(({ isCorrect }) => isCorrect).proxy;
//   const buttonVariants = variantsWithProxy
//     .map(({ proxy, id: variantId }) => [proxy, objStringify({ questionId, variantId, correctProxy })])

//   const buttonRow = buttonVariants
//     .map(([label, data]) => InlineKeyboard.text(label, data));
//   const inlineKeyboard = InlineKeyboard.from([buttonRow]);

//   const questionText = [
//     // `<b>Блок:</b> ${block}`,
//     "<b>Тема:</b>",
//     `${topic}`,
//     // `<b>Уровень:</b> ${"⭐️".repeat(level || 1)}`,
//     "",
//     `<b>Вопрос:</b> [id: ${questionId}]`,
//     `${extractText(question)}`,
//     "",
//     "<b>Варианты ответов:</b>",
//     variantsWithProxy
//       .map(({ variant, proxy }) => `${proxy} ${variant}`)
//       .join("\n"),
//     "",
//     "<b>Выберете единственный ответ:</b>",
//   ].join("\n");

//   await ctx.reply(questionText,
//     {
//       ...messageConfig,
//       reply_markup: inlineKeyboard
//     }
//   );
// }
