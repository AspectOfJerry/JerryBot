const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true, immutable: true},
    guildBlacklist: [String],
    superUsers: [String],
    userBlacklist: [String],
    voiceChannelHubs: [String]
});

module.exports = mongoose.model("configSchema", configSchema, "config");
