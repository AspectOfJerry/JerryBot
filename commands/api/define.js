//https://api.dictionaryapi.dev/api/v2/entries/en/<word>
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const fetch = require('node-fetch');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription("Get the definition of a word.")
        .addStringOption((options) =>
            options
                .setName('string')
                .setDescription("[REQUIRED] the word to define.")
                .setRequired(true))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        //Command information
        const REQUIRED_ROLE = "everyone";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO');

        const word = interaction.options.getString('string')
        //Checks

        //Code
        const fetch_definition = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then(response => {
                res => res.json()
            }).then(async res => {
                if(res.title == "No Definitions Found") {
                    const unknown_word = new MessageEmbed()
                        .setColor('RED')
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                        .setTitle('Error')
                        .setDescription(`Unknown word: "${word}".`)

                    interaction.reply({emebds: [unknown_word], ephemeral: is_ephemeral})
                    return;
                }
                //To do
            })
    }
}
