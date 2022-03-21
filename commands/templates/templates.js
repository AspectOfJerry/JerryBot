module.exports = {
    callback: (message, Discord, client, ...args) => {
        message.channel.send('//Help command template')

        const COMMAND_NAME = "[COMMAND_NAME]";
        const ROLE_REQUIRED = "[ROLE_REQUIRED]";
        const EXCPECTED_ARGUMENTS = "[EXCPECTED_ARGUMENTS]";
        const OPTIONAL_ARGUMENTS = "[OPTIONAL_ARGUMENTS]";

        const help_command = new Discord.MessageEmbed()
            .setColor('#0000ff')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
            .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
            .setDescription('This command [STRING].')
            .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <[ARGUMENTS?]>" + "`", false)
            .addField(`Aliases`, "`[STRING]`", false)
            .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
            .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
            .addField('Related commands', "`[STRING]`", false)
            .setFooter({text: "./[STRING].js; Lines: [INT]; File size: ~[NUMBER] KB"})

        message.channel.send({embeds: [help_command]})

        message.channel.send('//Error messages template')

        const type_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription("**TypeError**: Unexpected argument type. Argument [INT] (`" + `[ARGUMENT]` + '`) must be a [TYPE].' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")

        message.channel.send({embeds: [type_error]})
        const type_error_nan = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('**TypeError:** Unexpected argument type. Argument [INT] (`[ARGUMENT]`) is NAN. It must be an `int`.' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")

        message.channel.send({embeds: [type_error_nan]})
        const range_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('**RangeError:** Invalid [STRING]. It must be [STRING (RANGE)].' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")

        message.channel.send({embeds: [range_error]})
        const syntax_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('**SyntaxError:** Invalid argument. "[ARGUMENT]" must be [STRING].' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")

        message.channel.send({embeds: [syntax_error]})
        const reference_error = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('**ReferenceError:** Invalid user (not found).' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")

        message.channel.send({embeds: [reference_error]})
        const reference_error_target = new Discord.MessageEmbed()
            .setColor('ff40400')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('**ReferenceError:** Invalid user (not found).' + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")
            .setFooter({text: "Please provide a valid member (Snowflake, mention) to [STRING]."})

        message.channel.send({embeds: [reference_error_target]})
        const expected_n_arguments = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription(`**Error:** Excpected **${EXCPECTED_ARGUMENTS}** arguments but only provided **[INT]**.` + " Use " + "`" + `%${COMMAND_NAME} ?` + "`" + " for help.")

        message.channel.send({embeds: [expected_n_arguments]})
    }
}
