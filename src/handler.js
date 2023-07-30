import { welcome, help, sticker, greeting, stats } from './controllers/example';

export default function handler(bot) {
    bot.start(welcome);
    bot.help(help);
    bot.on('sticker', sticker);
    bot.hears('hi', greeting);
    bot.command('stats', stats);
}