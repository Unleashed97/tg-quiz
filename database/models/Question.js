const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    questionId: ObjectId,
    title: { type: String, required: true },
    options: [],
})

const Question = mongoose.model('Question', QuestionSchema)

module.exports = Question
