import { welcome, help, stats, enumDomain } from './controllers/main';

export default function handler(bot) {
    bot.start(welcome);
    bot.help(help);
    bot.on('text', enumDomain);
    bot.command('stats', stats);
}