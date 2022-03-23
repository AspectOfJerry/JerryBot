module.exports = {
    callback: (message, Discord, client, ...args) => {
        //Declaring variables
        // const target = message.mentions.users.first();
        // const memberTarget = message.guild.members.cache.get(target.id);

        //Code
        const test = new Discord.MessageEmbed()
            .setColor('ffffff')
            .setAuthor({name: ""})
            .setTitle('Title')
            .setDescription('Description :information_source: ')
            .setFooter({text: `${message.author.tag}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setTimestamp()

        message.channel.send({embeds: [test]})
    }
}
