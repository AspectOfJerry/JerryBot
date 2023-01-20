const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");

const date = require('date-and-time');

// './schedule.json'
async function GetFullSchedule() {
    const file = require('./schedule_311.json');
    return file;
}

// './schedule_exceptions.json'
async function GetExceptions() {
    const file = require('./schedule_311_exceptions.json');
    return file;
}

// Main
async function GetDate() {
    const now = new Date();
    return now;
}

async function GetFullDateString() {
    let _day = await GetDate();
    const day = date.format(_day, 'dddd, MMMM DD, YYYY');
    return day;
}

async function GetJourByDate() {
    const now = await GetDate();
    const full_schedule = await GetFullSchedule();

    const exceptions = await GetExceptions();

    let jour = 1;
    let firstDay = full_schedule.metadata.firstJourDate;
    let day = date.parse(firstDay, 'YYYY-MM-DD');
    let dayType = "SCO";

    await Sleep(500);

    main: while(!date.isSameDay(day, now)) {
        dayType = "SCO";
        if(day.toString().toLowerCase().startsWith('sat') || day.toString().toLowerCase().startsWith('sun')) {
            day = date.addDays(day, 1);
            dayType = "WEKN";
            await Sleep(5);
            continue main;
        }
        for(let [key, value] of Object.entries(exceptions)) {
            key = date.parse(key, 'YYYY-MM-DD');
            if(date.isSameDay(key, day)) {
                day = date.addDays(day, 1);
                dayType = value;
                await Sleep(5);
                continue main;
            }
        }

        day = date.addDays(day, 1);
        jour++;

        if(jour > 18) {
            jour = 1;
        }

        await Sleep(5);
    }

    dayType = "SCO";
    if(day.toString().toLowerCase().startsWith('sat') || day.toString().toLowerCase().startsWith('sun')) {
        dayType = "WEKN";
        return dayType;
    }

    for(let [key, value] of Object.entries(exceptions)) {
        key = date.parse(key, 'YYYY-MM-DD');
        if(date.isSameDay(key, day)) {
            dayType = value;
            return dayType;
        }
    }

    if(dayType == "SCO") {
        return jour;
    }
}

async function GetScheduleByJour(jour) {
    const full_schedule = await GetFullSchedule();

    for(let [key, value] of Object.entries(full_schedule)) {
        if(key.toLowerCase().endsWith(jour)) {
            return value;
        }
    }
}

async function GetFRCRemainingDays(startJour) {
    const schedule = await GetFullSchedule();

    const target_day = schedule.metadata.frcStartDate;
    // const target = schedule.metadata.frcEndDate;
    const target = date.parse(target_day, 'YYYY-MM-DD');

    const delta = Math.floor(date.subtract(target, startJour).toDays());
    return delta;
}

module.exports = {
    GetFullSchedule,
    GetExceptions,
    GetDate,
    GetFullDateString,
    GetFRCRemainingDays,
    GetJourByDate,
    GetScheduleByJour
};
