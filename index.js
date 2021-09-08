process.env.NTBA_FIX_319 = 1

require('dotenv').config()

let bot = require('./bot')

require('./web')(bot)
