import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import conf from '../config/config';
import keyboards from './keyboards';
import DBService from './db';
import {
    ALL_COMMANDS,
    COMMAND_NOTES,
    COMMAD_NEW_NOTE,
    COMMAND_EDIT_NOTE,
    COMMAND_DEL_NOTE,
    COMMAND_RETURN
} from "./commands";

const token = conf.telegram_token;
const app = express();
const bot = new TelegramBot(token, {polling: true});
const DB = new DBService();

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
// Crear registros
/*DB.insert(conf.collectionNote, [
    {
        "tittle": 'docker',
        "message": '```docker ps -a = ver todos los contenedores exixtentes```'
    },
    {
        "tittle": 'vps',
        "message": '```ssh 183.249.30.200 -l acarrizo = conectar al vps ```'
    }
]).then((col) => {
    console.log("insert", col);
});*/

bot.on('message', (msg) => {
    if (msg.hasOwnProperty('text')) {
        const message = msg.text;
        if (message) {
            switch (message) {
                case COMMAND_NOTES:
                    console.log("ver notas");

                    let inline_buttons_notes = [];
                    DB.getCollection(conf.collectionNote).then((collection) => {
                        let result = collection.find();
                        for (let position in result) {
                            inline_buttons_notes.push(
                                {
                                    text: result[position].tittle,
                                    callback_data: result[position].tittle
                                }
                            );
                        }
                    }).then(() => {
                        bot.sendMessage(msg.chat.id, "Todas las notas!", {
                            "reply_markup": {
                                "inline_keyboard": [
                                    inline_buttons_notes,
                                ],
                            }
                        });
                        bot.sendMessage(msg.chat.id, "Puede ir al menu anterior precionando atras.", {
                            "reply_markup": {
                                resize_keyboard: true,
                                "keyboard": keyboards.return_command
                            }
                        });
                    });


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

bot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    bot.answerCallbackQuery(callbackQuery.id)
        .then(() => {
            DB.getCollection(conf.collectionNote).then((collection) => {
                return collection.findOne({tittle: callbackQuery.data})
            }).then((data) => {
                let messaje = `<strong>${data.tittle}</strong>
<code>${data.message}</code>`;
                bot.sendMessage(msg.chat.id, messaje, {parse_mode: "HTML"});
            })
        });

});

bot.on('polling_error', (error) => {
    console.log(error);
});

app.listen(conf.port, () => {
    console.log(`bot runing in the port ${conf.port}`);
});
