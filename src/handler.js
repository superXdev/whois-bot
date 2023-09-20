import { welcome, help, stats, about, enumDomain } from './controllers/main';

export default function handler(bot) {
    bot.start(welcome);
    bot.help(help);
    bot.command('stats', stats);
    bot.command('about', about);
    bot.on('text', enumDomain);
}