const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");
const Path = require("path");

const {getSubCommandFiles, Log, Sleep} = require("../../../modules/JerryUtils.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("nasa")
        .setDescription("Executes a command related with the NASA Open APIs.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("api")
                .setDescription("Makes an API call to NASA's APOD API."))
        .addSubcommand(subcommand =>
            subcommand
                .setName("apod")
                .setDescription("Returns the Astronomy Picture of the Day (APOD) from NASA.")),
    async execute(client, interaction) {
        // Declaring variables

        // Checks

        // Main
        // eslint-disable-next-line no-undef
        const subcommand_files = await getSubCommandFiles(Path.resolve(__dirname, "./"), ".subcmd.js");

        for(const file of subcommand_files) {
            if(file.endsWith(interaction.options.getSubcommand() + ".subcmd.js")) {
                await log("append", "hdlr", "├─Handing controls to subcommand file...", "DEBUG");
                require(file)(client, interaction);
                break;
            }
        }
    }
};
