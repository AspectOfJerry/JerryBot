module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Declaring variables
        // const target = message.mentions.users.first();
        // const memberTarget = message.guild.members.cache.get(target.id);

        //Code
        const error_catch = new Discord.MessageEmbed()
            .setColor('#ff20ff')
            .setAuthor({name: "Critical Error"})
            .setTitle("Critical error catch")
            .setDescription("An error was caught at line `[LINE]`.")
            .addField("code", "${error.code}", true)
            .addField("httpsStatus", "${error.httpStatus}", true)
            .addField("path", "${error.path}", false)
            .setFooter({text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
        
        message.channel.send({embeds: [error_catch]})
    }
}
