import {logger, sleep} from "../modules/jerryUtils.js";


export default {
    name: "typingStart",
    once: false,
    async execute(typing) {
        logger.append("info", "0x545053", `[TPS] '@${typing.user.tag}' started typing in '#${typing.channel.name}' in '${typing.guild.name}'!`);
    }
};
