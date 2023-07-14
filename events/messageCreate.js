import {logger, sleep} from "../modules/jerryUtils.js";
import {gpt} from "../modules/gpt.js";
import {slackcord} from "../edge/gateway/controllers/slackcord.js";


export default {
    name: "messageCreate",
    once: false, // Whether or not this event should only be triggered once
    async execute(message) {
        if(message.author.bot) {
            return;
        }

        const gpt_prefix = "gpt ";

        const gpt_channels = ["1103466639292370964"];
        const slack_channels = ["1066475581899813007"];

        if(message.content.startsWith(gpt_prefix) && !message.author.bot && gpt_channels.includes(message.channel.id)) {
            gpt(message, message.client);
        }

        /*
         * Slack
         */
        if(slack_channels.includes(message.channel.id)) {
            await slackcord.discordToSlack(message);
        }
    }
};
