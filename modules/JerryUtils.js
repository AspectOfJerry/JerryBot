const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {RegisterEvent} = require("../jobs/log_digest");
const fs = require("fs");
const date = require("date-and-time");

const {
    AddGuild,
    GetConfig,
    GetGuildConfigMap,
    GetHighestPL,
    RefreshDataset,
    RemoveGuild,
    SetPermissions
} = require("../database/config/dbms");


/**
 * Private internal function
 */
async function _GetDirCommandFiles(dir, suffix, command_files, ignored_files, skipped_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for(const file of files) {
        if(file.name.endsWith(".subcmd.js")) {
            ignored_files.push(`${dir}/${file.name} => subcommand`); // Ignoring subcommand files because they will be called by the handler.
            continue;
        } else if(file.name.endsWith(".todo")) {
            ignored_files.push(`${dir}/${file.name} => todo`);
            continue;
        } else if(file.name.endsWith(".template")) {
            ignored_files.push(`${dir}/${file.name} => template file`);
            continue;
        } else if(file.name.endsWith(".hdlr.js")) {
            skipped_files.push(`${dir}/${file.name} => subcommand handler`);
            // Do not put `continue;` here! Subcommand handlers should not be ignored as they work the same way as command files.
        } else if(file.name.endsWith("dbms.js")) {
            skipped_files.push(`${dir}/${file.name} => database manager`);
            continue;
        }

        if(file.isDirectory()) {
            _GetDirCommandFiles(`${dir}/${file.name}`, suffix, command_files, ignored_files, skipped_files);
        } else if(file.name.endsWith(suffix)) {
            command_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @param {string} dir The directory
 * @param {string} suffix The file suffix to search for
 * @returns {array} The list of command files
 */
async function GetCommandFiles(dir, suffix) {
    let command_files = [];
    let ignored_files = [];
    let skipped_files = [];

    _GetDirCommandFiles(dir, suffix, command_files, ignored_files, skipped_files);

    console.log(`Ignored ${ignored_files.length} files:`);
    console.log(ignored_files);
    console.log(`Skipped ${skipped_files.length} files:`);
    console.log(skipped_files);
    return command_files;
}


/**
 * Private internal function
 */
async function _GetDirSubCommandFiles(dir, suffix, subcommand_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for(const file of files) {
        // If the file is a folder
        if(file.isDirectory()) {
            _GetDirSubCommandFiles(`${dir}/${file.name}`, suffix, subcommand_files);
        } else if(file.name.endsWith(suffix)) {
            subcommand_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * @param {string} dir The directory
 * @param {string} suffix The file suffix to search for
 * @returns {array} The list of subcommand files
 */
async function GetSubCommandFiles(dir, suffix) {
    let subcommand_files = [];

    _GetDirSubCommandFiles(dir, suffix, subcommand_files);

    return subcommand_files;
}


/**
 * @param {object} client The active Discord client
 * @param userResolvable A userResolvable
 */
async function IsSuperUser(client, userResolvable) {
    const config = await GetConfig();
    const userId = client.users.resolveId(userResolvable);

    if(config.superUsers.includes(userId)) {
        return true;
    }
    return false;
}


/**
 * @async
 * @param {string} method The method to use {`append`, `read`}.
 * @param {string} tag The tag at the beginning of the line.
 * @param {string} body The main content.
 * @param {string} type The type of the message {`DEBUG`, `ERROR`, `FATAL`, `INFO`, `WARN`}.
 * @returns {object} `return_object`.
 */
async function Log(method, tag, body, type) {
    switch(method) {
        case "append": {
            // Declaring variables
            const now = new Date();

            let tagLenght = 0;
            let tagExtraIndentNum = 0;
            let tagExtraIndent = "";
            let typeLenght = 0;
            let typeExtraIndentNum = 0;
            let typeExtraIndent = "";

            // Get current date
            const now_date = date.format(now, "YYYY-MM-DD");
            const now_time = date.format(now, "HH:mm:ss.SSS");

            // Generate the log file name
            const file_name = `${now_date}_JerryBot.log`;

            // Generate the new line content
            if(tag == null) {
                tag = "------------------";
            }
            tagLenght = tag.length;
            tagExtraIndentNum = 19 - tagLenght;
            for(let i = 0; i < tagExtraIndentNum; i++) {
                tagExtraIndent = tagExtraIndent + " ";
            }

            // DEBUG, ERROR, FATAL, INFO, WARN; │, ─, ├─, └─
            if(!type) {
                throw `Cannot use type of ${type}`;
            }

            typeLenght = type.length;
            typeExtraIndentNum = 5 - typeLenght;

            for(let i = 0; i < typeExtraIndentNum; i++) {
                typeExtraIndent = typeExtraIndent + " ";
            }

            const parsed_body = `[${tagExtraIndent}${tag}] [${now_time}] [JerryBot/${type}]:${typeExtraIndent} ${body}`;

            const return_object = {
                body: body,
                fileName: file_name,
                parsedBody: parsed_body
            };

            // Append to file
            fs.appendFile(`./logs/${file_name}`, parsed_body + "\n", (err) => {
                if(err) {
                    throw err;
                }
            });
            RegisterEvent(type, 1);
            return return_object;
        }
        case "read": {
            // Read stuff
        }
            break;
        default:
            throw "Unknown logging method.";
    }
}


/**
 * @async
 * @param {object} interaction The Discord interaction object.
 * @returns {boolean} Whether or not the execution is authorized.
 */
async function PermissionCheck(interaction) {
    const config = await GetConfig();

    if(config.userBlacklist.includes(interaction.member.id)) {
        const user_blacklisted = new MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle("User Blacklisted")
            .setDescription("I'm sorry but you are in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
            .setFooter({text: "Contact Jerry#3756 for help."});

        try {
            interaction.reply({embeds: [user_blacklisted]});
        } catch {
            interaction.editReply({embeds: [user_blacklisted]});
        }

        await Log("append", interaction.guild.id, `└─"@${interaction.user.tag}" is blacklisted from the bot. [UserBlacklist]`, "WARN");
        return false;
    } else if(config.superUsers.includes(interaction.member.id)) {
        if(config.guildBlacklist.includes(interaction.guild.id)) {
            const guild_blacklisted_warning = new MessageEmbed()
                .setColor("FUCHSIA")
                .setTitle("Guild Blacklisted Warning")
                .setDescription(`<@${interaction.user.id}>, This guild is blacklisted! Execution authorized (super user).`)

            interaction.channel.send({embeds: [guild_blacklisted_warning]});
            Log("append", interaction.guild.id, `├─"${interaction.guild.name}" is blacklisted from the bot. Execution authorized (super user).`, "WARN");
        }

        await Log("append", interaction.guild.id, `├─"@${interaction.user.tag}" is a super user. Execution authorized.`, "INFO");
        return true;
    } else if(config.guildBlacklist.includes(interaction.guild.id)) {
        const guild_blacklisted = new MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle("Guild Blacklisted")
            .setDescription("I'm sorry but this Guild is in the bot's blacklist. Please contact the bot administrators if you believe that this is an error.")
            .setFooter({text: "Contact Jerry#3756 for help."});

        try {
            interaction.reply({embeds: [guild_blacklisted]});
        } catch {
            interaction.editReply({embeds: [guild_blacklisted]});
        }

        await Log("append", interaction.guild.id, `└─"${interaction.guild.name}" (${interaction.guild.id}) is blacklisted from the bot. [GuildBlacklist]`, "WARN");
        return false;
    }

    const guilds = await GetGuildConfigMap();

    let commandName = interaction.commandName;
    const subcommand_name = interaction.options.getSubcommand(false);

    var permissionSet = {};

    for(const [key, value] of guilds) {
        if(key == interaction.guild.id) {
            // get guild commandPermissions
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

    for(const category of Object.values(permissionSet)) {
        const command = category[commandName];

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

    if(permissionValue === undefined || permissionValue === null) {
        await Log("append", interaction.guild.id, `Could not find a permissionValue for "/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}"`, "FATAL");
        throw `Could not find a permissionValue for "/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}"`;
    }

    if(permissionValue === 0 || await GetHighestPL(interaction.member) <= permissionValue) {
        return true;
    }

    const error_permissions = new MessageEmbed()
        .setColor("RED")
        .setThumbnail(`${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`)
        .setTitle('PermissionError')
        .setDescription("I'm sorry but you do not have the permissions to perform this command. Please contact the bot administrators if you believe that this is an error.")
        .setFooter({text: "Use '/help' to access the documentation on command permissions."});

    try {
        await interaction.reply({embeds: [error_permissions]});
    } catch {
        await interaction.editReply({embeds: [error_permissions]});
    }

    await Log("append", interaction.guild.id, `└─"@${interaction.user.tag}" did not have the required role to execute "/${interaction.commandName}${interaction.options.getSubcommand(false) ? " " + interaction.options.getSubcommand(false) : ""}". [PermissionError]`, "WARN");
    return false;
}


/**
 * Sleep
 * @async `await` must be used when calling `Sleep()`.
 * @param {integer} delayInMsec The delay to wait for in milliseconds.
 * @throws {TypeError} Throws if `delayInMsec` is `NaN`.
 */
async function Sleep(delayInMsec) {
    if(isNaN(delayInMsec)) {
        throw TypeError("delayInMsec is not a number", "sleep.js", 8);
    }
    await new Promise(resolve => setTimeout(resolve, delayInMsec));
}


/**
 * @param {object} client The active Discord client
 * @param {array} commands The application commands to register in the `ready` event
 */
async function StartEventListeners(client, commands) {
    console.log("Starting event listeners...");
    Log("append", "JerryUtils", "Starting event listeners...", "DEBUG");

    const event_files = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

    console.log(`Event files (${event_files.length}):`);
    console.log(event_files);

    for(const event_file of event_files) {
        const event = require(`../events/${event_file}`);

        if(event.once) {
            client.once(event.name, (...args) => event.execute(...args, commands));
        } else {
            client.on(event.name, (...args) => event.execute(...args, commands));
        }
    }
}


/**
 * StartJobs starts the jobs located in `root/jobs`.
 * @param {object} client The Discord client.
 */
async function StartJobs(client) {
    console.log("Starting jobs...");
    await Log("append", "JerryUtils", "Starting jobs...", "DEBUG");

    const job_files = fs.readdirSync("./jobs").filter(file => file.endsWith(".js"));

    console.log(`Job files (${job_files.length}):`);
    console.log(job_files);

    for(const job_file of job_files) {
        const {Execute} = require(`../jobs/${job_file}`);
        Execute(client);
    }
}


/**
 * ToNormalized removes irregular characters from a string.
 * @param {string} string The string to normalize.
 * @return {string} The normalized string.
 */
function ToNormalized(string) {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


module.exports = {
    GetCommandFiles,
    GetSubCommandFiles,
    IsSuperUser,
    Log,
    Sleep,
    StartJobs,
    StartEventListeners,
    ToNormalized,
    // Import relaying
    AddGuild,
    GetConfig,
    GetGuildConfigMap,
    GetHighestPL,
    PermissionCheck,
    RefreshDataset,
    RemoveGuild,
    SetPermissions,
};
