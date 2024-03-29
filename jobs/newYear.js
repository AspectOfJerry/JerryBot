import {CronJob} from "cron";

import {logger, sleep} from "../utils/jerryUtils.js";

let disabled = false;


async function execute(client) {
    /**
     * Triggers every year on January 1st
     */
    const new_year = new CronJob("0 0 1 1 *", async () => {

        const guilds = [];
        guilds.push(await client.guilds.fetch("631939549332897842"));
        guilds.push(await client.guilds.fetch("1014278986135781438"));

        const channels = [];
        channels.push("782060424220377128"); // devServer

        const alt_channels = [];
        alt_channels.push("857978482374344734"); // devServer

        for (let i = 0; i < guilds.length; i++) {
            const channel = await guilds[i].channels.fetch(channels[i]);
            const alt_channel = await guilds[i].channels.fetch(alt_channels[i]);

            await channel.send({content: `:tada: Happy new year ${guilds[i].roles.everyone}! :tada:`})
            .then((msg) => {
                msg.react("🥳");
            });

            await alt_channel.send({content: ":tada: Happy new year everyone! :partying_face: :fireworks:"})
            .then((msg) => {
                msg.react("🎉");
            });
        }
    });

    new_year.start();
    logger.append("debug", "INIT", "[NewYear] New year announcer cron job started!");

    console.log("[NewYear] The new year announcer daemon started!");
    logger.append("info", "INIT", "[NewYear] New year announcer daemon started!");
}


export {
    execute
};
