import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, sleep} from "../utils/jerryUtils.js";


export default {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        if(member.guild.id === "631939549332897842") { // devServer
            const channel = member.guild.channels.resolve("857850833982193665");

            const join_message = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle("User join")
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            member.roles.add("829896942208155678");
        }

        logger.append("info", "0x474D41", `[GMA] '@${member.user.tag}' joined guild "${member.guild.id}"!`);
    }
};
