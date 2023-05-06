const mongoose = require("mongoose");


const guildSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true, immutable: true},
    name: {type: String, unique: false},
    permissionRoles: {
        l1: {type: String, default: ""},
        l2: {type: String, default: ""},
        l3: {type: String, default: ""}
    }
});

module.exports = mongoose.model("guildSchema", guildSchema, "guild");
