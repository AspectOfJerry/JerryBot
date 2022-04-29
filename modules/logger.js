const fs = require('fs');
const date = require('date-and-time');

module.exports = async function Log(string, type, infoOnly) {
    //Declaring variables
    const now = new Date();

    let typeLenght;
    let extraIndentNum = 0;
    let extraIndent = "";

    //Get current date
    const now_date = date.format(now, 'YYYY-MM-DD');
    const now_time = date.format(now, 'HH:mm:ss.SSS');

    //Generate the log file name
    const file_name = `${now_date}_DiscordBot-Jerry-Bot.log`;

    //Generate the new line content
    //Types: INFO, LOG (commanded log), DEBUG (events), WARN (moderation), ERROR, FATAL
    if(!type) {
        type = "NULL";
    }
    typeLenght = type.length;
    extraIndentNum = 5 - typeLenght;

    for(let i = 0; i < extraIndentNum; i++) {
        extraIndent = extraIndent + " ";
    }

    string = `[${now_date}] [${now_time}] [Jerry-Bot/${type}]:${extraIndent} ${string}`;

    //Only return info
    const return_object = {fileName: file_name, parsedString: string};
    if(infoOnly) return return_object;

    //Append to file
    fs.appendFile(`./logs/${file_name}`, string + '\n', (err) => {if(err) throw err;});
    return return_object;
}