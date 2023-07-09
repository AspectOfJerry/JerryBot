const process = require("process");
const moment = require("moment");
const {MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");


/**
 * 
 * @param {object} sclient Slack Client
 * @param {object} dclient Discord Client
 * @param {object} dchannelId Discord Channel ID
 * @param {object} smessage Slack Message
 */
async function sendDiscord(sclient, dclient, dchannelId, smessage) {
    const user_data = await sclient.client.users.info({
        user: smessage.user
    });

    const channel_info = await sclient.client.conversations.info({
        channel: smessage.channel
    });

    const team_info = await sclient.client.team.info({
        token: process.env.SLACK_BOT_TOKEN,
        team: smessage.team
    });

    const embed = new MessageEmbed()
        // .setColor(user_data.user.color)
        .setColor("RANDOM")
        .setAuthor({name: `${user_data.user.profile.display_name || user_data.user.profile.real_name}`, iconURL: user_data.user.profile.image_original})
        .setDescription(`*${moment.unix(Math.round(smessage.ts)).format("HH:mm:ss")}:* ${smessage.text}`)
        .setFooter({text: `#${channel_info.channel.name}/${team_info.team.name}`, iconURL: team_info.team.icon.image_34});

    const dchannel = dclient.channels.resolve(dchannelId);
    dchannel.send({embeds: [embed]});
}

/**
 * 
 * @param {object} sclient Slack client
 * @param {string} schannel Slack channel id
 * @param {object} message Discord message
 */
async function sendSlack(sclient, schannelId, message) {
    await sclient.chat.postMessage({
        channel: schannelId,
        as_user: true,
        username: message.author.displayName,
        iconUrl: message.author.displayAvatarURL({format: "png"}),
        text: message.cleanContent
    }).then(() => {
        message.react("📨");
    });
}

module.exports = {
    sendDiscord,
    sendSlack
};
