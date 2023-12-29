import {MessageEmbed} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

import {logger, sleep} from "../../utils/jerryUtils.js";


export default {
    data: new SlashCommandBuilder()
    .setName("sudo")
    .setDescription("SuperUser commands.")
    .addSubcommand((subcommand) => // blacklist
        subcommand
        .setName("blacklist")
        .setDescription("[SUDO] Adds a user to the bot's blacklist preventing them to interact with it.")
        .addUserOption((option) =>
            option
            .setName("user")
            .setDescription("[REQUIRED] The user to blacklist. If you wish to use an ID, put anything here and use the id option.")
            .setRequired(true))
        .addIntegerOption((option) =>
            option
            .setName("id")
            .setDescription("[OPTIONAL] The user id to blacklist. This option OVERWRITES the user option.").setRequired(false)))
    .addSubcommand((subcommand) =>
        subcommand
        .setName("msg")
        .setDescription("[SUDO] Talk privately with a guild member through the bot.")
        .addUserOption((options) =>
            options
            .setName("user")
            .setDescription("[REQUIRED] The user to send the message to.")
            .setRequired(true))
        .addStringOption((options) =>
            options
            .setName("message")
            .setDescription("[REQUIRED] The initial message to send.")
            .setRequired(true)))
    .addSubcommand((subcommand) => // NUKE
        subcommand
        .setName("nuke")
        .setDescription("[SUDO] Nukes the current guild if not in the safe list, effectively deleting most of its content."))
    .addSubcommand((subcommand) => // PRESENCE
        subcommand
        .setName("presence")
        .setDescription("[SUDO] Edit the bot's presence.")
        .addStringOption((option) =>
            option
            .setName("type")
            .setDescription("[REQUIRED] The type of presence.")
            .setRequired(true)
            .addChoices([
                ["Playing", "PLAYING"],
                ["Streaming", "STREAMING"],
                ["Listening to", "LISTENING"],
                ["Watching", "WATCHING"],
                ["Competing in", "COMPETING"]
                // Bots cannot use the "CUSTOM" type
            ]))
        .addStringOption((option) =>
            option
            .setName("text")
            .setDescription("[REQUIRED] The text to show after the type.")
            .setRequired(true))
        .addStringOption((option) =>
            option
            .setName("status")
            .setDescription("[REQUIRED] The status of the bot.")
            .setRequired(true)
            .addChoices([
                ["Online", "online"],
                ["Idle", "idle"],
                ["Do not disturb", "dnd"]
            ]))
        .addStringOption((option) =>
            option
            .setName("url")
            .setDescription("[OPTIONAL] A YouTube or Twitch URL, required if the type is Streaming.")
            .setRequired(false)))
    .addSubcommand((subcommand) =>
        subcommand
        .setName("presence_clear")
        .setDescription("[SUDO] Clears the bot's presence."))
    .addSubcommand((subcommand) =>
        subcommand
        .setName("status")
        .setDescription("Edits the bot's status.")
        .addStringOption((option) =>
            option
            .setName("status")
            .setDescription("[REQUIRED] The status type.")
            .setRequired(true)
            .addChoices([
                ["Online", "online"],
                ["Idle", "idle"],
                ["Do not disturb", "dnd"]
            ])))
    .addSubcommand((subcommand) =>
        subcommand
        .setName("stop")
        .setDescription("[SUDO] Stops the bot.")
        .addStringOption((options) =>
            options
            .setName("estop")
            .setDescription("[OPTIONAL] Skips the steps that ensure a clean exit (faster). Defaults to false.")
            .setRequired(false))
        .addStringOption((options) =>
            options
            .setName("reason")
            .setDescription("[OPTIONAL] The reason for the stop request.")
            .setRequired(false))
        .addStringOption((options) =>
            options
            .setName("heartbeat")
            .setDescription("[OPTIONAL] Whether to stop the heartbeat.")
            .setRequired(false)
            .addChoices([
                ["Stop", "true"],
                ["No action", "false"]
            ]))),
    async execute(client, interaction) {
        // Declaring variables

        // Checks
        // Main
        // Notify all superusers when a superuser command is executed
        const super_users = "";

        const notify = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle(":warning: SuperUser command execution alert")
        .addFields(
            {name: "User", value: `<@${interaction.user.id}>`, inline: true},
            {
                name: "Command",
                value: `</${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}:${interaction.commandId}>`,
                inline: true
            },
            {name: "Location", value: `<#${interaction.channel.id}>`, inline: false},
        );

        for (const user of super_users) {
            client.users.send(user, {embeds: [notify]});
        }

        logger.append("debug", "HDLR", "Searching for subcommand file...");
        (await import(`./${interaction.commandName}_${interaction.options.getSubcommand()}.subcmd.js`)).default(client, interaction);
    }
};
