const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {log, permissionCheck, sleep} = require("../../../modules/jerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, 1) === false) {
        return;
    }

    // Declaring variables
    const input_modal = new Modal()
        .setCustomId("input_modal")
        .setTitle("Number input");

    const numbers_input = new TextInputComponent()
        .setCustomId("input_numbers")
        .setLabel("LABEL")
        .setPlaceholder("List of numbers seperated by spaces. Commas and periods are accepted for decimals.")
        .setStyle("PARAGRAPH");

    const first_row = new MessageActionRow().addComponents(numbers_input);

    input_modal.addComponents(first_row);

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("prompt_button")
                .setLabel("Input")
                .setStyle("SUCCESS")
                .setDisabled(false)
        );

    // Checks

    // Main
    const prompt_embed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription("Press the button and enter the numbers **separated by a space**. Use periods and commas are accepted for decimals.");

    await interaction.reply({embeds: [prompt_embed], components: [row], fetchReply: true})
        .then(async (msg) => {
            const filter = (newInteraction) => {
                if(newInteraction.isButton() && newInteraction.custonId && newInteraction.user.id === interaction.user.id) {
                    return true;
                }
                newInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                log("append", interaction.guild.id, `├─'${newInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
                return;
            };

            msg.awaitMessageComponent(filter, {time: 30000})
                .then(async (newInteraction) => {
                    const filter = (newInteraction) => {
                        if(newInteraction.isModalSubmit() && newInteraction.customId === input_modal) {
                            return true;
                        }
                        return false;
                    };

                    await newInteraction.showModal(input_modal);
                    newInteraction.awaitModalSubmit({filter, time: 60000})
                        .then((modalSubmit) => {

                        }).catch((err) => {
                            if(err.message.includes("time")) {
                                // send timeout message
                            }
                        });
                });
        });

    // function AwaitModal() {
    //     client.once('interactionCreate', async (newInteraction) => {
    //         if(!newInteraction.isModalSubmit() && newInteraction.customId !== "input_modal") {
    //             AwaitModal();
    //             return;
    //         }

    //         const input_numbers = newInteraction.fields.getTextInputValue('input_numbers');

    //         await newInteraction.reply(`your input: ${input_numbers}`);
    //     });
    // }
};
