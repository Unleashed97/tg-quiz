const express = require('express')

const app = express()

app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = (bot) => {
    app.post(`/bot${bot.token}`, (req, res) => {
        bot.processUpdate(req.body)
        res.sendStatus(200)
    })
}
