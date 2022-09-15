// './schedule.json'
async function GetFullSchedule() {
    const file = require('./schedule.json');
    return file;
}
async function GetJourByDate(data) {
    console.log(data)
}

// './schedule_exceptions.json'
async function GetExceptions() {

}

module.exports = {
    GetFullSchedule,
    GetJourByDate,
    GetExceptions
};
