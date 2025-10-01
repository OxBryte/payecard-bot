const { Telegraf } = require("telegraf");
const token = process.env.TELEGRAM_BOT_API_TOKEN;

const bot = new Telegraf(token);

bot.on("message", (ctx) => {
  ctx.reply("Hello");
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));