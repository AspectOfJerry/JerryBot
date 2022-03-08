const fs = require('fs');
const GetFiles = require('./get_files')
const Discord = require('discord.js')

module.exports = (client) => {
    const command_prefix = "%"
    const commands = {}
    const file_suffix = '.js'
    const command_files = GetFiles('./commands', file_suffix)

    console.log(`Command files: ${command_files}`)

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
