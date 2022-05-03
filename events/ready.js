const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    execute(client, commands) {
        console.log("Jerry Bot is now online.")

        const client_id = client.user.id;
        const jerry_guild_id = process.env.DISCORD_JERRY_GUILD_ID;
        const cra_guild_id = process.env.DISCORD_CRA_GUILD_ID;
        const rest = new REST({
            version: "9"
        }).setToken(process.env.DISCORD_BOT_TOKEN_JERRY);

        (async () => {
            try {
                await rest.put(Routes.applicationGuildCommands(client_id, jerry_guild_id)
                    , {
                        body: commands
                    });
                console.log(`Successfully registered commands locally in ${jerry_guild_id}.`);
                await rest.put(Routes.applicationGuildCommands(client_id, cra_guild_id)
                    , {
                        body: commands
                    });
                console.log(`Successfully registered commands locally in ${cra_guild_id}.`);
            } catch(error) {
                if(error) {
                    console.error(error);
                }
            }
        })();
    }
}