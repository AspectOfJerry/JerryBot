const {log, sleep} = require("../modules/JerryUtils.js");


module.exports = {
    name: "typingStart",
    once: false,
    async execute(typing) {
        await log("append", "", `[0x545053] '@${typing.user.tag}' started typing in '#${typing.channel.name}' in '${typing.guild.name}'!`, "INFO");
    }
};
