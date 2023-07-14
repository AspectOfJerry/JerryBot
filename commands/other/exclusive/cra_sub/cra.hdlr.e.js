import {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import path from "path";

import {getSubCommandFiles, log, sleep} from "../../../../modules/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
        .setName("cra")
        .setDescription("Commands for CRA.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("schedule")
                .setDescription("Get the schedule for a group.")
                .addStringOption(options =>
                    options
                        .setName("day")
                        .setDescription("Get the schedule for today or next Jour. Defaults to automatic.")))
        .addSubcommand(subcommand =>
            subcommand
                .setName("weather")
                .setDescription("Get today's weather."))
        .addSubcommand(subcommand =>
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

            await interaction.reply({embeds: [not_avail_in_guild]});
            return;
        }

        // Main
        const __filename = new URL(import.meta.url).pathname;
        const __dirname = path.dirname(__filename);
        const subcommand_files = await getSubCommandFiles(path.resolve(__dirname, "./"), ".subcmd.e.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.e.js")) {
                await log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                (await import(file)).default(client, interaction);
                break;
            }
        }
    }
};
