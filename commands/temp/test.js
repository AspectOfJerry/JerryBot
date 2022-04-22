const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test command")
        .addUserOption((options) =>
            options
                .setName('user')
                .setDescription("User to test")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false))
    ,
    async execute(client, interaction) {
        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;

        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);

        //Checks

        //Code
        interaction.defer() //MAKE THE INTERACTION WAIT LONGER HERE
        await Sleep(1000)
        await interaction.channel.sendTyping()
        await Sleep(750)
        await interaction.channel.send({content: `Hey <@${interaction.user.id}>,`})
        await Sleep(250)
        await interaction.channel.sendTyping()
        await Sleep(1500)
        await interaction.channel.send({content: `Did you just try to kick <@${memberTarget.id}>?`})
        await Sleep(250)
        await interaction.channel.sendTyping()
        await Sleep(2000)
        await interaction.channel.send({content: "You know he's the developer of this bot, right?."})
        await Sleep(250)
        await interaction.channel.sendTyping()
        await Sleep(2000)
        await interaction.channel.send({content: "You know that your actions are completely intolerable and very rude, right?"})
        await Sleep(2000)
        const dev_immunity = new MessageEmbed()
            .setColor('RED')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`<@${memberTarget.id}> is immune to this command because they are bot developer (and because they are cool).`)
            .setFooter({text: "You can still manually ban him via his Discord profile but don't tell Jerry I told you this or else he be mad at me!"})

        await interaction.reply({embeds: [dev_immunity], ephemeral: false});
        await Sleep(250)
        await interaction.channel.sendTyping()
        await Sleep(500)
        await interaction.followUp({content: "Nice try though."})
        return;
    }
}
