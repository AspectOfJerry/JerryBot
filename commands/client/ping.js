const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

const {PermissionCheck, Log, Sleep} = require("../../modules/JerryUtils");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Displays the client latency and the WebSocket server latency."),
    async execute(client, interaction) {
        await Log('append', interaction.guild.id, `'@${interaction.user.tag}' executed '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'.`, 'INFO');
        // await interaction.deferReply();

        if(await PermissionCheck(interaction) === false) {
            const error_permissions = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('PermissionError')
                .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the server administrators if you believe that this is an error.")
                .setFooter({text: `Use '/help' to access the documentation on command permissions.`});

            await interaction.reply({embeds: [error_permissions]});
            await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' did not have the required role to execute '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'. [PermissionError]`, 'WARN');
            return "PermissionError";
        }

        // Declaring variables
        let clientLatency = null;
        let webSocketLatency = null;

        // Checks

        // Main
        const ping = new MessageEmbed()
            .setDescription('ping...');

        interaction.channel.send({embeds: [ping]}).then(pingMessage => {
            clientLatency = pingMessage.createdTimestamp - interaction.createdTimestamp;
            webSocketLatency = client.ws.ping;

            const pong = new MessageEmbed()
                .setColor('GREEN')
                .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle("Pong!")
                .addFields(
                    {name: 'Bot latency', value: `~${clientLatency}`, inline: true},
                    {name: 'DiscordJS latency', value: `~${webSocketLatency}`, inline: true}
                );

            interaction.reply({embeds: [pong]});
            pingMessage.delete().catch(console.error);
            Log('append', interaction.guild.id, `└─Client latency: ${clientLatency}ms; WebSocket latency: ${webSocketLatency}ms;`, 'INFO');
        });
    }
};
