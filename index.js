const Discord = require('discord.js')
const {Intents} = Discord

require('dotenv').config()

const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS
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

client.login(process.env.ISCORD_BOT_TOKEN_JERRY);
