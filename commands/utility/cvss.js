import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("cvss")
        .setDescription("Common Vulnerability Scoring System Calculator"),
    async execute(client, interaction) {
        // interaction.deferReply()
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables
        const cvss = new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle("Common Vulnerability Scoring System score calculator")
            .setDescription("Start by selecting the Attack Vector.\n\n• CVSS Vector string: `CVSS:3.1/AV:...`")
            .addFields(
                {name: "-> Attack Vector (AV)", value: "Network / Adjacent / Local / Physical", inline: false},
                {name: "Attack Complexity (AC)", value: "Low / High", inline: false},
                {name: "Privileges Required (PR)", value: "None / Low / High", inline: false},
                {name: "User Interaction (UI)", value: "None / Required", inline: false},
                {name: "Scope (S)", value: "Unchanged / Changed", inline: false},
                {name: "Confidentiality (C)", value: "High / Low / None", inline: false},
                {name: "Integrity (I)", value: "High / Low / None", inline: false},
                {name: "Availability (A)", value: "High / Low / None", inline: false}
            );

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("select_menu")
                    .setPlaceholder("Select the attack vector (AV)")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions([
                        {
                            label: "Network (N)",
                            value: "Network",
                            emoji: "🔴"
                        }, {
                            label: "Adjacent (A)",
                            value: "Adjacent",
                            emoji: "🟡"
                        }, {
                            label: "Local (L)",
                            value: "Local",
                            emoji: "🟢"
                        }, {
                            label: "Physical (L)",
                            value: "Physical",
                            emoji: "⚪"
                        }
                    ])
            );

        const filter = async (newInteraction) => {
            if(newInteraction.user.id === interaction.user.id && newInteraction.isSelectMenu()) {
                return true;
            } else {
                await newInteraction.reply({content: "You cannot use this component.", ephemeral: true});
                await log("append", interaction.guild.id, `├─'${newInteraction.user.tag}' did not have the permission to use this component.`, "WARN");
                return;
            }
        };

        async function AwaitSelectMenu(message) {
            let result;
            await message.awaitMessageComponent(filter, {time: 15000})
                .then(async (newInteraction) => {
                    newInteraction.deferUpdate();
                    result = newInteraction.values.join("").toString();
                }).catch((err) => {
                    console.error(err);
                });

            return result;
        }

        // Checks

        // Main
        const av_message = await interaction.reply({embeds: [cvss], components: [row], fetchReply: true});
        const av = await AwaitSelectMenu(av_message);

        cvss.setDescription(`Select the attack complexity\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:...\``);
        cvss.spliceFields(0, 2,
            {name: "Attack Vector (AV)", value: `• ${av}`, inline: false},
            {name: "-> Attack Complexity (AC)", value: "Low / High", inline: false}
        );
        row.components[0].setPlaceholder("Select the attack complexity (AC)");
        row.components[0].setOptions([
            {
                label: "Low (L)",
                value: "Low",
                emoji: "🔴"
            }, {
                label: "High (H)",
                value: "High",
                emoji: "🟢"
            }
        ]);

        const ac_message = await interaction.editReply({embeds: [cvss], components: [row]});
        const ac = await AwaitSelectMenu(ac_message);

        cvss.setDescription(`Select the privileges required\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:...\``);
        cvss.spliceFields(1, 2,
            {name: "Attack Complexity (AC)", value: `• ${ac}`, inline: false},
            {name: "-> Privileges Required (PR)", value: "None / Low / High", inline: false}
        );
        row.components[0].setPlaceholder("Select the privileges required (PR)");
        row.components[0].setOptions([
            {
                label: "None (N)",
                value: "None",
                emoji: "🔴"
            }, {
                label: "Low (L)",
                value: "Low",
                emoji: "🟡"
            }, {
                label: "High (H)",
                value: "High",
                emoji: "🟢"
            }
        ]);

        const pr_message = await interaction.editReply({embeds: [cvss], components: [row]});
        const pr = await AwaitSelectMenu(pr_message);

        cvss.setDescription(`Select the user interaction\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:${pr.charAt(0)}/UI:...\``);
        cvss.spliceFields(2, 2,
            {name: "Privileges Required (PR)", value: `• ${pr}`, inline: false},
            {name: "-> User Interaction (UI)", value: "None / Required", inline: false}
        );
        row.components[0].setPlaceholder("Select the user interaction (UI)");
        row.components[0].setOptions([
            {
                label: "None (N)",
                value: "None",
                emoji: "🔴"
            }, {
                label: "Required (R)",
                value: "Required",
                emoji: "🟢"
            }
        ]);

        const ui_message = await interaction.editReply({embeds: [cvss], components: [row]});
        const ui = await AwaitSelectMenu(ui_message);

        cvss.setDescription(`Select the scope\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:${pr.charAt(0)}/UI:${ui.charAt(0)}/S:...\``);
        cvss.spliceFields(3, 2,
            {name: "User Interaction (UI)", value: `• ${ui}`, inline: false},
            {name: "-> Scope (S)", value: "Unchanged / Changed", inline: false}
        );
        row.components[0].setPlaceholder("Select the scope (S)");
        row.components[0].setOptions([
            {
                label: "Unchanged (U)",
                value: "Unchanged",
                emoji: "🟢"
            }, {
                label: "Changed (C)",
                value: "Changed",
                emoji: "🔴"
            }
        ]);

        const s_message = await interaction.editReply({embeds: [cvss], components: [row]});
        const s = await AwaitSelectMenu(s_message);

        cvss.setDescription(`Select the confidentiality\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:${pr.charAt(0)}/UI:${ui.charAt(0)}/S:${s.charAt(0)}/C:...\``);
        cvss.spliceFields(4, 2,
            {name: "Scope (S)", value: `• ${s}`, inline: false},
            {name: "-> Confidentiality (C)", value: "High / Low / None", inline: false}
        );
        row.components[0].setPlaceholder("Select the confidentiality (C)");
        row.components[0].setOptions([
            {
                label: "High (H)",
                value: "High",
                emoji: "🔴"
            }, {
                label: "Low (L)",
                value: "Low",
                emoji: "🟡"
            }, {
                label: "None (N)",
                value: "None",
                emoji: "🟢"
            }
        ]);

        const c_mesage = await interaction.editReply({embeds: [cvss], components: [row]});
        const c = await AwaitSelectMenu(c_mesage);

        cvss.setDescription(`Select the integrity\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:${pr.charAt(0)}/UI:${ui.charAt(0)}/S:${s.charAt(0)}/C:${c.charAt(0)}/I:...\``);
        cvss.spliceFields(5, 2,
            {name: "Confidentiality (C)", value: `• ${c}`, inline: false},
            {name: "-> Integrity (I)", value: "High / Low / None", inline: false},
        );
        row.components[0].setPlaceholder("Select the integrity (I)");
        row.components[0].setOptions([
            {
                label: "High (H)",
                value: "High",
                emoji: "🔴"
            }, {
                label: "Low (L)",
                value: "Low",
                emoji: "🟡"
            }, {
                label: "None (N)",
                value: "None",
                emoji: "🟢"
            }
        ]);

        const i_message = await interaction.editReply({embeds: [cvss], components: [row]});
        const i = await AwaitSelectMenu(i_message);

        cvss.setDescription(`Select the avaiality\n\n• CVSS Vector string: \`CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:${pr.charAt(0)}/UI:${ui.charAt(0)}/S:${s.charAt(0)}/C:${c.charAt(0)}/I:${i.charAt(0)}/A:...\``);
        cvss.spliceFields(6, 2,
            {name: "Integrity (I)", value: `• ${i}`, inline: false},
            {name: "-> Availability (A)", value: "High / Low / None", inline: false}
        );
        row.components[0].setPlaceholder("Select the availability (A)");
        row.components[0].setOptions([
            {
                label: "High (H)",
                value: "High",
                emoji: "🔴"
            }, {
                label: "Low (L)",
                value: "Low",
                emoji: "🟡"
            }, {
                label: "None (N)",
                value: "None",
                emoji: "🟢"
            }
        ]);

        const a_message = await interaction.editReply({embeds: [cvss], components: [row]});
        const a = await AwaitSelectMenu(a_message);

        const vector = `CVSS:3.1/AV:${av.charAt(0)}/AC:${ac.charAt(0)}/PR:${pr.charAt(0)}/UI:${ui.charAt(0)}/S:${s.charAt(0)}/C:${c.charAt(0)}/I:${i.charAt(0)}/A:${a.charAt(0)}`;

        const score = "SCORE";
        const severity = "SEVERITY";

        cvss.setDescription(`• Based on your selection, here's the score: \`${score}/10\` (${severity})\n\n• Here's the CVSS Vector string: \`${vector}\``);
        cvss.spliceFields(7, 1,
            {name: "Availability (A)", value: `• ${a}`, inline: false}
        );

        interaction.editReply({embeds: [cvss], components: []});
    }
};
