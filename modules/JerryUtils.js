const process = require('process');
const fs = require("fs");
const date = require('date-and-time');

// Import relaying
const {
    AddGuild,
    GetGuildConfigMap,
    GetHighestPL,
    PermissionCheck,
    RemoveGuild,
    SetPermissions
} = require('../database/config/dbms');

const Log = require('./Log');
const Sleep = require('./Sleep');


/**
 * 
 */
async function GetDirCommandFiles(dir, suffix, command_files, ignored_files, skipped_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for(const file of files) {
        if(file.name.endsWith('.subcmd.js')) {
            ignored_files.push(`${dir}/${file.name} => subcommand`); // Ignoring subcommand files because they will be called by the handler.
            continue;
        } else if(file.name.endsWith('.todo')) {
            ignored_files.push(`${dir}/${file.name} => todo`);
            continue;
        } else if(file.name.endsWith('.template')) {
            ignored_files.push(`${dir}/${file.name} => template file`);
            continue;
        } else if(file.name.endsWith('.hdlr.js')) {
            skipped_files.push(`${dir}/${file.name} => subcommand handler`);
            // Do not put `continue;` here! Subcommand handlers should not be ignored as they work the same way as command files.
        } else if(file.name.endsWith('dbms.js')) {
            skipped_files.push(`${dir}/${file.name} => database manager`);
            continue;
        }

        if(file.isDirectory()) {
            GetDirCommandFiles(`${dir}/${file.name}`, suffix, command_files, ignored_files, skipped_files);
        } else if(file.name.endsWith(suffix)) {
            command_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * 
 */
async function GetCommandFiles(dir, suffix) {
    let command_files = [];
    let ignored_files = [];
    let skipped_files = [];

    GetDirCommandFiles(dir, suffix, command_files, ignored_files, skipped_files);

    console.log(`Ignored ${ignored_files.length} files:`);
    console.log(ignored_files);
    console.log(`Skipped ${skipped_files.length} files:`);
    console.log(skipped_files);
    return command_files;
}


/**
 * 
 */
async function GetDirSubCommandFiles(dir, suffix, subcommand_files) {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    });

    for(const file of files) {
        if(file.isDirectory()) {
            GetDirSubCommandFiles(`${dir}/${file.name}`, suffix, subcommand_files);
        } else if(file.name.endsWith(suffix)) {
            subcommand_files.push(`${dir}/${file.name}`);
        }
    }
}

/**
 * 
 */
async function GetSubCommandFiles(dir, suffix) {
    let subcommand_files = [];

    GetDirSubCommandFiles(dir, suffix, subcommand_files);

    return subcommand_files;
}


/**
 * 
 */
async function StartEventListeners(client, commands) {
    console.log("Starting event listeners...");
    await Log("append", 'JerryUtils', "Starting event listeners...", 'DEBUG');

    const event_files = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

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
    await Log("append", 'JerryUtils', "Starting jobs...", 'DEBUG');

    const job_files = fs.readdirSync('./jobs').filter(file => file.endsWith('.js'));

    console.log(`Job files (${job_files.length}):`);
    console.log(job_files);

    for(const job_file of job_files) {
        require(`../jobs/${job_file}`)(client);
    }
}


/**
 * ToNormalized removes accents from a string.
 * @param {string} string The string to remove the accents from.
 * @return {string} The normalized string.
 */
async function ToNormalized(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}


module.exports = {
    GetCommandFiles,
    GetSubCommandFiles,
    StartJobs,
    StartEventListeners,
    ToNormalized,
    // Import relaying
    AddGuild,
    GetGuildConfigMap,
    GetHighestPL,
    PermissionCheck,
    RemoveGuild,
    SetPermissions,
    Log,
    Sleep
};
