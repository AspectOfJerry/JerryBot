const fs = require('fs');
const date = require('date-and-time');

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

            // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─
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

module.exports = Log;
