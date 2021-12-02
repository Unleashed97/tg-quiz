const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    title: { type: String, required: true },
    correctAnswer: { type: String, default: '', required: true },
    userAnswer: { type: String, default: '' },
    isCorrect: Boolean,
    options: [],
})

const Question = mongoose.model('Question', QuestionSchema)

module.exports = Question
