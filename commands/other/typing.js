const {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {log, permissionCheck, sleep} from "../../modules/jerryUtils.js";


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
        await interaction.reply({content: "Typing...", ephemeral: true});
        log("append", interaction.guild.id, `Typing in <#${interaction.channel.name}>`, "INFO");

        interaction.channel.sendTyping();
    }
};
