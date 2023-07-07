const fs = require("fs");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection} = require("@discordjs/voice");

const {logger, permissionCheck, sleep, cleanNumber} = require("../../../modules/jerryUtils.js");


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
        .setDescription("Press the button and enter the numbers **separated by a space**. Periods and commas are accepted for decimals.\n\nAnything that matches `/[^0-9\\s,.]/g` will be removed.")
        .setFooter({text: "You have 60s after to input the numbers after pressing the button."});

    await interaction.reply({embeds: [prompt_embed], components: [row], fetchReply: true})
        .then(async (msg) => {
            const filter = (newInteraction) => {
                if(newInteraction.isButton() && newInteraction.custonId && newInteraction.user.id === interaction.user.id) {
                    return true;
                }
                newInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                logger("notice", "STDOUT", `'@${newInteraction.user.tag}' did not have the permission to use this button.`);
                return;
            };

            msg.awaitMessageComponent(filter, {time: 30000})
                .then(async (newInteraction) => {
                    const filter = (newInteraction) => {
                        if(newInteraction.isModalSubmit() && newInteraction.customId === input_modal.customId) {
                            return true;
                        }
                        return false;
                    };

                    await newInteraction.showModal(input_modal);
                    newInteraction.awaitModalSubmit({filter, time: 60000})
                        .then((modalSubmit) => {
                            const clean_input = cleanNumber(modalSubmit.fields.getTextInputValue("input_numbers")).replace(/ +/g, " ");

                            const numbers = clean_input.split(" ");

                            const sum = numbers.reduce((eax, ebx) => {
                                console.log(`ADD EAX, ${ebx}`);
                                return eax + parseFloat(ebx);
                            }, 0); // eax: accumulator, ebx: current

                            const avg = sum / numbers.length;

                            const reply = new MessageEmbed()
                                .setColor("GREEN")
                                .setTitle("Math average")
                                .setURL("https://en.wikipedia.org/wiki/Average")
                                .setDescription(`Here's the average:\n**>** ${avg}`)
                                .addFields(
                                    {name: "Sum of values", value: `${sum}`, inline: true},
                                    {name: "Number of values", value: `${numbers.length}`, inline: true},
                                    {name: "Cleaned input", value: `${clean_input}`, inline: false}
                                ).setImage("https://wikimedia.org/api/rest_v1/media/math/render/png/c7740a0aa91314dbf006e8583ce6f61585e3aab6");

                            modalSubmit.reply({embeds: [reply]});
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
