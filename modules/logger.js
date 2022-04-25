const fs = require('fs');
const date = require('date-and-time');

module.exports = async function Log(string, type, infoOnly) {
    //Declaring variables
    const now = new Date();

    //Get current date
    const now_date = date.format(now, 'YYYY-MM-DD');
    const now_time = date.format(now, 'HH:mm:ss.SSS');

    //Generate the log file name
    const file_name = `${now_date}_DiscordBot-Jerry-Bot.log`;

    //Generate the new line content
    //Types: INFO/GUILD, INFO/CHAT, INFO/LOG (intentional log), DEBUG, WARN, ERROR, FATAL
    if(!type) {
        type = "INFO/UNKNOWN";
    }
    string = `[${now_date}] [${now_time}] [Jerry-Bot/${type}]: ${string}`;

    //Only return info
    const return_object = {fileName: file_name, parsedString: string};
    if(infoOnly) return return_object;

    //Append to file
    fs.appendFile(`./logs/${file_name}`, string + '\n', (err) => {if(err) throw err;});
    return return_object;
}