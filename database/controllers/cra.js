import fs from "fs";
import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";
import {createCraSchedule, getCraSchedule} from "../mongodb.js";
import {fileURLToPath} from "url";
import path from "path";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


// './schedule_exceptions.json'
async function getExceptions() {
    return await JSON.parse(fs.readFileSync(path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "../data/schedule/schedule_exceptions.json"
    )));
}

// Main
async function getFullDateString(date) {
    return dayjs(date).format("dddd, MMMM DD, YYYY");
}

async function getCdayByDate(cohort, date) {
    const full_schedule = await getCraSchedule(cohort);
    const startDate = dayjs(full_schedule.data.startDate);
    const endDate = dayjs(full_schedule.data.endDate);

    if(date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)) {
        const daysDifference = date.diff(startDate, "day");
        const weekdaysDifference = await excludeBreaks(startDate, daysDifference);

        console.log("daysDifference:", daysDifference);
        console.log("weekdaysDifference:", weekdaysDifference);

        const cycleDay = (weekdaysDifference % 18) + 1; // 18-day cycle
        return cycleDay;
    }

    // If the date is outside the school year
    return -1;
}

async function excludeBreaks(startDate, daysDifference) {
    // let weekdaysDelta = daysDifference;
    // const dayOfWeek = startDate.day();

    // console.log("dayOfWeek:", dayOfWeek);

    // if(dayOfWeek > 0) {
    //     weekdaysDelta -= dayOfWeek;
    // }

    // const fullWeeks = Math.floor(weekdaysDelta / 7);
    // console.log("fullWeeks:", fullWeeks);

    // const remainingDays = weekdaysDelta % 7;
    // console.log("remainingDays:", remainingDays);

    // weekdaysDelta = fullWeeks * 5 + Math.min(remainingDays, 5);

    const exceptions = await getExceptions();
    console.log("exceptions:", exceptions);

    let currentDate = startDate.clone();
    console.log("currentDate:", currentDate.format("YYYY-MM-DD"));

    console.log("ENTER LOOP");
    let weekdaysDifference = 0;

    while(daysDifference > 0) {
        currentDate = currentDate.add(1, "day");
        console.log(currentDate.day() !== 0, currentDate.day() !== 6, !exceptions[currentDate.format("YYYY-MM-DD")]);

        if(
            currentDate.day() !== 0 && // Not Sunday
            currentDate.day() !== 6 && // Not Saturday
            !exceptions[currentDate.format("YYYY-MM-DD")] // Not a specified day off
        ) {
            weekdaysDifference++;
            daysDifference--;
        }
    }

    console.log("Final weekdaysDifference:", weekdaysDifference);
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
