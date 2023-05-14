const process = require("process");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

const {log, sleep} = require("../modules/JerryUtils.js");


let disabled = false;

let messages = [];
let embedMessage;

const success_emoji = "<:success:1102349129390248017>";
const warn_emoji = "<:warn:1102349145106284584>";
const fail_emoji = "<:fail:1102349156976185435>";

const sb_auctions = {
    name: "Active Auctions",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Active Auctions**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/skyblock/auctions?"
};


const sb_bazaar = {
    name: "Bazaar",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Bazaar**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/skyblock/bazaar?"
};

const sb_collections = {
    name: "Collections",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Collections**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/resources/skyblock/collections?"
};

const sb_election = {
    name: "Elections",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Elections**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/resources/skyblock/election?"
};

const sb_auctions_end = {
    name: "Ended Auctions",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Ended Auctions**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/skyblock/auctions_ended?"
};

const sb_items = {
    name: "Items",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Items**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/resources/skyblock/items?"
};

const sb_skills = {
    name: "Skills",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Skills**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/resources/skyblock/skills?"
};

const sb_profiles = {
    name: "Profiles",
    success: 0,
    fails: 0,
    ema: 0,
    rate: 0,
    text: `${warn_emoji} **Profiles**: *Pending request* (-.--% failure)`,
    endpoint: "https://api.hypixel.net/skyblock/profiles?uuid=216fc23b7a4647a89e7a3a60d76356cd&"
};


// All endpoints
async function execute(client) {
    return;
    const status = new CronJob("*/4 * * * *", async () => { // Interval of 4 minutes
        await fetch(`https://api.hypixel.net/&key=${process.env.HYPIXEL_API_KEY_JERRY}`)
            .then((res) => res.json())
            .then((res) => {
            });
    });

    status.start();
}


// Skyblock endpoints
async function executeSB(client) {
    const master_sb = new CronJob("* * * * *", async () => {
        await sleep(jitter());
        const monitors = [sb_auctions, sb_auctions_end, sb_bazaar, sb_collections, sb_election, sb_items, sb_profiles, sb_skills];

        const ema_period = 10;

        for(const endpoint of monitors) {
            await fetch(`${endpoint.endpoint}key=${process.env.HYPIXEL_API_KEY_JERRY}`)
                .then((res) => {
                    if(!res.ok) {
                        throw new Error(`Failed to fetch ${endpoint.endpoint} with status ${res.status}`);
                    }
                    return res.json();
                }).then((res) => {
                    endpoint.success += 1;
                }).catch((err) => {
                    console.error(err);
                    endpoint.fails += 1;
                });
        }
        updateRate(monitors, ema_period);
    });


    function updateRate(monitors, emaPeriod) {
        const fail_weight = 2;
        const success_weight = 1.5;

        for(const monitor of monitors) {
            const alpha = 2 / (emaPeriod + 1); // EMA smoothing factor
            const fails_weighted = fail_weight * monitor.fails;
            const successes_weighted = success_weight * monitor.success;
            const current_rate = fails_weighted / (fails_weighted + successes_weighted);
            monitor.ema = (alpha * current_rate) + ((1 - alpha) * monitor.ema);

            monitor.rate = parseFloat((monitor.ema * 100).toFixed(2));
            monitor.text = `${monitor.rate <= 8 ?
                `${success_emoji} **${monitor.name}**: Operational (${monitor.rate.toFixed(2)}% failure)`
                : monitor.rate <= 20 ?
                    `${warn_emoji} **${monitor.name}**: Degraded (${monitor.rate.toFixed(2)}% failure)`
                    : `${fail_emoji} **${monitor.name}**: Failing (${monitor.rate.toFixed(2)}% failure)`}`;
        }

        let rates = 0;

        for(const monitor of monitors) {
            rates += monitor.rate;
        }

        const avg_rate = rates / monitors.length;

        const new_embed = new MessageEmbed()
            .setColor(avg_rate <= 4 ? "GREEN" : avg_rate <= 10 ? "YELLOW" : "RED")
            .setTitle(avg_rate <= 4 ? `${success_emoji} Hypixel Skyblock API status (${avg_rate.toFixed(2)}% failure)` : avg_rate <= 10 ? `${warn_emoji} Hypixel Skyblock API status (${avg_rate.toFixed(2)}% failure)` : `${fail_emoji} Hypixel Skyblock API status (${avg_rate.toFixed(2)}% failure)`)
            .setDescription(`${sb_auctions.text}\n${sb_bazaar.text}\n${sb_collections.text}\n${sb_election.text}\n${sb_auctions_end.text}\n${sb_items.text}\n${sb_skills.text}\n${sb_profiles.text}`)
            .setFooter({text: "Updated every minute."});

        for(const message of messages) {
            try {
                message.edit({embeds: [new_embed]});
            } catch(err) {
                console.error(err);
            }
        }
    }

    async function testMonitors(monitors) {
        // eslint-disable-next-line no-constant-condition
        while(true) {
            // Add a success to all monitors
            for(const monitor of monitors) {
                monitor.success += 1;
            }

            // Randomly fail a random amount of monitors
            for(let i = 0; i < 16; i++) {
                const index = Math.floor(Math.random() * monitors.length);
                monitors[index].fails += 1;
                monitors[index].success -= 1;
            }

            updateRate(monitors, 10);

            await sleep(1000 + jitter());
        }
    }

    master_sb.start();
    // testMonitors([sb_auctions, sb_auctions_end, sb_bazaar, sb_collections, sb_election, sb_items, sb_profiles, sb_skills]);

    const channels = [await client.channels.resolve("1101906552954298508")];

    embedMessage = new MessageEmbed()
        .setColor("DARK_GREY")
        .setTitle(`${warn_emoji} Hypixel Skyblock API status (-.--% failure)`)
        .setDescription(`${sb_auctions.text}\n${sb_bazaar.text}\n${sb_collections.text}\n${sb_election.text}\n${sb_auctions_end.text}\n${sb_items.text}\n${sb_skills.text}\n${sb_profiles.text}`)
        .setFooter({text: "Updated every minute."});

    for(const channel of channels) {
        messages.push(await channel.send({embeds: [embedMessage]}));
    }

    log("append", "hypixel_api_status", "[HypixelAPIStatus] Monitoring: skyblock_auctions, skyblock_auctions_end, skyblock_bazaar, skyblock_collections, skyblock_election, skyblock_items, skyblock_skills, skyblock_profiles", "DEBUG");
    console.log("[HypixelAPIStatus] Now monitoring.");
}


function jitter() {
    return Math.floor(Math.random() * 450) + 50;
}

module.exports = {
    execute,
    executeSB
};
