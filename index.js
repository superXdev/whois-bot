const { Telegraf } = require('telegraf');
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_SECRET_KEY);
const app = express();


// Middleware untuk log pesan yang masuk
bot.use(validateMessage);

// Command handler untuk perintah /start
bot.start(handleStartCommand);

// Handler untuk pesan teks
bot.on('text', handleTextMessage);

// Fungsi untuk memvalidasi pesan
function validateMessage(ctx, next) {
   const message = ctx.message.text;

   if (!message.includes('/start') && !isValidDomain(message)) {
      ctx.reply('Sorry, domain is not valid');
      return;
   }

   next();
}

// Handler untuk perintah /start
function handleStartCommand(ctx) {
   ctx.reply('Send a domain you want to check.');
}

// Handler untuk pesan teks
async function handleTextMessage(ctx) {
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

// Fungsi untuk memvalidasi domain
function isValidDomain(domain) {
   const regex = /^(?!www\.)(?!https?:\/\/)([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(?:\/|\?|$)/;
   return regex.test(domain);
}

// Menjalankan bot
console.log('Menjalankan bot...');

if(process.env.NODE_ENV == 'production') {
   app.use(bot.webhookCallback('/SECRET'));

   // Mengatur webhook dengan URL yang sesuai
   bot.telegram.setWebhook(process.env.WEBHOOK_URL + '/SECRET');

   const port = process.env.PORT || 3000;
   app.listen(port, () => {
     console.log(`Server berjalan di http://localhost:${port}`);
   });
} else {
   bot.launch();
}
