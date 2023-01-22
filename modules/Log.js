const fs = require("fs");
const date = require('date-and-time');


/**
 * @async
 * @param {string} method The method to use {`append`, `read`}.
 * @param {string} tag The tag at the beginning of the line.
 * @param {string} body The main content.
 * @param {string} type The type of the message {`DEBUG`, `ERROR`, `FATAL`, `INFO`, `WARN`}.
 * @param {boolean} returnInfoOnly If the module should only return the object without performing any actions.
 * @returns {object} `return_object`.
 */
async function Log(method, tag, body, type, returnInfoOnly) {
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

            body = `[${tagExtraIndent}${tag}] [${now_time}] [JerryBot/${type}]:${typeExtraIndent} ${body}`;

            // Only return info
            const return_object = {fileName: file_name, parsedString: body};
            if(returnInfoOnly) {
                return return_object;
            }

            // Append to file
            fs.appendFile(`./logs/${file_name}`, body + '\n', (err) => {
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
}

module.exports = Log;