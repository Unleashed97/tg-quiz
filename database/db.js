const mongoose = require('mongoose')

require('dotenv').config()

const start = async () => {
    try {
        await mongoose.connect(
            `mongodb://admin:${process.env.DB_PSWD}@cluster0-shard-00-00.zdrhy.mongodb.net:27017,cluster0-shard-00-01.zdrhy.mongodb.net:27017,cluster0-shard-00-02.zdrhy.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-2xp7vn-shard-0&authSource=admin&retryWrites=true&w=majority`,
        )
        console.log('Database connected')
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    dbConnect: start,
}
