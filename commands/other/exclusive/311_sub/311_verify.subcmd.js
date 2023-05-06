const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep} = require("../../../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    if(await permissionCheck(interaction, 0) === false) {
        return;
    }

    // Declaring variables
    const select_menu = new MessageActionRow()
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
                    }, {
                        label: "301",
                        value: "301",
                    }, {
                        label: "302",
                        value: "302",
                    }, {
                        label: "303",
                        value: "303",
                    }, {
                        label: "304",
                        value: "304",
                    }, {
                        label: "305",
                        value: "305",
                    }, {
                        label: "306",
                        value: "306",
                    }, {
                        label: "307",
                        value: "307",
                    }, {
                        label: "308",
                        value: "308",
                    }, {
                        label: "309",
                        value: "309",
                    }, {
                        label: "310",
                        value: "310",
                    }, {
                        label: "312",
                        value: "312",
                    }, {
                        label: "313",
                        value: "313",
                    }
                ])
        );

    const button_row = new MessageActionRow()
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
        .setCustomId("prompt_name")
        .setTitle("How should we call you (first name)?");

    const name_input = new TextInputComponent()
        .setCustomId("name")
        .setLabel("Your server nickname will be set to this.")
        .setStyle("SHORT");

    const first_row = new MessageActionRow().addComponents(name_input);

    prompt_name.addComponents(first_row);

    let group;
    let name;

    // Checks

    // Main
    let isOverriddenText = "";
    const filter = (newInteraction) => {
        if(newInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
            isOverriddenText = ` (overriden by <@${newInteraction.user.id}>)`;
            log("append", interaction.guild.id, `├─'${newInteraction.user.tag}' overrode the decision.`, "WARN");
            return true;
        } else if(newInteraction.user.id == interaction.user.id) {
            return true;
        }
        newInteraction.reply({content: "You cannot use this button.", ephemeral: true});
        log("append", interaction.guild.id, `├─'@${newInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
        return;
    };

    const prompt = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle("Verify")
        .setDescription("Step 1: Select your group number.\nStep 2: Enter your first name.")
        .setFooter({text: "The command expires in 30s."});

    const msg = await interaction.reply({embeds: [prompt], components: [select_menu, button_row], fetchReply: true});
    const component_collector = await msg.createMessageComponentCollector({filter, time: 30000});

    component_collector.on("collect", async (componentInteraction) => {
        // Button
        if(componentInteraction.isButton()) {
            if(componentInteraction.customId === "cancel_button") {
                await componentInteraction.deferUpdate();
                component_collector.stop();
                button_row.components[0]
                    .setDisabled(true);
                button_row.components[1]
                    .setDisabled(true);
                select_menu.components[0]
                    .setDisabled(true);

                const cancel = new MessageEmbed()
                    .setColor("GREEN")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                    .setDescription(`<@${interaction.user.id}> cancelled the verify process${isOverriddenText}.`);

                interaction.editReply({embeds: [cancel], components: [select_menu, button_row]});
                return;
            } else if(componentInteraction.customId === "confirm_button") {
                await componentInteraction.deferUpdate();
                component_collector.stop();
                button_row.components[0]
                    .setDisabled(true);
                button_row.components[1]
                    .setDisabled(true);

                await interaction.member.setNickname(name);
                const roles = require("../../../../database/commands/exclusive/verify/roles.json");
                const role_id = roles[group];
                await interaction.member.roles.add(role_id);

                const success = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(":tada: Welcome to the server!")
                    .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                    .setDescription(`You are now identified as ${name} in ${group}.`);

                interaction.editReply({embeds: [success], components: [select_menu, button_row]});
                if(interaction.member.roles.cache.has("1070867071803609119")) {
                    interaction.member.roles.remove("1070867071803609119");
                }
                return;
            }
            // Select menu
        } else if(componentInteraction.isSelectMenu()) {
            // Disable select menu
            select_menu.components[0]
                .setDisabled(true);

            if(componentInteraction.customId === "select_menu") {
                interaction.editReply({embeds: [prompt], components: [select_menu, button_row]});
                group = componentInteraction.values.join("").toString();

                await componentInteraction.showModal(prompt_name);

                AwaitModal();
            }
        } else {
            throw "Unknown component interaction";
        }
    });

    function AwaitModal() {
        client.once("interactionCreate", async (newInteraction) => {
            if(!newInteraction.isModalSubmit() && !newInteraction.isButton()) {
                AwaitModal();
                return;
            } else if(newInteraction.isButton() && newInteraction.customId === "cancel_button" && newInteraction.user.id === interaction.user.id && newInteraction.channel.id === interaction.channel.id) {
                return;
            }

            if(newInteraction.user.id !== interaction.user.id && newInteraction.channel.id !== interaction.channel.id && newInteraction.customId !== "prompt_name") {
                throw "Information mismatch. Please try again.";
            }

            newInteraction.deferUpdate();

            button_row.components[1]
                .setDisabled(false);

            name = newInteraction.fields.getTextInputValue("name");

            const confirm_selection = new MessageEmbed()
                .setColor("YELLOW")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setTitle("Confirm your input")
                .setDescription("Please confirm the following data: ")
                .addFields(
                    {
                        name: "Name", value: `${name}`, inline: false
                    },
                    {
                        name: "Group", value: `${group}`, inline: false
                    }
                );

            interaction.editReply({embeds: [confirm_selection], components: [select_menu, button_row]});
        });
    }

    component_collector.on("end", (collected, reason) => {
        if(reason === "time") {
            // Disable components
            button_row.components[0]
                .setDisabled(true);
            button_row.components[1]
                .setDisabled(true);
            select_menu.components[0]
                .setDisabled(true);

            const expired = new MessageEmbed()
                .setColor("DARK_GREY")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Verify")
                .setDescription(`The command has expired. Please execute </311 verify:${interaction.commandId}> again.`);

            interaction.editReply({embeds: [expired], components: [select_menu, button_row]});
        }
    });
};
