process.env.NTBA_FIX_319 = 1

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')


const bot = new TelegramBot(process.env.TOKEN, {polling: true})

bot.on('message', msg=>{
    const {chat,text} = msg
    bot.sendMessage(chat.id, text)
})

bot.on('polling_error', console.log)
