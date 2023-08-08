import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("typing")
        .setDescription("Sends the typing indicator."),
    async execute(client, interaction) {
        if(await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables

        // Checks

        // Main
        await interaction.revply({content: "Typing...", ephemeral: true});
        logger.append("append", interaction.guild.id, `Typing in <#${interaction.channel.name}>`, "INFO");

        interaction.channel.sendTyping();
    }
};
