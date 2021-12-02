const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: { type: String, default: '', required: true },
    sentAt: { type: Date, default: () => Date.now() },
})

module.exports = mongoose.model('Message', MessageSchema)
