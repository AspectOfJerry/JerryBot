const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const process = require('process');
require('dotenv').config();

const fetch = require('node-fetch');

const {PermissionCheck, Log, Sleep} = require("../../../modules/JerryUtils");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hypixel_api')
        .setDescription("Makes an API call to 'api.hypixel.net'."),
    async execute(client, interaction) {
        await interaction.deferReply();

        // Set minimum execution role
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            case process.env.DISCORD_311_GUILD_ID:
                var MINIMUM_EXECUTION_ROLE = null;
                break;
            default:
                await Log('append', interaction.guild.id, "└─Throwing because of bad permission configuration.", 'ERROR');
                throw `Error: Bad permission configuration.`;
        }

        // Declaring variables
        let response_success;
        let response_record_owner;
        let response_record_limit;
        let response_record_queriesInPastMin;
        let response_record_totalQueries;

        // Checks
        // -----BEGIN ROLE CHECK-----
        if(MINIMUM_EXECUTION_ROLE !== null) {
            if(!interaction.member.roles.cache.find(role => role.name === MINIMUM_EXECUTION_ROLE)) {
                const error_permissions = new MessageEmbed()
                    .setColor('RED')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('PermissionError')
                    .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                    .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

                await interaction.editReply({embeds: [error_permissions]});
                await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
                return;
            }
        } // -----END ROLE CHECK-----

        // Main
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

                        interaction.editReply({embeds: [error_response_invalid_api_key]});
                        return;
                    } else if(error_response_cause == "Key throttle") {
                        const error_response_key_throttle = new MessageEmbed()
                            .setColor('RED')
                            .setTitle("Error")
                            .setDescription("The API key is throttled. Please try again in a minute.")
                            .addField("Success", `${response_success}`, true)
                            .addField("Cause", `${error_response_cause} (Error 429)`, true)
                            .setFooter({text: "Hypixel Public API", iconURl: "https://pbs.twimg.com/profile_images/1346968969849171970/DdNypQdN_400x400.png"})

                        interaction.editReply({embeds: [error_response_key_throttle]});
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

                interaction.editReply({embeds: [success_response]});
            });
    }
};
