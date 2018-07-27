import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import  conf from '../config/config';
const token = conf.telegram_token;
const app = express();
const bot = new TelegramBot(token, {polling: true});

app.get('/', (req, res) => {
    res.send('BOT RUNING')
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

bot.onText(/\🗒/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
        chatId,
        `Muy bien Ingrese el nombre de tu nota`,
        {
            "reply_markup": {
                "keyboard": [['🔙']]
            }
        })

});

app.listen(conf.port, () => {
  console.log(`bot runing in the port ${conf.port}`);
});
