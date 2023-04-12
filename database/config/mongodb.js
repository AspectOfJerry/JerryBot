const mongoose = require("mongoose");

const uri = `mongodb+srv://JerryBotAdmin:${process.env.MONGO_PW}@cluster0.3vjmcug.mongodb.net/?retryWrites=true&w=majority`;


async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch(err) {
        console.error(err);
    }
}

module.exports = {
    connect
};
