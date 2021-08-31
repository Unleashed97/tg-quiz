process.env.NTBA_FIX_319 = 1

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.TOKEN, { polling: true })

const menu = {
    start: {
        title: 'Hello, here you can find some quizzes',
        keyboard: {
            reply_markup: {
                keyboard: [['Quizzes'], ['Settings']],
            },
        },
        quizzes: {
            title: 'Choose one of the following quizzes',
            keyboard: {
                reply_markup: {
                    keyboard: [
                        ['European capitals', 'Asian capitals'],
                        ['American capitals', 'Oceania capitals'],
                        ['back'],
                    ],
                },
            },
        },
        settings: {
            title: 'Here you can change the language, etc',
            keyboard: {
                reply_markup: {
                    keyboard: [['Language'], ['back']],
                },
            },
        },
    },
}

// commands
const COMMAND_START = 'start'
const COMMAND_HELP = 'help'

bot.onText(new RegExp(`/(.*)`), (msg, [source, match]) => {
    const { chat, text } = msg
    switch (match) {
        case COMMAND_START:
            bot.sendMessage(chat.id, `${menu.start.title}`, menu.start.keyboard)
            break
        case COMMAND_HELP:
            bot.sendMessage(chat.id, 'help', {
                reply_markup: {
                    remove_keyboard: true,
                },
            })
            break
        default:
            bot.sendMessage(
                chat.id,
                'I dont know this command, please try again or see /help',
            )
            break
    }
})

const countries = {
    europe: {
        Albania: 'Tirana',
        Andorra: 'Andorra la Vella',
        Austria: 'Vienna',
        Belarus: 'Minsk',
        Belgium: 'Brussels',
        'Bosnia and Herzegovina': 'Sarajevo',
        Bulgaria: 'Sofia',
        Croatia: 'Zagreb',
        Cyprus: 'Nicosia',
        'Czech Republic': 'Prague',
        Denmark: 'Copenhagen',
        Estonia: 'Tallinn',
        Finland: 'Helsinki',
        France: 'Paris',
        Germany: 'Berlin',
        Greece: 'Athens',
        Hungary: 'Budapest',
        Iceland: 'Reykjavík',
        Ireland: 'Dublin',
        Italy: 'Rome',
        Latvia: 'Riga',
        Liechtenstein: 'Vaduz',
        Lithuania: 'Vilnius',
        Luxembourg: 'Luxembourg',
        Macedonia: 'Skopje',
        Malta: 'Valletta',
        Moldova: 'Chișinău',
        Monaco: 'Monaco',
        Montenegro: 'Podgorica',
        Netherlands: 'Amsterdam',
        Norway: 'Oslo',
        Poland: 'Warsaw',
        Portugal: 'Lisbon',
        Kosovo: 'Pristina',
        Romania: 'Bucharest',
        Russia: 'Moscow',
        'San Marino': 'City of San Marino',
        Serbia: 'Belgrade',
        Slovakia: 'Bratislava',
        Slovenia: 'Ljubljana',
        Spain: 'Madrid',
        Sweden: 'Stockholm',
        Switzerland: 'Bern',
        Ukraine: 'Kiev',
        England: 'London',
    },
    asia: {
        Afghanistan: 'Kabul',
        Armenia: 'Yerevan',
        Azerbaijan: 'Baku',
        Bahrain: 'Manama',
        Bangladesh: 'Dhaka',
        Bhutan: 'Thimphu',
        Brunei: 'Bandar Seri Begawan',
        Cambodia: 'Phnom Penh',
        China: 'Beijing',
        Georgia: 'Tbilisi',
        India: 'New Delhi',
        Indonesia: 'Jakarta',
        Iran: 'Tehran',
        Iraq: 'Baghdad',
        Israel: 'Jerusalem',
        Japan: 'Tokyo',
        Jordan: 'Amman',
        Kazakhstan: 'Astana',
        Kuwait: 'Kuwait City',
        Kyrgyzstan: 'Bishkek',
        "Lao People's Democratic Republic": 'Vientiane',
        Lebanon: 'Beirut',
        Malaysia: 'Kuala Lumpur',
        Maldives: 'Malé',
        Mongolia: 'Ulan Bator',
        Myanmar: 'Naypyidaw',
        Nepal: 'Kathmandu',
        'North Korea': 'Pyongyang',
        Oman: 'Muscat',
        Pakistan: 'Islamabad',
        Palestine: 'Ramallah',
        Philippines: 'Manila',
        Qatar: 'Doha',
        'Saudi Arabia': 'Riyadh',
        Singapore: 'Singapore',
        'South Korea': 'Seoul',
        'Sri Lanka': 'Colombo',
        'Syrian Arab Republic': 'Damascus',
        Taiwan: 'Taipei',
        Tajikistan: 'Dushanbe',
        Thailand: 'Bangkok',
        'Timor-Leste': 'Dili',
        Turkey: 'Ankara',
        Turkmenistan: 'Ashgabat',
        'United Arab Emirates': 'Abu Dhabi',
        Uzbekistan: 'Tashkent',
        'Viet Nam': 'Hanoi',
        Yemen: "Sana'a",
    },
    america: {
        'Antigua and Barbuda': "Saint John's",
        Argentina: 'Buenos Aires',
        Bahamas: 'Nassau',
        Barbados: 'Bridgetown',
        Belize: 'Belmopan',
        Bolivia: 'Sucre',
        Brazil: 'Brasília',
        Canada: 'Ottawa',
        'Cayman Islands': 'George Town',
        Chile: 'Santiago',
        Colombia: 'Bogotá',
        'Costa Rica': 'San José',
        Cuba: 'Havana',
        Dominica: 'Roseau',
        'Dominican Republic': 'Santo Domingo',
        Ecuador: 'Quito',
        'El Salvador': 'San Salvador',
        Grenada: "St. George's",
        Guatemala: 'Guatemala City',
        Guyana: 'Georgetown',
        Haiti: 'Port-au-Prince',
        Honduras: 'Tegucigalpa',
        Jamaica: 'Kingston',
        Mexico: 'Mexico City',
        Nicaragua: 'Managua',
        Panama: 'Panama City',
        Paraguay: 'Asunción',
        Peru: 'Lima',
        'Puerto Rico': 'San Juan',
        'Saint Kitts and Nevis': 'Basseterre',
        'Saint Lucia': 'Castries',
        'Saint Vincent and the Grenadines': 'Kingstown',
        Suriname: 'Paramaribo',
        'Trinidad and Tobago': 'Port of Spain',
        'United States of America': 'Washington, D.C.',
        Uruguay: 'Montevideo',
        Venezuela: 'Caracas',
    },
    oceania: {
        Australia: 'Canberra',
        Fiji: 'Suva',
        Kiribati: 'South Tarawa',
        'Marshall Islands': 'Majuro',
        Nauru: 'Yaren',
        'New Zealand': 'Wellington',
        'Papua New Guinea': 'Port Moresby',
        Samoa: 'Apia',
        'Solomon Islands': 'Honiara',
        Tonga: "Nuku'alofa",
        Tuvalu: 'Funafuti',
        Vanuatu: 'Port Vila',
    },
}

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
let answers = []
let region = ''

function QuizQuestion(country, capital, options) {
    return {
        country: country,
        capital: capital,
        options: options,
    }
}

const quizGenerator = (region) => {
    const answersGeneration = (capital) => {
        answers.length = 0
        answers.push(capital)
        for (let i = 0; i < 3; i++) {
            let randomNumber = getRandomNumber(
                0,
                Object.values(countries[region]).length,
            )
            if (Object.values(countries[region])[randomNumber] === capital) {
                randomNumber = getRandomNumber(
                    0,
                    Object.values(countries[region]).length,
                )
                answers.push(Object.values(countries[region])[randomNumber])
            } else {
                answers.push(Object.values(countries[region])[randomNumber])
            }
        }
        return shuffleArray(answers)
    }

    shuffleArray(Object.entries(countries[region])).map(([key, value]) => {
        quizData.push(new QuizQuestion(key, value, answersGeneration(value)))
    })
}

const quiz = (chatId, region) => {
    quizGenerator(region)
    if (questionNumber < Object.values(countries[region]).length) {
        let keyboard = [
            [
                quizData[questionNumber].options[0],
                quizData[questionNumber].options[1],
            ],
            [
                quizData[questionNumber].options[2],
                quizData[questionNumber].options[3],
            ],
            ['exit'],
        ]
        let number = questionNumber
        bot.sendMessage(
            chatId,
            `<b>${++number}</b>/${
                Object.keys(countries[region]).length
            } What's the capital of ${quizData[questionNumber].country}`,
            {
                reply_markup: {
                    keyboard: keyboard,
                },
                parse_mode: 'HTML',
            },
        )
    } else {
        bot.sendMessage(chatId, `score: `, menu.start.keyboard)
        questionNumber = 0
    }
}

bot.on('message', (msg) => {
    const { chat, text } = msg
    switch (text) {
        case 'Quizzes':
            bot.sendMessage(
                chat.id,
                `${menu.start.quizzes.title}`,
                menu.start.quizzes.keyboard,
            )
            break
        case 'Settings':
            bot.sendMessage(
                chat.id,
                `${menu.start.settings.title}`,
                menu.start.settings.keyboard,
            )
            break
        case 'European capitals':
            region = 'europe'
            quiz(chat.id, region)
            break
        case 'Asian capitals':
            region = 'asia'
            quiz(chat.id, region)
            break
        case 'American capitals':
            region = 'america'
            quiz(chat.id, region)
            break
        case 'Oceania capitals':
            region = 'oceania'
            quiz(chat.id, region)
            break
        case answers[0]:
        case answers[1]:
        case answers[2]:
        case answers[3]:
            ++questionNumber
            quiz(chat.id, region)
            break
        case 'exit':
            questionNumber = 0
            region = ''
            quizData.length = 0
        case 'back':
            bot.sendMessage(chat.id, `${menu.start.title}`, menu.start.keyboard)
            break
    }
})

bot.on('polling_error', console.log)
