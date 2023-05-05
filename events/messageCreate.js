const {Log, Sleep} = require("../modules/JerryUtils.js");
const {gpt} = require("../modules/gpt");


module.exports = {
    name: "messageCreate",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        const gpt_prefix = "gpt ";

        const channels = ["1103466639292370964"];

        if(message.content.startsWith(gpt_prefix) && !message.author.bot && channels.includes(message.channel.id)) {
            gpt(message.content.slice(4));
        }
    }
};
