const {Client, Intents, Collection, MessageEmbed} = require('discord.js');

const Sleep = require('../modules/sleep'); // delayInMilliseconds
const Log = require('../modules/logger'); // DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─

require('dotenv').config();
const process = require('process');

const date = require('date-and-time');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(guildMember) {
        const now = new Date();
        //const joinedTime = now.format('dd-mmm-yyyy hh:mm:ss.s')

        if(guildMember.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "🔄io");

            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${guildMember.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "GuildMember"));
            await Log('append', 'guildMemberAdd', `'${guildMember.user.tag}' joined guild '${guildMember.guild.id}'!`, 'INFO'); // Logs
        } else if(guildMember.guild.id == process.env.DISCORD_CRA_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "bienvenue");

            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${guildMember.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "Person"));
            await Log('append', 'guildMemberAdd', `'${guildMember.user.tag}' joined guild '${guildMember.guild.id}'!`, 'INFO'); // Logs
        } else if(guildMember.guild.id == process.env.DISCORD_311_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "welcome");

            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${guildMember.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "311"));
            await Log('append', 'guildMemberAdd', `'${guildMember.user.tag}' joined guild '${guildMember.guild.id}'!`, 'INFO'); // Logs
        }
    }
}
