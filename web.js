const express = require('express')

const port = process.env.PORT

const app = express()

app.use(express.json())

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

module.exports = (bot) => {
    app.post(`/bot${bot.token}`, (req, res) => {
        bot.processUpdate(req.body)
        res.sendStatus(200)
    })
}
