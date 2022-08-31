const fs = require('fs')

const GetFiles = (dir, file_suffix) => {
    const files = fs.readdirSync(dir, {
        withFileTypes: true
    })

    let command_files = [];
    let ignored_files = [];
    let skipped_files = [];

    for(const file of files) {
        if(file.name.endsWith(".subcmd.js")) {
            ignored_files.push(`${dir}/${file.name} => subcommand`); // Ignoring subcommand files because they will be called by the handler.
            continue;
        } else if(file.name.endsWith(".todo")) {
            ignored_files.push(`${dir}/${file.name} => todo`);
            continue;
        } else if(file.name.endsWith(".template.js")) {
            ignored_files.push(`${dir}/${file.name} => template file`);
            continue;
        } else if(file.name.endsWith(".subcmd_hdlr.js")) {
            skipped_files.push(`${dir}/${file.name} => subcommand handler`);
            // Do not put `continue;` here! Subcommand handlers should not be ignored and they are considered as command files.
        }

        if(file.isDirectory()) {
            command_files = [
                ...command_files,
                ...GetFiles(`${dir}/${file.name}`, file_suffix),
            ];
        } else if(file.name.endsWith(file_suffix)) {
            command_files.push(`${dir}/${file.name}`);
        }
    }

    console.log(`Ignored ${ignored_files.length} files:`);
    console.log(ignored_files);
    console.log(`Skipped ${skipped_files.length} files:`);
    console.log(skipped_files);
    return command_files;
}

module.exports = GetFiles;
