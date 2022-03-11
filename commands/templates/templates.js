module.exports = {
    callback: (message, Discord, client, ...args) => {
        const section_help_command = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('//Help command layout')

        message.channel.send({embeds: [section_help_command]})
        const help_command = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle('%[STRING] command help ([STRING])')
            .setDescription('This command [STRING].')
            .addField(`Usage`, "`%[STRING]` `[PARAMETERS?]`", false)
            .addField(`Excpected arguments`, "[INT]", true)
            .addField(`Optional arguments`, "[INT]", true)
            .addField('Related commands', "`[STRING]`", false)
            .setFooter("[STRING].js; Lines: [INT]; File size: [NUMBER] KB")

        message.channel.send({embeds: [help_command]})
        const section_errors = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('//Error messages layout')

        message.channel.send({embeds: [section_errors]})
        const type_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('TypeError: Unexpected argument type. It must be a [TYPE].')

        message.channel.send({embeds: [type_error]})
        const type_error_nan = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('TypeError: Unexpected argument type. "[ARGUMENT]" is NAN. It must be an `int`.')

        message.channel.send({embeds: [type_error_nan]})
        const range_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('RangeError: Invalid [STRING]. It must be [STRING (RANGE)].')

        message.channel.send({embeds: [range_error]})
        const syntax_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('SyntaxError: Invalid argument. "[ARGUMENT]" must be [STRING].')

        message.channel.send({embeds: [syntax_error]})
        const reference_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('ReferenceError: Invalid user (not found).')

        message.channel.send({embeds: [reference_error]})
        const expected_n_arguments = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('Error: Excpected [INT] arguments but only provided [INT].')
        
        message.channel.send({embeds: [expected_n_arguments]})
        
    }
}
