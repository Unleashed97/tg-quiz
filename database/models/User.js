const { text } = require('express')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    telegramId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: '' },
    username: { type: String, required: true },
    languageCode: String,
    startedAt: { type: Date, immutable: true, default: () => Date.now() },
})

let User = mongoose.model('User', UserSchema)

module.exports = User
