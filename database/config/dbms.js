const fs = require('fs');
const path = require('path');


async function AddGuild(guildObject) {
    const new_guild = await ParseGuild(guildObject);

    new_guild.set(guildObject.id, new_guild);
}


async function GetClientGuilds(client) {
    return await client.guilds.cache;
}


async function GetConfig() {
    const config = fs.readFileSync(path.resolve(__dirname, './config_guilds.json'));
    return JSON.parse(config);
}


async function GetConfigMap() {
    const config = await GetConfig();

    const map = new Map(Object.entries(config.guilds));
    return map;
}


async function ParseGuild(guildObject) {
    const parsed_guild = {
        id: guildObject.id,
        name: guildObject.name,
        permissions: {}
    };

    return parsed_guild;
}


async function RefreshDataset(client) {
    const new_config = new Map();

    const config = await GetConfig();

    const guilds = await GetClientGuilds(client);

    const permission_config = [];

    for(const [key, value] of Object.entries(config.guilds)) {
        permission_config.push(value.permissions);
    }

    for(const guild of guilds.entries()) {
        new_config.set(guild[0], {
            id: guild[1].id,
            name: guild[1].name
        });
    }

    config.guilds = Object.fromEntries(new_config);

    let i = 0;

    for(const [key, value] of Object.entries(config.guilds)) {
        value.permissions = permission_config[i];
        i++;
    }

    fs.writeFileSync(path.resolve(__dirname, './config_guilds.json'), JSON.stringify(config), (err) => {
        if(err) {
            throw err;
        }
    });
}


async function RemoveGuild(guild) {

}


async function SetPermissions() {

}


module.exports = {
    AddGuild,
    GetClientGuilds,
    GetConfigMap,
    ParseGuild,
    RefreshDataset,
    RemoveGuild,
    SetPermissions
};
