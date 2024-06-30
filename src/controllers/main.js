import axios from 'axios';
import cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';

import { view } from '../utils/view';

const exampleMsg = view('example');
const prisma = new PrismaClient();

/**
 * Show up welcome message when /start command triggered
 * and register new user to database for statistics
 */
export async function welcome(ctx) {
  const { from } = ctx.update.message;

  const userExists = await prisma.user.findFirst({ where: { telegramId: from.id.toString() } });

  if (!userExists) {
    await prisma.user.create({
      data: {
        firstName: from.first_name,
        lastName: from.last_name ? from.last_name : '',
        telegramId: from.id.toString(),
        username: from.username,
        lang: from.language_code,
      },
    });
  }

  ctx.reply('Send a domain you want to check.');
}

export async function enumDomain(ctx) {
  const message = ctx.message.text;
  const response = await axios.get(`https://www.whois.com/whois/${message}`);
  const { data } = response;

  const $ = cheerio.load(data);

  let domainInfo = [];

  // Memuat informasi domain menggunakan Cheerio
  $('.whois-data .df-block').each((i, el) => {
    let info = {};
    let rows = [];

    info.title = $(el).find('.df-heading').text();

    $(el)
      .find('.df-row')
      .each((i, el2) => {
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
  domainInfo.forEach((val) => {
    reply += `\n<b>${val.title}</b>\n======\n`;

    val.rows.forEach((row) => {
      reply += `<b>${row[0]}</b> <code>${row[1]}\n</code>`;
    });
  });

  // Jika tidak ada informasi domain yang ditemukan
  if (domainInfo.length === 0) {
    ctx.reply('Domain not found');
  } else {
    ctx.replyWithHTML(reply);
  }
}

export function about(ctx) {
  ctx.reply(`'Whois' bot is your go-to tool for instant domain information retrieval. Simply enter a domain name, and let the bot do the rest. It swiftly provides you with comprehensive details about the domain, including registration information, owner contact details, DNS records, and more.


Site: https://bots8.com`);
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
  const totalUser = await prisma.user.count();
  const myInfo = await prisma.user.findFirst({
    where: { telegramId: ctx.update.message.from.id.toString() },
  });

  const message = view('stats', {
    totalUser,
    registered: myInfo.createdAt,
    lang: myInfo.lang,
  });
  ctx.reply(message.stats, { parse_mode: 'Markdown' });
}
