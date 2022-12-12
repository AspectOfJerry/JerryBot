const fs = require('fs');

const GetCurrentDirectoryFiles = (dir, file_suffix, command_files, ignored_files, skipped_files) => {
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
            GetCurrentDirectoryFiles(`${dir}/${file.name}`, file_suffix, command_files, ignored_files, skipped_files);

        } else if(file.name.endsWith(file_suffix)) {
            command_files.push(`${dir}/${file.name}`);
        }
    }
};

const GetFiles = (dir, file_suffix) => {
    let command_files = [];
    let ignored_files = [];
    let skipped_files = [];

    GetCurrentDirectoryFiles(dir, file_suffix, command_files, ignored_files, skipped_files);

    console.log(`Ignored ${ignored_files.length} files:`);
    console.log(ignored_files);
    console.log(`Skipped ${skipped_files.length} files:`);
    console.log(skipped_files);
    return command_files;
};

module.exports = GetFiles;
