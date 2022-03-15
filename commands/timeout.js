//%timeout <user> (<reason>)
module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#0000ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('%timeout command help (PL3)')
                .setDescription('This command times a guild member out.')
                .addField(`Usage`, "`%timeout <user> (<reaon>)`", false)
                .addField(`Excpected arguments`, "1", true)
                .addField(`Optional arguments`, "1", true)
                .addField('Related commands', "`mute`", false)
                .setFooter({text: "timeout.js; Lines: [INT]; File size: [NUMBER] KB"})

            message.channel.send({embeds: [help_command]})
            return;
        }
        //Declaring variables



        const reference_error_target = new Discord.MessageEmbed()
            .setColor('ff0000')
            .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
            .setDescription('ReferenceError: Invalid user (not found). Use `%timeout ?` for help.')
        //Verifications
        if(!args[0]) {
            const error_require_more_arguments = new Discord.MessageEmbed()
                .setColor('ff0000')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 16})}`)
                .setDescription('Error: Excpected 1 arguments but only provided 0. Use `%timeout ?` for help.')
            
            message.channel.send({embeds: [error_require_more_arguments]})
            return;
        }
        const target = message.mentions.users.first();
        if(!target) {
            message.channel.send({embeds: [reference_error_target]})
            return;
        }
        const memberTarget = message.guild.members.cache.get(target.id);
    }
}
