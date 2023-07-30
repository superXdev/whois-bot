import { Telegraf } from 'telegraf';
import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

import handler from './handler';

// Initialize Telegraf
// with bot token from https://t.me/BotFather
const bot = new Telegraf(process.env.BOT_TOKEN);

handler(bot);

console.log('Telegram bot started');

// For production
// use wabhook
if(process.env.NODE_ENV == 'production') {
	const app = express();
	app.use(bot.webhookCallback('/' + process.env.SECRET_PATH));

	// Mengatur webhook dengan URL yang sesuai
	bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/' + process.env.SECRET_PATH);

	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`);
	});
} else {
	bot.launch();

	// Enable graceful stop
	process.once('SIGINT', () => bot.stop('SIGINT'));
	process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
