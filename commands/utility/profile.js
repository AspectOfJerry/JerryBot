import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, permissionCheck, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Shows information about a user.")
    .addUserOption((options) =>
        options
        .setName("user")
        .setDescription("[OPTIONAL] The user to search for. Defaults to yourself.")
        .setRequired(false)),
    async execute(client, interaction) {
        if (await permissionCheck(interaction, 0) === false) {
            return;
        }

        // Declaring variables
        const target = interaction.options.getUser("user") || interaction.user;
        const memberTarget = interaction.guild.members.cache.get(target.id);
        logger.append("info", "IN", `'/profile' > memberTarget: '@${memberTarget.user.tag}'`);

        // Checks

        // Main
        interaction.reply({content: "This command is currently unavailable."});
        // User creation,
        // avatar,
        // guild nick,
        // guild avatar,
        // guild join,
    }
};
