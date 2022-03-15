//%ban <user> (<reason>)
module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Help
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('0000ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle('%ban command help (BotPL1)')
                .setDescription('This command bans a guild member.')
                .addField(`Usage`, "`%ban <user> (reason)`", false)
                .addField(`Excpected arguments`, "1", true)
                .addField(`Optional arguments`, "1", true)
                .addField('Related commands', "`kick`", false)
                .setFooter({text: "ban.js; Lines: [LINES]; File size: [FILE_SIZE] KB"})

            message.channel.send({embeds: [help_command]})
            return;
        }
        
    }
}
