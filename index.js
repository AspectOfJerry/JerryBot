const DiscordJS = require('discord.js')
const {Intents} = DiscordJS

require('dotenv').config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log("Jerry Bot is now online.")
})

client.login(process.env.DISCORD_BOT_TOKEN)