const fs = require('fs');
const date = require('date-and-time');

module.exports = async function Log(tag, string, type, infoOnly) {
    //Declaring variables
    const now = new Date();

    let tagLenght = 0;
    let tagExtraIndentNum = 0;
    let tagExtraIndent = "";
    let typeLenght = 0;
    let typeExtraIndentNum = 0;
    let typeExtraIndent = "";

    //Get current date
    const now_date = date.format(now, 'YYYY-MM-DD');
    const now_time = date.format(now, 'HH:mm:ss.SSS');

    //Generate the log file name
    const file_name = `${now_date}_DiscordBot-Jerry-Bot.log`;

    //Generate the new line content
    tagLenght = tag.length;
    tagExtraIndentNum = 18 - tagLenght;
    for(let i = 0; i < tagExtraIndentNum; i++) {
        tagExtraIndent = tagExtraIndent + ">";
    }
    //Types: INFO, LOG, DEBUG, WARN, ERROR, FATAL
    if(!type) {
        type = "NULL";
    }
    typeLenght = type.length;
    typeExtraIndentNum = 5 - typeLenght;
    for(let i = 0; i < typeExtraIndentNum; i++) {
        typeExtraIndent = typeExtraIndent + " ";
    }

    string = `[${tagExtraIndent}${tag}] [${now_time}] [Jerry-Bot/${type}]:${typeExtraIndent} ${string}`;

    //Only return info
    const return_object = {fileName: file_name, parsedString: string};
    if(infoOnly) return return_object;

    //Append to file
    fs.appendFile(`./logs/${file_name}`, string + '\n', (err) => {if(err) throw err;});
    return return_object;
}