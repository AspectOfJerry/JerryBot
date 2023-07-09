const process = require("process");
const {slackcord} = require("./controllers/slackcord.js");

const {App} = require("@slack/bolt");

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

slackcord.setSclient(app.client);

const capture_mappings = Array.from(slackcord.channel_mappings.values());

app.event("message", async ({event}) => {
    if(event.bot_id) {
        return;
    }
    if(capture_mappings.includes(event.channel)) {
        await slackcord.slackToDiscord(app, event);
    }
});


(async () => {
    await app.start();
    console.log("Bolt Slack client started!");
})();
