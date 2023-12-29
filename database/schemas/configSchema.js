import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true, immutable: true},
    guildBlacklist: [String],
    superUsers: [String],
    userBlacklist: [String],
    voiceChannelHubs: [String]
});

export default mongoose.model("configSchema", configSchema, "config");
