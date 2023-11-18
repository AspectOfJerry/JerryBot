import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        logger.append("info", "GMA", `'@${member.user.tag}' joined guild "${member.guild.id}"!`);
    }
};
