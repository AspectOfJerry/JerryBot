const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");

const {log, permissionCheck, sleep, toNormalized} = require("../../modules/JerryUtils.js");
const {getConfig} = require("../../database/mongodb.js");

const crypto = require("crypto");


module.exports = async function (client, interaction) {
    // await interaction.deferReply();

    if(await permissionCheck(interaction, -1) === false) {
        return;
    }

    // Generate the one time use password
    const auth_code = "0x" + crypto.randomBytes(3).toString("hex").toUpperCase();

    // Generate the second-in-command superuser

    // Declaring variables
    let status = "waiting";
    const success_emoji = "<:success:1102349129390248017>";
    const warn_emoji = "<:warn:1102349145106284584>";
    const fail_emoji = "<:fail:1102349156976185435>";

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("arm_button")
                .setLabel("Arm")
                .setEmoji("🔓")
                .setStyle("SUCCESS")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("execute_button")
                .setLabel("Execute")
                .setEmoji("🎯")
                .setStyle("DANGER")
                .setDisabled(true),
            new MessageButton()
                .setCustomId("abort_button")
                .setLabel("Abort")
                .setEmoji("🛑")
                .setStyle("SECONDARY")
        );

    // Choosing second-in-command superuser
    const superusers = (await getConfig()).superUsers;
    superusers.splice(superusers.indexOf(interaction.user.id), 1); // remove the user to not get picked below

    // superusers.push("803041326005485569"); // test

    const sic = client.users.resolve(superusers[Math.floor(Math.random() * superusers.length)]) ?? interaction.user;

    const embed = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle(":warning: Discord guild nuking request")
        .setAuthor({name: `${interaction.user.username}`, iconURL: `${interaction.member.user.displayAvatarURL({dynamic: true, size: 32})}`})
        .setDescription("This is a test. This is only a test.")
        .addFields(
            {
                name: "Time", value: `${new Date()}`, inline: false
            },
            {
                name: "AuthCode", value: `Your authorization code is: \`${auth_code}\`.\nPlease send it to the bot in Direct Message within twenty (20) seconds in order to confirm your choice.`
            },
            {
                name: "Second-in-command", value: "*waiting for your confirmation*"
            }
        );

    // Checks

    // Main
    const message = await interaction.reply({embeds: [embed], components: [row], fetchReply: true});

    const user_challenge = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle(":warning: Discord guild nuking request")
        .setDescription("Awaiting authorization code...");

    const msg_challenge = await interaction.user.send({embeds: [user_challenge], fetchReply: true});

    // Challenge-response
    const filter = m => m.content.includes(auth_code);
    await msg_challenge.channel.awaitMessages({filter, max: 1, time: 20000, errors: ["time"]})
        .then(async (collected) => {
            collected = collected.first();

            // Double check
            if(collected.content !== auth_code) {
                status = "fail";
                throw "Fatal logic error: button id mismatch.";
            }

            status = "authCodePositive";

            const approved = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`${success_emoji} The authorization code is correct.`)
                .addFields(
                    {
                        name: "Take me back", value: `<#${message.channel.id}>`, inline: false
                    }
                );

            collected.channel.send({embeds: [approved]});
        }).catch((err) => {
            console.log(err);
        });

    if(status !== "authCodePositive") {
        console.log("BREAK");
        return;
    }

    console.log(status);

    embed.setFields(
        {
            name: "Time", value: `${new Date()}`, inline: false
        },
        {
            name: "AuthCode", value: `Your authorization code is: \`${auth_code}\`.\nPlease send it to the bot in Direct Message within 30 seconds in order to confirm your choice.`
        },
        {
            name: "Second-in-command", value: "A second-in-command will be chosen upon arming.", inline: false
        }
    );

    row.components[0].setDisabled(false);

    await message.edit({embeds: [embed], components: [row]})
        .then(async (msg) => {
            const filter = async (buttonInteraction) => {
                if(buttonInteraction.user.id === interaction.user.id && buttonInteraction.customId === "arm_button") {
                    return true;
                } else {
                    await buttonInteraction.reply({content: "You cannot use this button.", ephemeral: true});
                    await log("append", interaction.guild.id, `├─'${buttonInteraction.user.tag}' did not have the permission to use this button.`, "WARN");
                    return;
                }
            };

            await msg.awaitMessageComponent({filter, time: 360000})
                .then((buttonInteraction) => {
                    // Double check
                    if(buttonInteraction.customId !== "arm_button") {
                        status = "fail";
                        throw "Fatal logic error: button id mismatch.";
                    }
                    buttonInteraction.deferUpdate();

                    row.components[0]
                        .setLabel("Armed")
                        .setEmoji("🔐");

                    message.edit({components: [row]});
                    status = "goSic";
                });
        });

    // Approved by user, go for sic

    if(status !== "goSic") {
        console.log("BREAK");
        return;
    }

    console.log(status);

    embed.setFields(
        {
            name: "Time", value: `${new Date()}`, inline: false
        },
        {
            name: "AuthCode", value: `Your authorization code is: \`${auth_code}\`.\nPlease send it to the bot in Direct Message within 30 seconds in order to confirm your choice.`
        },
        {
            name: "Second-in-command", value: `A separate code has been sent to the second-in-command (<@${sic.id}>).\nThey have 5 minutes to approve.`

        }
    );

    message.edit({embeds: [embed]});

    const sic_row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId("sic_approve_button")
                .setLabel("Approve")
                .setEmoji(`${success_emoji}`)
                .setStyle("SUCCESS"),
            new MessageButton()
                .setCustomId("sic_reject_button")
                .setLabel("Reject")
                .setEmoji(`${fail_emoji}`)
                .setStyle("DANGER")
        );

    const sic_embed = new MessageEmbed()
        .setColor("FUCHSIA")
        .setTitle(":warning: Discord guild nuking request")
        .setDescription("Because of your superuser position, you have been randomly chosen to be the second-in-command for the nuking of a guild.\nYou have five (5) minutes to approve or reject the request.")
        .addFields(
            {
                name: "Requested by", value: `<@${interaction.user.id}>`, inline: false
            },
            {
                name: "Guild", value: `Name:"${interaction.guild.name}"\nID:"${interaction.guild.id}"`, inline: false
            },
            {
                name: "Location", value: `<#${message.channel.id}>`
            }
        );

    // Waiting for second-in-command superuser

    const sic_msg = await sic.send({embeds: [sic_embed], components: [sic_row], fetchReply: true})
        .then(async (msg) => {
            const filter = async (buttonInteraction) => {
                if(buttonInteraction.user.id === sic.id && (buttonInteraction.customId === "sic_approve_button" || buttonInteraction.customId === "sic_reject_button")) {
                    return true;
                }
            };

            await msg.awaitMessageComponent({filter, time: 300000})
                .then((buttonInteraction) => {
                    if(buttonInteraction.customId === "sic_approve_button") {
                        buttonInteraction.deferUpdate();

                        sic_row.components[0]
                            .setLabel("Approved")
                            .setDisabled(true);
                        sic_row.components[1]
                            .setStyle("SECONDARY")
                            .setDisabled(true);

                        msg.edit({components: [sic_row]});
                        status = "goSic";
                    } else if(buttonInteraction.customId === "sic_reject_button") {
                        buttonInteraction.deferUpdate();

                        sic_row.components[1]
                            .setLabel("Rejected")
                            .setDisabled(true);
                        sic_row.components[0]
                            .setStyle("SECONDARY")
                            .setDisabled(true);

                        msg.edit({components: [sic_row]});
                        status = "goSic";
                    } else {
                        status = "fail";
                        throw "Fatal logic error: button id mismatch.";
                    }
                    status = "void";
                });
        });

    console.log(status);

    // Execute

    // Logs
};
