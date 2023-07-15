import {log, permissionCheck, sleep} from "../../../../modules/jerryUtils.js";
import date from "date-and-time";

// './schedule.json'
async function GetFullSchedule() {
    const file = await import("./schedule_311.json");
    return file.default;
}

// './schedule_exceptions.json'
async function GetExceptions() {
    const file = await import("./schedule_311_exceptions.json");
    return file.default;
}

// Main
async function GetDate() {
    const now = new Date();
    return now;
}

async function GetFullDateString() {
    let _day = await GetDate();
    const day = date.format(_day, "dddd, MMMM DD, YYYY");
    return day;
}

async function getcDayByDate(date) {
    const _bench_start = performance.now();

    const full_schedule = await GetFullSchedule();
    const startDate = new Date(full_schedule.data.startDate);
    const endDate = new Date(full_schedule.data.endDate);

    if(date >= startDate && date <= endDate) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        const daysDifference = Math.floor((new Date(date) - startDate) / millisecondsPerDay);
        const weekdaysDifference = excludeBreaks(startDate, daysDifference);
        const cycleDay = (weekdaysDifference % 18) + 1; // 18-day cycle
        console.log("TIME ELAPSED NEW:" + performance.now() - _bench_start);
        return cycleDay;
    }

    // If the date is outside the school year
    return -1;
}

function excludeBreaks(startDate, daysDifference) {
    let weekdaysDifference = daysDifference;
    const dayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Adjust weekdaysDifference based on the day of the week of the startDate
    if(dayOfWeek > 0) {
        weekdaysDifference -= dayOfWeek - 1;
    }

    // Exclude weekends (Saturday and Sunday) from the weekdaysDifference
    const fullWeeks = Math.floor(weekdaysDifference / 7);
    const remainingDays = weekdaysDifference % 7;
    weekdaysDifference = fullWeeks * 5 + Math.min(remainingDays, 5);

    // Exclude specified days off
    const exceptions = {
        "2022-09-05": "exC",
        "2022-09-16": "exP",
        // ... add more dates as needed
    };

    const currentDate = new Date(startDate);

    while(weekdaysDifference > 0) {
        currentDate.setDate(currentDate.getDate() + 1);

        if(
            currentDate.getDay() !== 0 && // Not Sunday
            currentDate.getDay() !== 6 && // Not Saturday
            !exceptions[currentDate.toISOString().split("T")[0]] // Not a specified day off
        ) {
            weekdaysDifference--;
        }
    }

    return weekdaysDifference;
}

async function GetJourByDate() {
    const _bench_start = performance.now();

    const now = await GetDate();
    const full_schedule = await GetFullSchedule();

    // if(now >= new Date(full_schedule.metadata.lastJourDate)) {
    //     if(now == new Date(full_schedule.metadata.lastJourDate)) {
    //         return "EOY";
    //     }
    //     return "DISABLE";
    // }

    const exceptions = await GetExceptions();

    let jour = 1;
    let firstDay = full_schedule.metadata.firstJourDate;
    let day = date.parse(firstDay, "YYYY-MM-DD");
    let dayType = "SCO";

    outer: while(!date.isSameDay(day, now)) {
        dayType = "SCO";
        if(day.toString().toLowerCase().startsWith("sat") || day.toString().toLowerCase().startsWith("sun")) {
            day = date.addDays(day, 1);
            dayType = "WEKN";
            continue outer;
        }
        for(let [key, value] of Object.entries(exceptions)) {
            key = date.parse(key, "YYYY-MM-DD");
            if(date.isSameDay(key, day)) {
                day = date.addDays(day, 1);
                dayType = value;
                continue outer;
            }
        }

        day = date.addDays(day, 1);
        jour++;

        if(jour > 18) {
            jour = 1;
        }
    }

    dayType = "SCO";
    if(day.toString().toLowerCase().startsWith("sat") || day.toString().toLowerCase().startsWith("sun")) {
        dayType = "WEKN";
        console.log("ELAPSED TIME (OLD):" + performance.now() - _bench_start);
        return dayType;
    }

    for(let [key, value] of Object.entries(exceptions)) {
        key = date.parse(key, "YYYY-MM-DD");
        if(date.isSameDay(key, day)) {
            dayType = value;
            return dayType;
        }
    }

    if(dayType == "SCO") {
        console.log("ELAPSED TIME (OLD):" + performance.now() - _bench_start);
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

async function GetFRCDays(startJour) {
    const schedule = await GetFullSchedule();

    const target_day = schedule.metadata.frcEndDate;
    // const target = schedule.metadata.frcEndDate;
    const target = date.parse(target_day, "YYYY-MM-DD");

    const delta = Math.floor(date.subtract(target, startJour).toDays());
    return delta + 1; // + 1 to add the current day
}

export {
    GetFullSchedule,
    GetExceptions,
    GetDate,
    GetFullDateString,
    GetFRCDays,
    GetJourByDate,
    getcDayByDate,
    GetScheduleByJour
};
