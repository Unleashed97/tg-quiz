const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
    category: String,
    questions: [
        {
            title: { type: String, required: true },
            correctAnswer: { type: String, required: true },
            userAnswer: { type: String, default: '' },
            isCorrect: Boolean,
        },
    ],
    hardMode: { type: Boolean, default: false },
    score: String,
    isCompleted: Boolean,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

const Quiz = mongoose.model('Quiz', QuizSchema)

module.exports = Quiz
