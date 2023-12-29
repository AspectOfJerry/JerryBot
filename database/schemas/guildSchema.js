import mongoose from "mongoose";


const guildSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true, immutable: true},
    name: {type: String, unique: false},
    permissionRoles: {
        l1: {type: String, default: ""},
        l2: {type: String, default: ""},
        l3: {type: String, default: ""}
    }
});

export default mongoose.model("guildSchema", guildSchema, "guild");
