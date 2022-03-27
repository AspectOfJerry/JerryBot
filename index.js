const Discord = require('discord.js')
const {Intents} = Discord

require('dotenv').config()

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
})

client.on('ready', () => {
    console.log("Jerry Bot is now online.")

    let handler = require('./command_handler')

    if(handler.default) {
        handler = handler.default
    }

    handler(client)
})
client.on('guildMemberAdd', (guildMember) => {
    guildMember.roles.add(guildMember.guild.roles.cache.find(role => role.name == "Members"))
})

client.login(process.env.DISCORD_BOT_TOKEN_JERRY);
