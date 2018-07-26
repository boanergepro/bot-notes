const express = require("express");
const app = express();
const TelegramBot = require('node-telegram-bot-api');
const conf = require('./config');

const token = conf.telegram_token;
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, "hola");
});

app.get('/', (req, res) => {
    res.send('BOT RUNING')
});

bot.onText(/\🗒/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `Muy bien Ingrese el nombre de tu nota`,
        {
            "reply_markup": {
                "keyboard": [['Crear Tablero','🔙']]
            }
        })

});
bot.onText(/\U+2705️/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'aceptado');
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        'Bienvenido a un bot pensado para organizar tus notas.',
        {
            "reply_markup": {
                "keyboard": [['🗒','✖️']]
            }
        })
});

app.listen(conf.port, () => {
  console.log(`bot runing in the port ${conf.port}`);
});
