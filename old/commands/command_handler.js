const fs = require('fs');
const GetFiles = require('./get_files')
const Discord = require('discord.js')
const {Collection} = require('discocrd.js')
const {Intents} = Discord
const {REST} = require('@discordjs/rest')
const {Routes} = require('@discordjs/-api-types/v9')

module.exports = (client) => {
    const command_prefix = "%"
    const commands = {}
    const file_suffix = '.js'
    const command_files = GetFiles('./commands', file_suffix)

    console.log(`Command files: ${command_files}`)

    client.commands = new Collection();
    for(const command of command_files) {
        let command_file = require(command)
        if(command_file.default) {
            command_file = command_file.default
        }

        const command_split = command.replace(/\\/g, '/').split('/')
        const command_name = command_split[command_split.length - 1].replace(file_suffix, "")

        commands[command_name.toLowerCase()] = command_file
    }

    console.log(commands)

    client.on('messageCreate', (message) => {
        if(message.author.bot) {
            return;
        }
        //JerryBot Video Detection Module
        if(message.content.includes("https://www.youtube.com/watch") || message.content.includes("https://youtu.be")) {
            const args = message.content.split(/ +/)
            require('../../events/rickroll_detection_module')(message, Discord, client, ...args)
        }

        if(message.author.bot || !message.content.startsWith(command_prefix)) {
            return;
        }

        const args = message.content.slice(1).split(/ +/)
        const command_name = args.shift()

        if(!commands[command_name]) {
            return;
        }

        try {
            commands[command_name].callback(message, Discord, client, ...args)
        } catch(error) {
            console.error(error)
        }
    })
}
