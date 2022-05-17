const {Client, Intents, Collection, MessageEmbed} = require('discord.js');

const Sleep = require('../modules/sleep'); //delayInMilliseconds;
const Log = require('../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

require('dotenv').config();
const process = require('process');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(guildMember) {
        if(guildMember.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "🔄io")
            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${guildMember.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});
            guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "GuildMember"))
        } else if(guildMember.guild.id == process.env.DISCORD_CRA_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "bienvenue")
            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${guildMember.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});
            guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "Person"));
        }
    }
}