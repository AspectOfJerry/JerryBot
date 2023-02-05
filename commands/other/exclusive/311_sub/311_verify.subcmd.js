const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const weatherJs = require("weather-js");

const {PermissionCheck, Log, Sleep} = require("../../../../modules/JerryUtils");
const {execute} = require("../../../tests/0x01.test");


let collectedModal = false;

module.exports = async function (client, interaction) {
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables
    collectedModal = false;
    let selectMenu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId("select_menu")
                .setPlaceholder("Please select a group")
                .setMaxValues(1)
                .setMinValues(1)
                .addOptions([
                    {
                        label: "311",
                        value: "311",
                    },
                    {
                        label: "308",
                        value: "308",
                    },
                    {
                        label: "309",
                        value: "309",
                    },
                    {
                        label: "310",
                        value: "310",
                    },
                    {
                        label: "312",
                        value: "312",
                    },
                    {
                        label: "313",
                        value: "313",
                    }
                ])
        );

    let buttonRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("cancel_button")
                .setLabel("Cancel")
                .setStyle("SECONDARY")
                .setDisabled(false),
            new MessageButton()
                .setCustomId("confirm_button")
                .setLabel("Confirm")
                .setStyle("SUCCESS")
                .setDisabled(true)
        );

    const prompt_name = new Modal()
        .setCustomId('prompt_name')
        .setTitle("How should we call you (first name)?");

    const name_input = new TextInputComponent()
        .setCustomId('name')
        .setLabel("Your server nickname will be set to this.")
        .setStyle('SHORT');

    const first_row = new MessageActionRow().addComponents(name_input);

    prompt_name.addComponents(first_row);

    let group;
    let name;

    // Checks

    // Main
    let isOverriddenText = "";
    const filter = async (newInteraction) => {
        if(newInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
            isOverriddenText = ` (overriden by <@${newInteraction.user.id}>)`;
            await Log("append", interaction.guild.id, `├─'${newInteraction.user.tag}' overrode the decision.`, "WARN");
            return true;
        } else if(newInteraction.user.id == interaction.user.id) {
            return true;
        } else {
            await newInteraction.reply({content: "You cannot use this button.", ephemeral: true});
            await Log("append", interaction.guild.id, `├─'${newInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
            return;
        }
    };

    const prompt = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Verify")
        .setDescription("Step 1: Select your group number.\nStep 2: Enter your first name.")
        .setFooter({text: "The command expires in one minute."});

    const msg = await interaction.reply({embeds: [prompt], components: [selectMenu, buttonRow], fetchReply: true})
    const component_collector = await msg.createMessageComponentCollector({filter, time: 60000});

    component_collector.on("collect", async (componentInteraction) => {
        // Button
        if(componentInteraction.isButton()) {
            // Disable components

            if(componentInteraction.customId === "cancel_button") {
                await componentInteraction.deferUpdate();
                component_collector.stop();
                buttonRow.components[0]
                    .setDisabled(true);
                buttonRow.components[1]
                    .setDisabled(true);
                selectMenu.components[0]
                    .setDisabled(true);

                const cancel = new MessageEmbed()
                    .setColor('GREEN')
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the verify process${isOverriddenText}.`);

                interaction.editReply({embeds: [cancel], components: [selectMenu, buttonRow]});
                return;
            } else if(componentInteraction.customId === "confirm_button") {
                await componentInteraction.deferUpdate();
                component_collector.stop();
                buttonRow.components[0]
                    .setDisabled(true);
                buttonRow.components[1]
                    .setDisabled(true);

                await interaction.member.setNickname(name);
                const roles = require('../../../../database/commands/exclusive/verify/roles.json');
                const role_id = roles[group];
                await interaction.member.roles.add(role_id);

                const success = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(":tada: Welcome to the server!")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`You are now identified as ${name} in ${group}.`);

                interaction.editReply({embeds: [success], components: [selectMenu, buttonRow]});
                if(interaction.member.roles.cache.has("1070867071803609119")) {
                    interaction.member.roles.remove("1070867071803609119");
                }
                return;
            }
            // Select menu
        } else if(componentInteraction.isSelectMenu()) {
            // Disable select menu
            selectMenu.components[0]
                .setDisabled(true);

            if(componentInteraction.customId === "select_menu") {
                interaction.editReply({embeds: [prompt], components: [selectMenu, buttonRow]});
                group = componentInteraction.values.join("").toString();

                componentInteraction.showModal(prompt_name)

                await AwaitModal();
                console.log("AWAIT")
            }
        } else {
            throw "Unknown component interaction";
        }
    });

    async function AwaitModal() {
        client.once("interactionCreate", async (newInteraction) => {
            if(!newInteraction.isModalSubmit()) {
                await AwaitModal();
                console.log("RETURN");
                return;
            }

            newInteraction.deferUpdate();
            buttonRow.components[1]
                .setDisabled(false);

            name = newInteraction.fields.getTextInputValue("name");

            const confirm_selection = new MessageEmbed()
                .setColor("YELLOW")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("Confirm your input")
                .setDescription(`Please confirm the following data:`)
                .addFields(
                    {
                        name: "Name", value: `${name}`, inline: false
                    },
                    {
                        name: "Group", value: `${group}`, inline: false
                    }
                );

            interaction.editReply({embeds: [confirm_selection], components: [selectMenu, buttonRow]});
        });
    }

    component_collector.on("end", (collected, reason) => {
        if(reason === "time") {
            // Disable components
            buttonRow.components[0]
                .setDisabled(true);
            buttonRow.components[1]
                .setDisabled(true);
            selectMenu.components[0]
                .setDisabled(true);

            const expired = new MessageEmbed()
                .setColor("DARK_GREY")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('Verify')
                .setDescription(`The command has expired. Please execute </311 verify:${interaction.commandId}> again.`);

            interaction.editReply({embeds: [expired], components: [selectMenu, buttonRow]});
        }
    });
};
