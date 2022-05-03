const {Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {SlashCommandBuilder} = require("@discordjs/builders");

const Sleep = require('../../modules/sleep');
const Log = require('../../modules/logger');

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
        await Log(interaction.guild.id, `'${interaction.user.tag}' executed '/stop'.`, 'INFO');
        //Command information
        const REQUIRED_ROLE = "PL3";

        //Declaring variables
        const is_ephemeral = interaction.options.getBoolean('ephemeral') || false;
        await Log(interaction.guild.id, `├─ephemeral: ${is_ephemeral}`, 'DEBUG'); //Logs
        const reason = interaction.options.getString('reason') || "No reason provided";
        await Log(interaction.guild.id, `├─reason: ${reason}`, 'DEBUG');  //Logs

        //Checks
        if(!interaction.member.roles.cache.find(role => role.name == REQUIRED_ROLE)) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `You need at least the '${REQUIRED_ROLE}' role to use this command.`});

            interaction.reply({embeds: [error_permissions], ephemeral: is_ephemeral});
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
        await Log(interaction.guild.id, `├─Execution authotized. Waiting for the stop confirmation...`, 'DEBUG')

        const filter = (buttonInteraction) => {
            if(buttonInteraction.user.id = interaction.user.id) {
                return true;
            } else {
                return buttonInteraction.reply({content: "You cannot use this button", ephemeral: true});
            }
        }
        const stop_collector = interaction.channel.createMessageComponentCollector({filter, time: 30000});
        stop_collector.on('collect', async buttonInteraction => {
            //Disabling buttons
            row.components[0]
                .setDisabled(true);
            row.components[1]
                .setDisabled(true);
            interaction.editReply({embeds: [confirm_stop], components: [row], ephemeral: is_ephemeral});

            if(buttonInteraction.customId == 'stop_confirm_button') {
                await stop_collector.stop()
                const stopping_bot = new MessageEmbed()
                    .setColor('FUCHSIA')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setTitle('Stopping the bot')
                    .setDescription(`<@${interaction.user.id}> requested the bot to stop.`)
                    .addField('Reason', `${reason}`, false)
                    .addField('Requested at', `${interaction.createdAt}`, false)
                    .setFooter({text: "The NodeJS process will exit after this message."});

                await buttonInteraction.reply({embeds: [stopping_bot], ephemeral: is_ephemeral})
                await Log(interaction.guild.id, `└─'${interaction.user.tag}' authorized the stop request.`, 'DEBUG'); //Logs
                await client.destroy(); //Destroying the Discord client
                await Log(interaction.guild.id, `  ├─The client was destroyed.`, 'FATAL');    //Logs
                await Log(interaction.guild.id, `  └─The process will be terminated after this message.`, 'FATAL');   //Logs
                process.exit(0);    //Exiting here
            } else {
                const cancel_stop = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> aborted the stop request.`)

                await buttonInteraction.reply({embeds: [cancel_stop], ephemeral: is_ephemeral});
                await Log(interaction.guild.id, `└─'${buttonInteraction.user.tag}' aborted the stop request.`, 'INFO')
            }
            stop_collector.stop();
        })
    }
}
