const mongoose = require("mongoose");

let studentSchema = new mongoose.Schema({
    metadata: {
        required: true
    },
    superUsers: []
});