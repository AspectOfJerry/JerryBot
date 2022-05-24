const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const process = require('process');
require('dotenv').config();

const fetch = require('node-fetch');

const Sleep = require('../../../modules/sleep'); //dedlayInMilliseconds;
const Log = require('../../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hypixel_api')
        .setDescription("Makes an API call to 'api.hypixel.net'.")
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

        let response_success;
        let response_record_owner;
        let response_record_limit;
        let response_record_queriesInPastMin;
        let response_record_totalQueries;
        //Checks

        //Code
        await fetch(`https://api.hypixel.net/key?key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then(res => res.json())
            .then(response => {
                response_success = String(response.success);

                if(response_success == "true") {
                    response_record_owner = String(response.record.owner);
                    response_record_limit = String(response.record.limit);
                    response_record_queriesInPastMin = String(response.record.queriesInPastMin);
                    response_record_totalQueries = String(response.record.totalQueries);
                } else if(response_success == "false") {
                    let error_response_cause = String(response.cause);

                    if(error_response_cause == "Invalid API key") {
                        const error_response_invalid_api_key = new MessageEmbed()
                            .setColor('RED')
                            .setTitle("Error")
                            .setDescription("The API key is invalid.")
                            .addField("Success", `${response_success}`, true)
                            .addField("Cause:", `${error_response_cause} (Error 403)`, true)
                            .setFooter({text: "Hypixel Public API", iconURL: "https://pbs.twimg.com/profile_images/1346968969849171970/DdNypQdN_400x400.png"})

                        interaction.reply({embeds: [error_response_invalid_api_key], ephemeral: is_ephemeral});
                        return;
                    } else if(error_response_cause == "Key throttle") {
                        const error_response_key_throttle = new MessageEmbed()
                            .setColor('RED')
                            .setTitle("Error")
                            .setDescription("The API key is throttled. Please try again in a minute.")
                            .addField("Success", `${response_success}`, true)
                            .addField("Cause", `${error_response_cause} (Error 429)`, true)
                            .setFooter({text: "Hypixel Public API", iconURl: "https://pbs.twimg.com/profile_images/1346968969849171970/DdNypQdN_400x400.png"})

                        interaction.reply({embeds: [error_response_key_throttle], ephemeral: is_ephemeral});
                        return;
                    }
                }

                let remainingQueries = response_record_limit - response_record_queriesInPastMin;
                const success_response = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle("Success")
                    .setDescription("A successful response was returned.\n" +
                        "<@611633988515266562> (AspectOfJerry) is the owner of the API key.")
                    .addField("Success", `${response_success}`, true)
                    .addField("Limit per minute", `${response_record_limit}`, true)
                    .addField("Queries in the last minute", `${response_record_queriesInPastMin}`, true)
                    .addField("Remaining queries this minute", `${remainingQueries}`, false)
                    .addField("Total queries", `${response_record_totalQueries}`, false)
                    .setFooter({text: "Hypixel Public API", iconURL: "https://pbs.twimg.com/profile_images/1346968969849171970/DdNypQdN_400x400.png"})

                interaction.reply({embeds: [success_response], ephemeral: is_ephemeral});
            })
    }
}
