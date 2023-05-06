const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const fs = require("fs");
const date = require("date-and-time");


async function getTodayBirthdays() {
    const birthdays = require("../database/commands/birthday/birthdays.json");

}

module.exports = {
    getTodayBirthdays
};
