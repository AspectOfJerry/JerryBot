const process = require("process");
const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {logger, permissionCheck, sleep} = require("../../modules/jerryUtils.js");

module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Declaring variables
    const reason = interaction.options.getString("reason") ?? "No reason provided.";
    logger.append("info", "EXEC", `'/sudo stop' > reason: ${reason}`);
    const estop = interaction.options.getBoolean("estop") ?? false;
    logger.append("info", "EXEC", `'/sudo stop' > estop: ${estop}`);

    const payload_body = null;

    // Checks

    // Main
    let buttonRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("stop_confirm_button")
                .setLabel("Stop")
                .setStyle("DANGER")
                .setDisabled(false),
            new MessageButton()
                .setCustomId("stop_cancel_button")
                .setLabel("Cancel")
                .setStyle("SECONDARY")
                .setDisabled(false)
        );

    let overrideText = "";

    // const now = Math.round(Date.now() / 1000);
    // const auto_cancel_timestamp = now + 10;

    const confirm_stop = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Confirm Stop")
        .setDescription("Are you sure you want to stop the bot? Only the bot owner is able to restart the bot. Please use this command as last resort.")
        // .addFields(
        //     {name: "Auto cancel", value: `> :red_square: Canceling <t:${auto_cancel_timestamp}:R>*.`, inline: true}
        // ).setFooter({text: "*Relative timestamps look out of sync depending on your timezone."});
        .setFooter({text: "🟥 Canceling in 10s"});

    await interaction.reply({embeds: [confirm_stop], components: [buttonRow]});
    logger.append("debug", "EXEC", "'/sudo stop' > Waiting for confimation...");

    const filter = (buttonInteraction) => {
        if(buttonInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
            overrideText = ` (overriden by <@${buttonInteraction.user.id}>)`;
            logger.append("notice", "EXEC", `'/sudo stop' > '@${buttonInteraction.user.tag}' overrode the decision.`);
            return true;
        } else if(buttonInteraction.user.id === interaction.user.id) {
            return true;
        } else {
            buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
            logger.append("debug", "EXEC", `'/sudo stop' > '@${buttonInteraction.user.tag}' did not have the permission to use this button.`);
            return;
        }
    };

    const button_collector = interaction.channel.createMessageComponentCollector({filter, time: 10000});

    button_collector.on("collect", async buttonInteraction => {
        await buttonInteraction.deferUpdate();
        await button_collector.stop();
        // Disabling buttons
        buttonRow.components[0]
            .setDisabled(true);
        buttonRow.components[1]
            .setDisabled(true);

        if(buttonInteraction.customId == "stop_confirm_button") {
            const stopping_bot = new MessageEmbed()
                .setColor("FUCHSIA")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Stopping the bot")
                .setDescription(`<@${interaction.user.id}> requested the bot to stop${overrideText}.`)
                .addFields(
                    {name: "Reason", value: `${reason}`, inline: false},
                    {name: "Requested at", value: `${interaction.createdAt}`, inline: false}
                ).setFooter({text: "The process will exit after this message."});

            await interaction.editReply({embeds: [stopping_bot], components: [buttonRow]});
            logger.append("fatal", "EXEC", "'/sudo stop' > Request confirmed, stopping the bot...");
            await client.destroy(); // Destroying the Discord client
            await sleep(250);
            process.exit(0); // Exiting here
        } else {
            const cancel_stop = new MessageEmbed()
                .setColor("GREEN")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription(`<@${interaction.user.id}> aborted the stop request${overrideText}.`);

            interaction.editReply({embeds: [cancel_stop]});
            logger.append("info", "EXEC", `'/sudo stop' > '@${interaction.user.tag}' aborted the stop request${overrideText}.`);
        }
    });

    button_collector.on("end", (collected) => {
        // Disabling buttons
        buttonRow.components[0]
            .setDisabled(true);
        buttonRow.components[1]
            .setDisabled(true);

        if(collected.size === 0) {
            const auto_abort = new MessageEmbed()
                .setColor("DARK_GREY")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("Auto aborted.");

            interaction.editReply({embeds: [auto_abort], components: [buttonRow]});
            logger.append("notice", "EXEC", "'/sudo stop' > Auto aborted");
            return;
        }
    });
};
