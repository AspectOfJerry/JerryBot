module.exports = async function Sleep(delayInMilliseconds) {
    if(isNaN(delayInMilliseconds)) {
        console.log(`sleep.js: Error: delayInMillisecond is NaN.`)
        return "isNaN";
    }
    await new Promise(resolve => setTimeout(resolve, delayInMilliseconds));
}
