import fs from "fs";
import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";

import {logger, permissionCheck, sleep, cleanNumber} from "../../../utils/jerryUtils.js";


export default async function (client, interaction) {
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

    const input_row = new MessageActionRow()
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

    await interaction.reply({embeds: [prompt_embed], components: [input_row], fetchReply: true})
        .then(async (msg) => {
            const filter = (newInteraction) => {
                if(newInteraction.isButton() && newInteraction.custonId && newInteraction.user.id === interaction.user.id) {
                    return true;
                }
                newInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                logger.append("notice", "STDOUT", `'@${newInteraction.user.tag}' did not have the permission to use this button.`);
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
                                return eax + parseFloat(ebx);
                            }, 0); // eax: accumulator, ebx: current

                            const avg = sum / numbers.length;

                            const row = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setStyle("LINK")
                                        .setEmoji("📚")
                                        .setLabel("Arithmetic mean")
                                        .setURL("https://en.wikipedia.org/wiki/Arithmetic_mean")
                                );

                            const reply = new MessageEmbed()
                                .setColor("GREEN")
                                .setTitle("Math average")
                                .setDescription(`Here's the average:\n**>** ${avg}`)
                                .addFields(
                                    {name: "Sum of values", value: `${sum}`, inline: true},
                                    {name: "Number of values", value: `${numbers.length}`, inline: true},
                                    {name: "Cleaned input", value: `${clean_input}`, inline: false}
                                ).setImage("https://wikimedia.org/api/rest_v1/media/math/render/png/c7740a0aa91314dbf006e8583ce6f61585e3aab6");

                            modalSubmit.reply({embeds: [reply], components: [row]});
                        }).catch((err) => {
                            if(err.message.includes("time")) {
                                const timeout_exception = new MessageEmbed()
                                    .setColor("GREY")
                                    .setTitle("TimeoutException")
                                    .setDescription("Command expired. Please try again.");

                                interaction.editReply({embeds: [timeout_exception]});
                            }
                        });
                }).catch((err) => {
                    if(err.message.includes("time")) {
                        const timeout_exception = new MessageEmbed()
                            .setColor("GREY")
                            .setTitle("TimeoutException")
                            .setDescription("Command expired. Please try again.");

                        interaction.editReply({embeds: [timeout_exception]});
                    }
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
}
