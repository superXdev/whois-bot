import { welcome, help, stats, enumDomain } from './controllers/main';

export default function handler(bot) {
    bot.start(welcome);
    bot.help(help);
    bot.command('stats', stats);
    bot.on('text', enumDomain);
}