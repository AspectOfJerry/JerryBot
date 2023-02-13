const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {Log, Sleep} = require("../modules/JerryUtils.js");

require('dotenv').config();
const process = require('process');


module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        if(member.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
            const channel = member.guild.channels.resolve("857850833982193665");

            const join_message = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle("User join")
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            member.roles.add("829896942208155678");
            Log("append", "guildMemberAdd", `'@${member.user.tag}' joined guild "${member.guild.id}"!`, "INFO");
        } else if(member.guild.id == process.env.DISCORD_CRA_GUILD_ID) {
            const channel = member.guild.channels.resolve("895116233626746943");

            const join_message = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            member.roles.add("895117433390641162");
            Log("append", "guildMemberAdd", `'@${member.user.tag}' joined guild "${member.guild.id}"!`, "INFO");
        } else if(member.guild.id == process.env.DISCORD_311_GUILD_ID) {
            member.roles.add("1070867071803609119");
            const channel = member.guild.channels.resolve("1014278986135781441");

            const join_message = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle("User join")
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            const prompt_verify = new MessageEmbed()
                .setColor("YELLOW")
                .setTitle("Identify")
                .setDescription("Please identify yourself by running </311 verify:1066510229619089469>");

            channel.send({embeds: [join_message, prompt_verify]});

            Log("append", "guildMemberAdd", `'@${member.user.tag}' joined guild "${member.guild.id}"!`, "INFO");
        }
    }
};
