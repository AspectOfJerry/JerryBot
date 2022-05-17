const {Client, Intents, Collection, MessageEmbed} = require('discord.js');

const Sleep = require('../modules/sleep'); //delayInMilliseconds;
const Log = require('../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

require('dotenv').config();
const process = require('process');

module.exports = {
    name: "guildMemberRemove",
    once: false,
    async execute(guildMember) {
        if(guildMember.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "🔄io")
            const leave_message = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User leave')
                .setDescription(`<@${guildMember.user.id}> left the guild!`)
                .setTimestamp();

            channel.send({embeds: [leave_message]});
        } else if(guildMember.guild.id == process.env.DISCORD_CRA_GUILD_ID) {
            const channel = guildMember.guild.channels.cache.find(channel => channel.name == "bienvenue")
            const leave_message = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${guildMember.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User leave')
                .setDescription(`<@${guildMember.user.id}> left the guild!`)
                .setTimestamp();

            channel.send({embeds: [leave_message]});
        }
    }
}