import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import conf from '../config/config';
import {
    ALL_COMMANDS,
    COMMAND_NOTES,
    COMMAD_NEW_NOTE,
    COMMAND_EDIT_NOTE,
    COMMAND_DEL_NOTE,
    COMMAND_RETURN
} from "./commands";

import keyboards from './keyboards';

const token = conf.telegram_token;
const app = express();
const bot = new TelegramBot(token, {polling: true});

app.get('/', (req, res) => {
    res.send('BOT RUNING')
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bienvenido a un bot pensado para organizar tus notas.',
        {
            "reply_markup": {
                "keyboard": keyboards.home
            }
        }
    )
});
//
// bot.onText(/\/carro/, (msg) => {
//     const chatId = msg.chat.id;
//     var options = {
//         reply_markup: JSON.stringify({
//             inline_keyboard: [
//                 [{ text: 'Some button text 1', callback_data: '1' }],
//                 [{ text: 'Some button text 2', callback_data: '2' }],
//                 [{ text: 'Some button text 3', callback_data: '3' }]
//             ]
//         })
//     };
//     bot.sendMessage(msg.chat.id, 'Some text giving three inline buttons', options);
// });

bot.on('message', (msg) => {
    if (msg.hasOwnProperty('text')) {
        const message = msg.text;
        if (message) {
            switch (message) {
                case COMMAND_NOTES:
                    console.log("ver notas");
                    var options = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: 'Comandos Docker', callback_data: '1' }],
                                [{ text: 'Recetas de cocina', callback_data: '2' }],
                                [{ text: 'Cuentas bancarias', callback_data: '3' }]
                            ]
                        })
                    };
                    bot.sendMessage(msg.chat.id, 'Notas', options);
                    break;

                case COMMAND_RETURN:
                    console.log("atras");
                    bot.sendMessage(
                        msg.chat.id,
                        "Selecciona una opcion", {
                            "reply_markup": {
                                "keyboard": keyboards.home
                            }
                        }
                    );
                    break
            }
        }
    }
});


bot.on('polling_error', (error) => {
    console.log(error);
});

app.listen(conf.port, () => {
    console.log(`bot runing in the port ${conf.port}`);
});
