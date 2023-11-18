import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription("test"),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, -1) === false) {
            return;
        }

        const role_id = "1154575328140853318"; // study

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle("Study Role!")
        .setDescription("Click the button to receive the '<@&1154575328140853318>' role.\nYou'll be mentioned whenever our fellow students create study materials.");

        const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId("study")
            .setLabel("Click me to get the role!")
            .setStyle("SUCCESS")
        );

        const message = await interaction.reply({embeds: [embed], components: [button], fetchReply: true});

        const button_collector = await message.createMessageComponentCollector({componentType: "BUTTON"});

        button_collector.on("collect", async (buttonInteraction) => {
            // Adding role
            const role = buttonInteraction.guild.roles.resolve(role_id);
            await buttonInteraction.member.roles.add(role);
            logger.append("info", "STDOUT", `'/test' > Added the study role to '@${buttonInteraction.user.tag}'.`);
            buttonInteraction.reply({content: "You have been given the role!", ephemeral: true});
        });

        button_collector.on("end", async (collected, reason) => {
            if (reason === "time") {
                // Disabling button
                button.components[0].setDisabled(true);
                message.edit({embeds: [embed], components: [button]});
            }
        });
    }
};
