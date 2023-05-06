const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "typingStart",
    once: false,
    async execute(typing) {
        await log("append", "typingStart", `'@${typing.user.tag}' started typing in '#${typing.channel.name}' in '${typing.guild.name}'!`, "INFO");
    }
};
