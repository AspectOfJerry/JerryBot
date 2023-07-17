import fs from "fs";
import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";
import {createCraSchedule, getCraSchedule} from "../mongodb.js";
import {fileURLToPath} from "url";
import path from "path";
import dayjs from "dayjs";

// './schedule_exceptions.json'
async function getExceptions() {
    return await JSON.parse(fs.readFileSync(path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../data/schedule/schedule_exceptions.json"
    )));
}

// Main
async function getFullDateString() {
    return dayjs().format("MMMM Do, YYYY");
}

async function getCdayByDate(cohort, date) {
    const _bench_start = performance.now();

    const full_schedule = await getCraSchedule(cohort);
    const startDate = new Date(full_schedule.data.startDate);
    const endDate = new Date(full_schedule.data.endDate);

    if(date >= startDate && date <= endDate) {
        const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
        const daysDifference = Math.floor((new Date(date) - startDate) / millisecondsPerDay);

        const weekdaysDifference = await excludeBreaks(startDate, daysDifference);

        const cycleDay = (weekdaysDifference % 18) + 1; // 18-day cycle
        console.log("TIME ELAPSED NEW:" + (performance.now() - _bench_start));
        return cycleDay;
    }

    // If the date is outside the school year
    return -1;
}

async function excludeBreaks(startDate, daysDifference) {
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
    const exceptions = await getExceptions();

    const currentDate = dayjs(startDate, "YYYY-MM-DD");

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

// async function getJourByDate(cohort) {
//     const _bench_start = performance.now();

//     // const now = await getDate();
//     const now = moment("2023-04-03", "YYYY-MM-DD").toDate();
//     const full_schedule = await getCraSchedule(cohort);

//     // if(now >= new Date(full_schedule.data.endDate)) {
//     //     if(now == new Date(full_schedule.data.endDate)) {
//     //         return "EOY";
//     //     }
//     //     return "DISABLE";
//     // }

//     const exceptions = await getExceptions();

//     let jour = 1;
//     const first_day = full_schedule.data.startDate;
//     let day = moment(first_day, "YYYY-MM-DD");
//     let dayType = "SCO";

//     outer: while(!moment(day, "YYYY-MM-DD").isSame(now, "YYYY-MM-DD", "day")) {
//         dayType = "SCO";
//         if(day.toString().toLowerCase().startsWith("sat") || day.toString().toLowerCase().startsWith("sun")) {
//             day = date.addDays(day, 1);
//             dayType = "WEKN";
//             continue outer;
//         }
//         for(let [key, value] of Object.entries(exceptions)) {
//             key = date.parse(key, "YYYY-MM-DD");
//             if(moment(key, "YYYY-MM-DD").isSame(now, "YYYY-MM-DD", "day")) {
//                 day = date.addDays(day, 1);
//                 dayType = value;
//                 continue outer;
//             }
//         }

//         day = date.addDays(day, 1);
//         jour++;

//         if(jour > 18) {
//             jour = 1;
//         }
//     }

//     dayType = "SCO";
//     if(day.toString().toLowerCase().startsWith("sat") || day.toString().toLowerCase().startsWith("sun")) {
//         dayType = "WEKN";
//         console.log("ELAPSED TIME (OLD):" + (performance.now() - _bench_start));
//         return dayType;
//     }

//     for(let [key, value] of Object.entries(exceptions)) {
//         key = date.parse(key, "YYYY-MM-DD");
//         if(date.isSameDay(key, day)) {
//             dayType = value;
//             return dayType;
//         }
//     }

//     if(dayType == "SCO") {
//         console.log("ELAPSED TIME (OLD):" + (performance.now() - _bench_start));
//         return jour;
//     }
// }


async function getScheduleByCday(cohort, cDay) {
    const full_schedule = await getCraSchedule(cohort);

    for(const [key, value] of Object.entries(full_schedule)) {
        if(key.toLowerCase().endsWith(cDay)) { // key = "cDay", + value
            return {
                cohort: cohort,
                cDay: value,
            };
        }
    }
}

export {
    getExceptions,
    getFullDateString,
    // getJourByDate,
    getCdayByDate,
    getScheduleByCday
};
