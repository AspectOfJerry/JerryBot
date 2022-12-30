const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');

const {Log, Sleep} = require('../modules/JerryUtils');

require('dotenv').config();
const process = require('process');


module.exports = {
    name: "guildMemberRemove",
    once: false,
    async execute(member) {
        if(member.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
            const channel = member.guild.channels.cache.find(channel => channel.name == "🔄io")
            const leave_message = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User leave')
                .setDescription(`<@${member.user.id}> left the guild!`)
                .setTimestamp();

            channel.send({embeds: [leave_message]});
        } else if(member.guild.id == process.env.DISCORD_CRA_GUILD_ID) {
            const channel = member.guild.channels.cache.find(channel => channel.name == "bienvenue")
            const leave_message = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User leave')
                .setDescription(`<@${member.user.id}> left the guild!`)
                .setTimestamp();

            channel.send({embeds: [leave_message]});
        }
    }
};
