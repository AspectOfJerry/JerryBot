import {MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("typing")
    .setDescription("Sends the typing indicator."),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, 0) === false) {
            return;
        }

        await interaction.reply({content: "Typing...", ephemeral: true});
        interaction.channel.sendTyping();
    }
};
