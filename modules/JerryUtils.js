const fs = require('fs');
const date = require('date-and-time');

/**
 * @module `Log` A module to interact with log files
 * @param {string} method The method to use {`append`, `read`}
 * @param {string} tag The tag at the beginning of the line
 * @param {string} string The main content
 * @param {string} type The type of the message {`DEBUG`, `ERROR`, `FATAL`, `INFO`, `WARN`}
 * @param {boolean} returnInfoOnly If the module should only return the object without performing any actions
 * @returns {object} `return_object`
 */
async function Log(method, tag, string, type, returnInfoOnly) {
    switch(method) {
        case "append": {
            // Declaring variables
            const now = new Date();

            let tagLenght = 0;
            let tagExtraIndentNum = 0;
            let tagExtraIndent = "";
            let typeLenght = 0;
            let typeExtraIndentNum = 0;
            let typeExtraIndent = "";

            // Get current date
            const now_date = date.format(now, 'YYYY-MM-DD');
            const now_time = date.format(now, 'HH:mm:ss.SSS');

            // Generate the log file name
            const file_name = `${now_date}_Discord-JerryBot.log`;

            // Generate the new line content
            if(tag == null) {
                tag = "------------------"
            }
            tagLenght = tag.length;
            tagExtraIndentNum = 19 - tagLenght;
            for(let i = 0; i < tagExtraIndentNum; i++) {
                tagExtraIndent = tagExtraIndent + " ";
            }

            // DEBUG, ERROR, FATAL, INFO, WARN; │, ─, ├─, └─
            if(!type) {
                type = "NULL";
            }
            typeLenght = type.length;
            typeExtraIndentNum = 5 - typeLenght;
            for(let i = 0; i < typeExtraIndentNum; i++) {
                typeExtraIndent = typeExtraIndent + " ";
            }

            string = `[${tagExtraIndent}${tag}] [${now_time}] [JerryBot/${type}]:${typeExtraIndent} ${string}`;

            // Only return info
            const return_object = {fileName: file_name, parsedString: string};
            if(returnInfoOnly) {
                return return_object;
            }

            // Append to file
            fs.appendFile(`./logs/${file_name}`, string + '\n', (err) => {
                if(err) {
                    throw err;
                }
            });
            return return_object;
        }
        case "read": {
            // Read stuff
        }
            break;
        default:
            throw "Unknown logging method.";
    }
};


/**
 * @module Sleep Sleep module
 * @async `await` must be used
 * @param {integer} delayInMsec The delay to wait for in milliseconds
 * @throws {TypeError} Throws if `delayInMsec` is `NaN`
 */
async function Sleep(delayInMsec) {
    if(isNaN(delayInMsec)) {
        throw TypeError("delayInMsec is not a number", 'sleep.js', 8);
    }
    await new Promise(resolve => setTimeout(resolve, delayInMsec));
};


/**
 * @module `ToNormalized` Removes accents from a string
 * @param {string} string The string to remove the accents from
 * @return {string} The normalized string
 */
async function ToNormalized(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


module.exports = {
    Log,
    Sleep,
    ToNormalized
};