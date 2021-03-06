const TelegramBot = require('node-telegram-bot-api')

const { v4: uuidv4 } = require('uuid')

const token = process.env.TOKEN
const url = process.env.URL

let bot

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token)
    bot.setWebHook(url + token)
} else {
    bot = new TelegramBot(token, { polling: true })
}

const en = require('./locales/en.json')
const ru = require('./locales/ru.json')

let i18n = en

// commands
const COMMAND_START = 'start'
const COMMAND_HELP = 'help'
const COMMAND_LANGUAGE = 'language'

bot.setMyCommands([
    { command: 'start', description: `${i18n.command.start}` },
    { command: 'help', description: 'about this bot' },
    { command: 'language', description: `${i18n.command.languge}` },
])

const {
    connection,
    addUser,
    addQuiz,
    updateScore,
    addQuestion,
    updateQuestion,
} = require('./database/db')

connection()

bot.onText(new RegExp(`/(.*)`), (msg, [source, match]) => {
    const {
        from: { id, first_name, last_name, username, language_code },
        chat,
        text,
    } = msg

    if (msg.from.language_code === 'en') {
        i18n = en
    } else if (msg.from.language_code === 'ru') {
        i18n = ru
    }

    switch (match) {
        case COMMAND_START:
            addUser(id, first_name, last_name, username, language_code)

            bot.sendMessage(chat.id, `${i18n.menu.start.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.keyboard,
                },
            })
            break
        case COMMAND_HELP:
            bot.sendMessage(chat.id, i18n.command.help, {
                reply_markup: {
                    remove_keyboard: true,
                },
            })
            break
        case COMMAND_LANGUAGE:
            bot.sendMessage(chat.id, i18n.menu.start.languages.title, {
                reply_markup: {
                    keyboard: i18n.menu.start.languages.keyboard,
                },
            })
            break
        default:
            bot.sendMessage(chat.id, i18n.command.other)
            break
    }
})

const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

const quizData = []
let questionNumber = 0
let score = 0
let buttons = []
let region = ''

let quizId = null
let questionId = null

const getQuizId = () => {
    quizId = uuidv4()
    return quizId
}

const getQuestionId = () => {
    questionId = uuidv4()
    return questionId
}

function QuizQuestion(country, capital, options, isRight) {
    return {
        country: country,
        capital: capital,
        options: options,
        isRight: isRight,
    }
}

const quizGenerator = (region) => {
    const answersGeneration = (capital) => {
        let answers = []
        answers.push(capital)
        for (let i = 0; i < 3; i++) {
            let randomNumber = getRandomNumber(
                0,
                Object.values(i18n.countries[region]).length,
            )

            while (
                answers.includes(
                    Object.values(i18n.countries[region])[randomNumber],
                )
            ) {
                randomNumber = getRandomNumber(
                    0,
                    Object.values(i18n.countries[region]).length,
                )
            }

            answers.push(Object.values(i18n.countries[region])[randomNumber])
        }
        return shuffleArray(answers)
    }

    shuffleArray(Object.entries(i18n.countries[region])).map(([key, value]) => {
        quizData.push(
            new QuizQuestion(key, value, answersGeneration(value), null),
        )
    })
}

const getScore = (chatId, text) => {
    if (text === quizData[questionNumber].capital) {
        quizData[questionNumber].isRight = true
        ++score
        bot.sendMessage(chatId, `<b>${i18n.quiz.answerCorrect}</b>`, {
            parse_mode: 'HTML',
        })
    } else {
        quizData[questionNumber].isRight = false
        message = bot.sendMessage(
            chatId,
            `<b>${i18n.quiz.answerWrong}</b> ${i18n.quiz.correctAnswer} <b>${quizData[questionNumber].capital}</b>`,
            {
                parse_mode: 'HTML',
            },
        )
    }
    updateQuestion(questionId, text, quizData[questionNumber].isRight)
    updateScore(quizId, `${score}/${Object.keys(quizData).length}`)
}

const quiz = (chatId, region) => {
    if (quizData.length === 0) {
        quizGenerator(region)
    }

    if (questionNumber < quizData.length) {
        let keyboard = [
            [
                quizData[questionNumber].options[0],
                quizData[questionNumber].options[1],
            ],
            [
                quizData[questionNumber].options[2],
                quizData[questionNumber].options[3],
            ],
            [`${i18n.quiz.exit}`],
        ]

        buttons = [
            quizData[questionNumber].options[0],
            quizData[questionNumber].options[1],
            quizData[questionNumber].options[2],
            quizData[questionNumber].options[3],
        ]

        addQuestion(
            quizId,
            getQuestionId(),
            `${i18n.quiz.question} ${quizData[questionNumber].country}`,
            quizData[questionNumber].capital,
            quizData[questionNumber].options,
        )

        bot.sendMessage(
            chatId,
            `<b>${questionNumber + 1}</b>/${
                Object.keys(i18n.countries[region]).length
            } ${i18n.quiz.question} ${quizData[questionNumber].country}`,
            {
                reply_markup: {
                    keyboard: keyboard,
                },
                parse_mode: 'HTML',
            },
        )
    } else {
        bot.sendMessage(
            chatId,
            `${i18n.quiz.score} ${score}/${
                Object.keys(i18n.countries[region]).length
            }`,
            {
                reply_markup: {
                    keyboard: i18n.menu.start.keyboard,
                },
            },
        )
        questionNumber = 0
        quizData.length = 0
        score = 0
    }
}

bot.on('message', (msg) => {
    const {
        chat,
        text,
        message_id,
        from: { id },
    } = msg
    switch (text) {
        case `${i18n.buttons.quizzes}`:
            bot.sendMessage(chat.id, `${i18n.menu.start.quizzes.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.quizzes.keyboard,
                },
            })
            break
        case `${i18n.buttons.settings}`:
            bot.sendMessage(chat.id, `${i18n.menu.start.settings.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.settings.keyboard,
                },
            })
            break
        case `${i18n.buttons.language}`:
            bot.sendMessage(chat.id, `${i18n.menu.start.languages.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.languages.keyboard,
                },
            })
            break
        case `${i18n.buttons.english}`:
            i18n = en
            bot.sendMessage(chat.id, `${i18n.menu.start.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.keyboard,
                },
            })
            break
        case `${i18n.buttons.russian}`:
            i18n = ru
            bot.sendMessage(chat.id, `${i18n.menu.start.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.keyboard,
                },
            })
            break
        case `${i18n.buttons.europeCapitals}`:
            region = 'europe'
            // createQuiz(region, id)
            addQuiz(id, getQuizId(), region).then(() => quiz(chat.id, region))
            break
        case `${i18n.buttons.asianCapitals}`:
            region = 'asia'
            addQuiz(id, getQuizId(), region).then(() => quiz(chat.id, region))
            break
        case `${i18n.buttons.americanCapitals}`:
            region = 'america'
            addQuiz(id, getQuizId(), region).then(() => quiz(chat.id, region))
            break
        case `${i18n.buttons.oceaniaCapitals}`:
            region = 'oceania'
            addQuiz(id, getQuizId(), region).then(() => quiz(chat.id, region))
            break
        case `${i18n.buttons.africanCapitals}`:
            region = 'africa'
            addQuiz(id, getQuizId(), region).then(() => quiz(chat.id, region))
            break
        case buttons[0]:
        case buttons[1]:
        case buttons[2]:
        case buttons[3]:
            getScore(chat.id, text)
            ++questionNumber
            setTimeout(() => {
                quiz(chat.id, region)
            }, 100)
            break
        case `${i18n.buttons.exit}`:
            questionNumber = 0
            region = ''
            quizData.length = 0
            score = 0
        case `${i18n.buttons.back}`:
            bot.sendMessage(chat.id, `${i18n.menu.start.title}`, {
                reply_markup: {
                    keyboard: i18n.menu.start.keyboard,
                },
            })
            break
    }
})

bot.on('polling_error', console.log)

module.exports = bot
