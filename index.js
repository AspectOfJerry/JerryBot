//const Discord = require('discord.js')
const fs = require('fs');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js')
const {REST} = require('@discordjs/rest')
const {Routes} = require('discord-api-types/v9')
const GetFiles = require('./get_files')

require('dotenv').config()

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
})

const file_suffix = '.js'
const command_files = GetFiles('./commands', file_suffix)

console.log(command_files)
const commands = [];

client.commands = new Collection();

for(const file of command_files) {
    const command = require(file);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}


client.on('ready', () => {
    console.log("Jerry Bot is now online.")

    const client_id = client.user.id;
    const jerry_guild_id = process.env.DISCORD_JERRY_GUILD_ID;
    const cra_guild_id = process.env.DISCORD_CRA_GUILD_ID;
    const rest = new REST({
        version: "9"
    }).setToken(process.env.DISCORD_BOT_TOKEN_JERRY);
    (async () => {
        try {
            await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id)
                , {
                    body: commands
                });
            console.log(`Successfully registered commands locally in ${jerry_guild_id}.`);
            await rest.put(Routes.applicationGuildCommands(client_id, cra_guild_id)
                , {
                    body: commands
                });
            console.log(`Successfully registered commands locally in ${cra_guild_id}.`);
        } catch(error) {
            if(error) {
                console.error(error);
            }
        }
    })();
})

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) {
        return;
    }

    const command = client.commands.get(interaction.commandName);

    if(!command) {
        return;
    }
    try {
        await command.execute(client, interaction);
    } catch(error) {
        if(error) {
            console.error(error);
            const execute_error = new MessageEmbed()
                .setColor('#bb20ff')
                .setTitle('Error')
                .setDescription("An error occured while executing the command. No further information is available.")
                .setTimestamp();

            await interaction.reply({embeds: [execute_error], ephemeral: false});
        }
    }
})

client.on('guildMemberAdd', (guildMember) => {
    if(guildMember.guild.id == process.env.DISCORD_JERRY_GUILD_ID) {
        guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "Members"))
    }
})

client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
