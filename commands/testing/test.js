const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command")
        .addUserOption((options) =>
            options
                .setName("user")
                .setDescription("The user to disconnect.")
                .setRequired(false)
        )
    ,
    async execute(client, interaction) {
        let target = interaction.options.getUser('user') || interaction.member;
        let memberTarget = interaction.guild.members.cache.get(target.id);
        //Checks
        console.log(interaction.options.getUser('user'))
        //Code
        if(!memberTarget.voice.channel) {
            console.log("VOICE CHANNEL "+memberTarget.voice.channel)
            interaction.reply("is not")
            return;
        }
        interaction.reply("is in")
    }
}
