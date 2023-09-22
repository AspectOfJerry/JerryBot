import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("cra")
        .setDescription("Commands for CRA.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("roles")
                .setDescription("Self add/remove some roles.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks
        // Whitelist
        if(interaction.guild.id != "1014278986135781438") {
            const not_avail_in_guild = new MessageEmbed()
                .setColor("RED")
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription("This command is not available in this guild!");

            interaction.reply({embeds: [not_avail_in_guild]});
            return;
        }

        // Main
        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.e.js`)).default(client, interaction);
    }
};
