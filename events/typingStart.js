const {Log, Sleep} = require('../modules/JerryUtils');

module.exports = {
    name: "typingStart",
    once: false,
    async execute(typing) {
        await Log('append', 'typingStart', `<@${typing.user.tag}> started typing in <#${typing.channel.name}> in <${typing.guild.name}>!`, 'INFO'); // Logs
    }
};
