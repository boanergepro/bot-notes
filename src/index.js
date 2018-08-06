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

let trash = '';

const flow = {
    ALL_NOTES: false,
    NEW_NOTE: false,
    NAME_NEW_NOTE: false,
    MESSAGE_NEW_NOTE: false,
    SAVE_NEW_NOTE :false,
};

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
        "message": 'docker ps -a = ver todos los contenedores exixtentes'
    },
    {
        "tittle": 'docker buil',
        "message": 'docker build -t nameImage pathDockerfile'
    }
]).then((col) => {
    console.log("insert", col);
});*/
const createNote = (tittle, message) => {
    DB.insert(conf.collectionNote, [
        {
            "tittle": tittle,
            "message": message
        }
    ])
        .then((col) => {
            flow.NEW_NOTE = false;
            flow.NAME_NEW_NOTE = false;
            flow.MESSAGE_NEW_NOTE = false;
            console.log("insert", col);
        })
        .catch((err) => {
            console.log("error", err);
        });
};

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
                        console.log(inline_buttons_notes);
                        bot.sendMessage(msg.chat.id, "Todas las notas!", {
                            "reply_markup": {
                                "inline_keyboard": [
                                    inline_buttons_notes,
                                ],
                            }
                        });
                        /* bot.sendMessage(msg.chat.id, "Puede ir al menu anterior precionando atras.", {
                             "reply_markup": {
                                 resize_keyboard: true,
                                 "keyboard": keyboards.return_command
                             }
                         });*/
                    });
                    break;

                case COMMAD_NEW_NOTE:
                    const chatId = msg.chat.id;
                    flow.NEW_NOTE = true;
                    if (flow.NEW_NOTE) {
                        flow.NAME_NEW_NOTE = true;
                        bot.sendMessage(
                            chatId,
                            "Ingrese el nombre de la nota.", {
                                "reply_markup": {
                                    "keyboard": keyboards.return_command
                                }
                            }
                        );
                    }
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
            if (flow.NEW_NOTE && flow.NAME_NEW_NOTE) {
                trash = message;
                console.log("trash",trash);
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
