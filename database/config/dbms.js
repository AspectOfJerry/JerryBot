const {Collection, MessageEmbed} = require("discord.js");
const fs = require("fs");
const Path = require("path");

const {Log, Sleep} = require("../../modules/JerryUtils");


/**
 * @param {object} guildObject A Discord guild object.
 * @param {boolean} setPermissions Whether the base permissions should be added into the object. Defaults to `true`.
 */
async function AddGuild(guildObject, setPermissions) {
    const new_guild = await ParseGuild(guildObject, setPermissions);

    new_guild.set(guildObject.id, new_guild);
}


/**
 * @returns {object} A JSON object containing the full configuration file.
 */
async function GetConfig() {
    const config = fs.readFileSync(Path.resolve(__dirname, "./config_guilds.json"));
    return JSON.parse(config);
}


/**
 * @returns {object} A map containing the guild configs.
 */
async function GetGuildConfigMap() {
    const config = await GetConfig();

    const map = new Map(Object.entries(config.guilds));
    return map;
}


/** 
 * @async
 * @param {object} member The GuildMember to check
 * @returns {number} The highest PL
 */
async function GetHighestPL(member) {
    const roles = member.roles.cache;

    const guilds = await GetGuildConfigMap();
    const guild = await guilds.get(member.guild.id);

    const role_config = guild.permissionRoles;

    if(!role_config) {
        throw `Missing permissionRoles configuration`;
    }

    for(let i = 1; i < Object.keys(role_config).length + 1; i++) {
        if(roles.has(role_config[`PL${i}`])) {
            return i;
        }
    }
}


/**
 * @async
 * @param {object} guildObject The Guild to parse.
 * @param {boolean} setPermissions Whether a basic permission configuration with default roles should be set. Defaults to true.
 * @returns {object} The parsed guild, adapted for storing.
 */
async function ParseGuild(guildObject, setPermissions) {
    const doSetPermissions = setPermissions ?? true;

    if(!doSetPermissions) {
        const parsed_guild = {
            id: guildObject.id,
            name: guildObject.name,
            permissionRoles: {},
            commandPermissions: {}
        };
        return parsed_guild;
    }

    const parsed_guild = {
        id: guildObject.id,
        name: guildObject.name,
        permissionRoles: {},
        commandPermissions: {}
    };
    return parsed_guild;
}


/**
 * @async
 * @param {object} interaction The Discord interaction object.
 * @returns {boolean} Whether or not the execution is authorized.
 */
async function PermissionCheck(interaction) {
    const config = await GetConfig();

    if(config.userBlacklist.includes(interaction.member.id)) {
        const blacklisted = new MessageEmbed()
            .setColor('FUCHSIA')
            .setTitle("Blacklisted")
            .setDescription("I'm sorry but you are in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
            .setFooter({text: `Contact Jerry#3756 for help.`});

        try {
            interaction.reply({embeds: [blacklisted]});
        } catch {
            interaction.editReply({embeds: [blacklisted]});
        }

        await Log('append', interaction.guild.id, `└─'@${interaction.user.tag}' is blacklisted from the bot. [Blacklist]`, 'WARN');
        return;
    } else if(config.superUsers.includes(interaction.member.id)) {
        await Log('append', interaction.guild.id, `├─'@${interaction.user.tag}' is a Super User. Execution authorized.`, 'INFO');
        return true;
    }

    const guilds = await GetGuildConfigMap();

    let commandName = interaction.commandName;
    const subcommand_name = await interaction.options.getSubcommand(false);

    var permissionSet = {};

    for(const [key, value] of guilds) {
        if(key == interaction.guild.id) {
            permissionSet = value.commandPermissions;
        }
    }

    if(Object.keys(permissionSet).length === 0) {
        throw `Failed to find a permissionSet for guild ${interaction.guild.id} (${interaction.guild.name})`;
    }

    let permissionValue;

    if(subcommand_name) {
        commandName = commandName + "_sub";
    }

    for(const value of Object.values(permissionSet)) {
        const command = value[commandName];

        if(command !== undefined) {
            if(!subcommand_name) {
                permissionValue = command;
                break;
            } else {
                const sub_command = command[subcommand_name];
                permissionValue = sub_command
                break;
            }
        }
    }

    if(!permissionValue) {
        await Log('append', interaction.guild.id, `Could not find a permissionValue for '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'`, 'FATAL');
        throw `Could not find a permissionValue for '/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}'`;
    }

    if(permissionValue === 0 || await GetHighestPL(interaction.member) <= permissionValue) {
        return true;
    }

    return false;
}


/**
 * @async
 * @param {object} client The active Discord client.
 */
async function RefreshDataset(client) {
    const new_config = new Map();

    const config = await GetConfig();
    const guilds = client.guilds.cache;

    // Temporary storage
    const permission_roles = [];
    const command_permissions = [];

    for(const [key, value] of Object.entries(config.guilds)) {
        permission_roles.push(value.permissionRoles);
        command_permissions.push(value.commandPermissions);
    }

    // Main
    for(const guild of guilds.entries()) {
        new_config.set(guild[0], {
            id: guild[1].id,
            name: guild[1].name
        });
    }

    config.guilds = Object.fromEntries(new_config);

    // Restore data from temporary storage
    let i = 0;

    for(const [key, value] of Object.entries(config.guilds)) {
        value.permissionRoles = permission_roles[i];
        value.commandPermissions = command_permissions[i];
        i++;
    }

    // Update the file
    fs.writeFileSync(Path.resolve(__dirname, "./config_guilds.json"), JSON.stringify(config), (err) => {
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
    GetGuildConfigMap,
    GetHighestPL,
    ParseGuild,
    PermissionCheck,
    RefreshDataset,
    RemoveGuild,
    SetPermissions
};
