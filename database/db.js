const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const Question = require('./models/Question')
const Quiz = require('./models/Quiz')
const User = require('./models/User')
const Message = require('./models/Message')

const url = `mongodb://admin:${process.env.DB_PSWD}@cluster0-shard-00-00.zdrhy.mongodb.net:27017,cluster0-shard-00-01.zdrhy.mongodb.net:27017,cluster0-shard-00-02.zdrhy.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-2xp7vn-shard-0&authSource=admin&retryWrites=true&w=majority`

const connection = async () => {
    try {
        await mongoose.connect(url)
        console.log('Database connected')
    } catch (err) {
        console.log(err)
    }
}

const addUser = async (id, firstName, lastName, username, languageCode) => {
    const userExists = await User.exists({ telegramId: id })
    if (!userExists) {
        try {
            const user = await User.create({
                telegramId: id,
                firstName,
                lastName,
                username,
                languageCode,
            })
            console.log('user created')
        } catch (e) {
            console.log(e.message)
        }
    } else {
        console.log('user already exists')
    }
}

const findOne = async (id, collection) => {
    try {
        if (collection === 'user') {
            collection = User
            query = { telegramId: id }
        } else if (collection === 'quiz') {
            collection = Quiz
            query = { id: id }
        } else if (collection === 'question') {
            collection = Question
            query = { id: id }
        }
        return await collection.findOne(query)
    } catch (e) {
        console.log(e.message)
    }
}

const updateOne = async (id, collection) => {}

const saveMessage = async (userId, messageText) => {
    try {
        const message = await Message.create({
            user: await findOne(userId, 'user').then((user) => user._id),
            message: messageText,
        })
        console.log('message saved')
    } catch (e) {
        console.log(e.message)
    }
}

const addQuiz = async (userId, quizId, region) => {
    try {
        const quiz = await Quiz.create({
            id: quizId,
            region,
            user: await findOne(userId, 'user').then((user) => user._id),
        })
        console.log('quiz added')
    } catch (e) {
        console.log(e.message)
    }
}

const addQuestion = async (
    quizId,
    questionId,
    title,
    correctAnswer,
    options,
) => {
    try {
        const question = await Question.create({
            id: questionId,
            quiz: await findOne(quizId, 'quiz').then((quiz) => quiz._id),
            title,
            correctAnswer,
            options: [...options],
        })
        console.log('question added')
    } catch (e) {
        console.log(e.message)
    }
}

const updateQuestion = async (questionId, userAnswer, isCorrect) => {
    try {
        const question = await Question.findOneAndUpdate(
            { id: questionId },
            {
                userAnswer,
                isCorrect,
            },
        )
        console.log('question updated')
    } catch (e) {
        console.log(e.message)
    }
}

const updateScore = async (quizId, score) => {
    try {
        const quiz = await Quiz.findOneAndUpdate(
            { id: quizId },
            {
                score,
            },
        )
        console.log('score updated')
    } catch (e) {
        console.log(e.message)
    }
}

module.exports = {
    connection,
    addUser,
    findOne,
    saveMessage,
    addQuiz,
    updateScore,
    addQuestion,
    updateQuestion,
}
