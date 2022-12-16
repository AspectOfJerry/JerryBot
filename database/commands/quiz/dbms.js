/**
 * @param {string} input The input string to check against
 * @param {string} answer The answer provided by `GetNewQuestion()`
 * @returns {boolean} Whether the input is correct
 */
async function CheckAnswer(input, answer) {

}

/**
 * @returns {[question: string, answer: string]} `return_array`
 */
async function GetNewQuestion() {
    const words = require('./ESP-quiz-define.json').words;

    const random_number = Math.floor(Math.random() * words.length - 1);

    const return_array = words[random_number];

    return return_array;
}

module.exports = {
    CheckAnswer,
    GetNewQuestion
}