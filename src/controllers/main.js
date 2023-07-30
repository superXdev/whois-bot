import axios from 'axios';
import cheerio from 'cheerio';

import { view } from '../utils/view';
import { User }  from '../models';

const exampleMsg = view('example');

/**
 * Show up welcome message when /start command triggered
 * and register new user to database for statistics
 */
export async function welcome(ctx) {
    const from = ctx.update.message.from;

    const userExists = await User.findOne({ where: { telegramId: from.id } });

    if(!userExists) {
        await User.create({
            firstName: from.first_name,
            lastName: from.last_name,
            telegramId: from.id,
            username: from.username,
            lang: from.language_code
        });
    }

    ctx.reply('Send a domain you want to check.');
}

export async function enumDomain(ctx) {
    const message = ctx.message.text;
    const response = await axios.get('https://www.whois.com/whois/' + message);
    const data = response.data;

    const $ = cheerio.load(data);

    let domainInfo = [];

    // Memuat informasi domain menggunakan Cheerio
    $('.whois-data .df-block').each((i, el) => {
        let info = {};
        let rows = [];

        info.title = $(el).find('.df-heading').text();

        $(el).find('.df-row').each((i, el2) => {
            const label = $(el2).find('.df-label').text();
            const value = label.includes('Name Servers:')
                ? $(el2).find('.df-value').html().replaceAll('<br>', ', ')
                : $(el2).find('.df-value').text();
            rows.push([label, value]);
        });

        info.rows = rows;
        domainInfo.push(info);
    });

    let reply = '';

    // Membentuk balasan berformat HTML dengan informasi domain
    domainInfo.forEach(val => {
        reply += `\n<b>${val.title}</b>\n======\n`;

        val.rows.forEach(row => {
            reply += `<b>${row[0]}</b> <code>${row[1]}\n</code>`;
        });
    });

    // Jika tidak ada informasi domain yang ditemukan
    if (domainInfo.length == 0) {
        ctx.reply('Domain not found');
    } else {
        ctx.replyWithHTML(reply);
    }
}


/**
 * Show help message 
 */
export function help(ctx) {
    ctx.reply(exampleMsg.help);
}

/**
 * Show the short info about user
 * and total users 
 */
export async function stats(ctx) {
    const totalUser = await User.count();
    const myInfo = await User.findOne({ 
        where: { telegramId: ctx.update.message.from.id } 
    });

    const message = view('stats', { 
        totalUser: totalUser, 
        registered: myInfo.createdAt, 
        lang: myInfo.lang 
    });
    ctx.reply(message.stats, { parse_mode: 'Markdown' });
}