module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Command information
        const COMMAND_NAME = "ban";
        const ROLE_REQUIRED = "PL1";
        const EXCPECTED_ARGUMENTS = 1;
        const OPTIONAL_ARGUMENTS = 1;

        //Help command
        if(args[0] == '?') {
            const help_command = new Discord.MessageEmbed()
                .setColor('#0000ff')
                .setThumbnail(`${message.author.displayAvatarURL({dynamic: true, size: 32})}`)
                .setTitle(`%${COMMAND_NAME} command help (${ROLE_REQUIRED})`)
                .setDescription('This command bans a user from the guild.')
                .addField(`Usage`, "`" + `%${COMMAND_NAME}` + " <user> (<reason>)" + "`", false)
                .addField(`Excpected arguments`, `${EXCPECTED_ARGUMENTS}`, true)
                .addField(`Optional arguments`, `${OPTIONAL_ARGUMENTS}`, true)
                .addField('Related commands', "`kick`", false)
                .setFooter({text: "./commands/testing/ban.js; Lines: [INT]; File size: [NUMBER] KB"})

            message.channel.send({embeds: [help_command]})
            return;
        }

        //Declaring variables
        const target = message.mentions.users.first();
        const memberTarget = message.guild.members.cache.get(target.id);

        //Code

    }
}
