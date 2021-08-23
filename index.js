process.env.NTBA_FIX_319 = 1

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TOKEN, {polling: true})

const menu = {
    start:{
        title: 'Hello, here you can find some quizzes',
        keyboard: {
            reply_markup:{
                keyboard:[
                    [
                        'Quizzes'
                    ],
                    [
                        'Settings'
                    ],
                ]
            }
        },
        quizzes:{
            title: 'Choose one of the following quizzes',
            keyboard: {
                reply_markup:{
                    keyboard:[
                        [
                            'European capitals',
                            'Asian capitals'
                        ],
                        [
                            'American capitals',
                            'African capitals',
                        ],
                        [
                            'back'
                        ]
                    ]
                }
            },
            questions: {
                title: 'Complete the quiz, you can also change the difficult mode',
                keyboard: {
                    reply_markup:{
                        keyboard:[
                            [
                                'Hard mode'
                            ],
                            [
                                'stop the quiz'
                            ]
                        ]
                    }
                }
            }
    
        },
        settings: {
            title: 'Here you can change the language, etc',
            keyboard: {
                reply_markup:{
                    keyboard: [
                        [
                            'Language'
                        ],
                        [
                            'back'
                        ]
                    ]
                }
            }
        },
    },
}

// commands
const COMMAND_START = 'start'
const COMMAND_HELP = 'help'


bot.onText(new RegExp(`/(.*)`), (msg, [source, match])=>{
    const {chat, text} = msg
    switch (match){
        case COMMAND_START:
            bot.sendMessage(chat.id, `${menu.start.title}`, menu.start.keyboard)
            break
        case COMMAND_HELP:
            bot.sendMessage(chat.id, 'help', {reply_markup:{
                remove_keyboard: true
            }})
            break
        default:
            bot.sendMessage(chat.id, 'I dont know this command, please try again or see /help')
            break

    }
})

bot.on('message', msg=>{
    const {chat, text} = msg
    switch(text){
        case 'Quizzes':
            bot.sendMessage(chat.id, `${menu.start.quizzes.title}`, menu.start.quizzes.keyboard)
            break
        case 'Settings':
            bot.sendMessage(chat.id, `${menu.start.settings.title}`, menu.start.settings.keyboard)
        case 'European capitals':
            bot.sendMessage(chat.id, `Start the quiz`, menu.start.quizzes.questions.keyboard)
            break
        case 'stop the quiz':
        case 'back':
            bot.sendMessage(chat.id, `${menu.start.title}`, menu.start.keyboard)
            break
    }
})

bot.on('polling_error', console.log)
