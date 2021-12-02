const mongoose = require('mongoose')

const QuizSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    region: String,
    hardMode: { type: Boolean, default: false },
    score: { type: String, default: '0/0' },
    isCompleted: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: () => Date.now() },
})

const Quiz = mongoose.model('Quiz', QuizSchema)

module.exports = Quiz
