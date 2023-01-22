/**
 * Sleep
 * @async `await` must be used.
 * @param {integer} delayInMsec The delay to wait for in milliseconds.
 * @throws {TypeError} Throws if `delayInMsec` is `NaN`.
 */
async function Sleep(delayInMsec) {
    if(isNaN(delayInMsec)) {
        throw TypeError("delayInMsec is not a number", 'sleep.js', 8);
    }
    await new Promise(resolve => setTimeout(resolve, delayInMsec));
}

module.exports = Sleep;
