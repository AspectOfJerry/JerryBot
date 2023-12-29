import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "typingStart",
    once: false,
    async execute(typing) {
        logger.append("info", "TPS", `'@${typing.user.tag}' started typing in '#${typing.channel.name}' in '${typing.guild.name}'!`);
    }
};
