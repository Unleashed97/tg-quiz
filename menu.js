const menu = {
    start: {
        title: 'Hello, here you can find some quizzes',
        keyboard: [['Quizzes'], ['⚙️Settings']],
        quizzes: {
            title: 'Choose one of the following quizzes',
            keyboard: [
                ['European capitals', 'Asian capitals'],
                ['American capitals', 'Oceania capitals'],
                ['🔙back'],
            ],
        },
        settings: {
            title: 'Here you can change the language, etc',
            keyboard: [['🌐Language'], ['🔙back']],
        },
    },
}
module.exports = menu
