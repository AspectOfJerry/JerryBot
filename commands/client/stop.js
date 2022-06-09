const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require('@discordjs/voice');

const Sleep = require('../../modules/sleep'); //delayInMilliseconds;
const Log = require('../../modules/logger'); //DEBUG, ERROR, FATAL, INFO, LOG, WARN; │, ─, ├─, └─;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription("Stops the bot.")
        .addStringOption((options) =>
            options
                .setName('reason')
                .setDescription("[OPTIONAL] The reason for the stop request.")
                .setRequired(false))
        .addBooleanOption((options) =>
            options
                .setName('ephemeral')
                .setDescription("[OPTIONAL] Whether you want the bot's messages to only be visible to yourself. Defaults to false.")
                .setRequired(false)),
    async execute(client, interaction) {
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/stop'.`, 'INFO'); //Logs

        //Permission check
        let MINIMUM_EXECUTION_ROLE = undefined;
        switch(interaction.guild.id) {
            case process.env.DISCORD_JERRY_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            case process.env.DISCORD_GOLDFISH_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "staff";
                break;
            case process.env.DISCORD_CRA_GUILD_ID:
                MINIMUM_EXECUTION_ROLE = "PL3";
                break;
            default:
                throw `Error: Bad permission configuration.`;
        }

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'INFO'); //Logs
        const reason = interaction.options.getString('reason') || "No reason provided";
        await Log(interaction.guild.id, `├─reason: ${reason}`, 'INFO');  //Logs

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == MINIMUM_EXECUTION_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${MINIMUM_EXECUTION_ROLE}' role to use this command.`});

            await interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
            await Log(interaction.guild.id, `└─'${interaction.user.id}' did not have the requried role to use '/stop'.`, 'WARN'); //Logs
            return;
        }

        //Code
        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('stop_confirm_button')
                    .setLabel(`Stop`)
                    .setStyle('DANGER')
                    .setDisabled(false),
                new MessageButton()
                    .setCustomId('stop_cancel_button')
                    .setLabel('Cancel')
                    .setStyle('PRIMARY')
                    .setDisabled(false))

        const confirm_stop = new MessageEmbed()
            .setColor('YELLOW')
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('Confirm Stop')
            .setDescription("Are you sure you want to stop the bot? Only the bot owner is able to restart the bot. Please use this command as last resort.")

        interaction.reply({embeds: [confirm_stop], components: [row], ephemeral: is_ephemeral})
        await Log(interaction.guild.id, `├─Execution authotized. Waiting for the stop confirmation...`, 'INFO')

        const filter = (buttonInteraction) => {
            if(buttonInteraction.user.id = interaction.user.id) {
                return true;
            } else {
                return buttonInteraction.reply({content: "You cannot use this button", ephemeral: true});
            }
        }

        const stop_button_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});
        stop_button_collector.on('collect', async buttonInteraction => {
            //Disabling buttons
            row.components[0]
                .setDisabled(true);
            row.components[1]
                .setDisabled(true);
            interaction.editReply({embeds: [confirm_stop], components: [row], ephemeral: is_ephemeral});

            if(buttonInteraction.customId == 'stop_confirm_button') {
                await stop_button_collector.stop()
                const _destroying_voice_connections = new MessageEmbed()
                    .setColor('YELLOW')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription("Destroying all active voice connections...")

                await buttonInteraction.reply({embeds: [_destroying_voice_connections], ephemeral: is_ephemeral});
                const stopping_bot = new MessageEmbed()
                    .setColor('FUCHSIA')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('Stopping the bot')
                    .setDescription(`<@${interaction.user.id}> requested the bot to stop.`)
                    .addField('Reason', `${reason}`, false)
                    .addField('Requested at', `${interaction.createdAt}`, false)
                    .setFooter({text: "The NodeJS process will exit after this message."});

                await buttonInteraction.editReply({embeds: [stopping_bot], ephemeral: is_ephemeral})
                await Log(interaction.guild.id, `└─'${interaction.user.tag}' authorized the stop request.`, 'INFO'); //Logs
                await Log(interaction.guild.id, `  ├─The client will be destroyed.`, 'FATAL'); //Logs
                await Log(interaction.guild.id, `  └─The process will be terminated.`, 'FATAL'); //Logs
                await Sleep(100);
                await client.destroy(); //Destroying the Discord client
                await Sleep(250);
                process.exit(0);    //Exiting here
            } else {
                const cancel_stop = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> aborted the stop request.`)

                await buttonInteraction.reply({embeds: [cancel_stop], ephemeral: is_ephemeral});
                await Log(interaction.guild.id, `└─'${buttonInteraction.user.tag}' aborted the stop request.`, 'INFO')
            }
            stop_button_collector.stop();
        })
    }
}
