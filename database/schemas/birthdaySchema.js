const mongoose = require("mongoose");


const birthdaySchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true, immutable: true},
    username: {type: String, unique: false},
    name: {type: String, required: true, unique: false},
    day: {type: Number, required: true, integer: true, min: 1, max: 31},
    month: {type: Number, required: true, integer: true, min: 1, max: 12}
});

module.exports = mongoose.model("birthdaySchema", birthdaySchema, "bday");
