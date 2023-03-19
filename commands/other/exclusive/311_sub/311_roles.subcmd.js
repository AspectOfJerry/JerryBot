const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {PermissionCheck, Log, Sleep} = require("../../../../modules/JerryUtils.js");


module.exports = async function (client, interaction) {
    if(await PermissionCheck(interaction) === false) {
        return;
    }

    // Declaring variables

    // Checks

    // Main
    const select_menu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId("select_menu")
                .setPlaceholder("Select a role")
                .setMinValues(1)
                .addOptions([
                    {
                        label: "announcement",
                        description: "[Recommended] Receive announcement pings.",
                        value: "announcement",
                        emoji: "📢"
                    },
                    {
                        label: "311 schedule",
                        description: "Pinged by the schedule announcer.",
                        value: "schedule",
                        emoji: "🗓️"
                    }
                ])
        );

    const filter = async (selectMenuInteraction) => {
        if(selectMenuInteraction.member.roles.highest.position > interaction.member.roles.highest.position) {
            isOverriddenText = ` (overriden by <@${selectMenuInteraction.user.id}>)`;
            await Log("append", interaction.guild.id, `├─'@${selectMenuInteraction.user.tag}' overrode the decision.`, "WARN");
            return true;
        } else if(selectMenuInteraction.user.id == interaction.user.id) {
            return true;
        } else {
            await selectMenuInteraction.reply({content: "You cannot use this button.", ephemeral: true});
            await Log("append", interaction.guild.id, `├─'@${selectMenuInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
            return;
        }
    };

    const prompt = new MessageEmbed()
        .setColor("YELLOW")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('Self-toggle roles')
        .setDescription('Select the roles you want to toggle in the dropdown menu.');

    await interaction.reply({embeds: [prompt], components: [select_menu], fetchReply: true})
        .then(async (msg) => {
            const select_menu_collector = await msg.createMessageComponentCollector({filter, componentType: "SELECT_MENU", time: 20000});

            select_menu_collector.on("collect", async (selectMenuInteraction) => {
                await selectMenuInteraction.deferUpdate();
                await select_menu_collector.stop();

                // Disabling select menu
                select_menu.components[0]
                    .setDisabled(true);

                if(selectMenuInteraction.customId == "select_menu") {
                    const selected = selectMenuInteraction.values;
                    let rolesAdded = [];
                    let rolesRemoved = [];

                    const roles = new Map();

                    roles.set("1054158881586155560", "announcement");
                    roles.set("1016500157480706191", "schedule");

                    for(const [id, name] of Object.entries(roles)) {
                        if(selected.includes(name)) {
                            if(!selectMenuInteraction.member.roles.cache.has(id)) {
                                await selectMenuInteraction.member.roles.add(id);
                                rolesAdded.push(name);
                            } else {
                                await selectMenuInteraction.member.roles.remove(id);
                                rolesRemoved.push(name);
                            }
                        }
                    }

                    const success_embed = new MessageEmbed()
                        .setColor("GREEN")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("Self-toggled roles")
                        .addFields(
                            {
                                name: "Roles added", value: `${() => {if(!rolesAdded) {return "None"} return rolesAdded;}}`, inline: false
                            },
                            {
                                name: "Roles removed", value: `${() => {if(!rolesRemoved) {return "None"} return rolesRemoved;}}`, inline: false
                            }
                        );

                    interaction.editReply({embeds: [success_embed], components: [select_menu]});
                }
            });

            select_menu_collector.on("end", (collected) => {
                if(collected.size === 0) {
                    // Disabling buttons
                    select_menu.components[0]
                        .setDisabled(true);

                    const expired = new MessageEmbed()
                        .setColor("DARK_GREY")
                        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                        .setTitle("Self-toggle roles")
                        .setDescription("Select the roles you want to toggle in the dropdown menu.");

                    interaction.editReply({embeds: [expired], components: [select_menu]});
                }
            });
        });
};
