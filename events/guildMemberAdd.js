const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require('discord.js');

const {Log, Sleep} = require('../modules/JerryUtils');

require('dotenv').config();
const process = require('process');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        if(member.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
            const channel = member.guild.channels.cache.find(channel => channel.name == "🔄io");

            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            member.roles.add(member.guild.roles.cache.find(role => role.name == "member"));
            await Log('append', 'guildMemberAdd', `<@${member.user.tag}> joined guild <${member.guild.id}>!`, 'INFO'); // Logs
        } else if(member.guild.id == process.env.DISCORD_CRA_GUILD_ID) {
            const channel = member.guild.channels.cache.find(channel => channel.name == "bienvenue");

            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            member.roles.add(member.guild.roles.cache.find(role => role.name == "Person"));
            await Log('append', 'guildMemberAdd', `<@${member.user.tag}> joined guild <${member.guild.id}>!`, 'INFO'); // Logs
        } else if(member.guild.id == process.env.DISCORD_311_GUILD_ID) {
            const channel = member.guild.channels.cache.find(channel => channel.name == "🌎welcome");

            const join_message = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${member.user.displayAvatarURL({dynamic: true, size: 256})}`)
                .setTitle('User join')
                .setDescription(`<@${member.user.id}> joined the guild!`)
                .setTimestamp();

            channel.send({embeds: [join_message]});

            // member.roles.add(member.guild.roles.cache.find(role => role.name == "311"));
            await Log('append', 'guildMemberAdd', `<@${member.user.tag}> joined guild <${member.guild.id}>!`, 'INFO'); // Logs
        }
    }
};
