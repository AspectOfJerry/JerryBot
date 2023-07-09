const {sendDiscord, sendSlack} = require("./messageHandler.js");


let dclient;
let sclient;

// Maps channels Discord to Slack
const channel_mappings = new Map([
    ["1066475581899813007", "C05FS3QJJTW"]
]);

// Maps channels Slack to Discord
const channel_mappings_flipped = new Map([...channel_mappings].map(([key, value]) => [value, key]));

function startSlack(client) {
    require("../index.js");
    dclient = client;
}

/**
 * 
 * @param {object} sapp Slack App
 */
function setSclient(sapp) {
    sclient = sapp;
}

async function discordToSlack(message) {
    const schannel_id = channel_mappings.get(message.channel.id);
    if(!schannel_id) {
        throw `No Slack channel matching ${message.channel.id}`;
    }

    await sendSlack(sclient, schannel_id, message);
}

async function slackToDiscord(sclient, event) {
    const dchannel_id = channel_mappings_flipped.get(event.channel);
    if(!dchannel_id) {
        throw `No Discord channel matching ${event.channel}`;
    }

    await sendDiscord(sclient, dclient, dchannel_id, event);
}

module.exports.slackcord = {
    setSclient,
    startSlack,
    discordToSlack,
    slackToDiscord,
    channel_mappings
};
