async function Sleep(delayInMilliseconds) {
    if(isNaN(delayInMilliseconds)) {
        console.log(`sleep.js: Error: delayInMillisecond is NaN.`);
        throw "sleep.js: isNaN at delayInMilliseconds at sleep.js";
    }
    await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
};

module.exports = Sleep;
