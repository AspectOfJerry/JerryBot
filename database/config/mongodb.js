const {MongoClient} = require("mongodb");

const uri = `mongodb+srv://JerryBotAdmin:${process.env.MONGO_PW}@cluster0.3vjmcug.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function fetchDB(req) {
    try {
        const database = client.db("foo");
        const configs = client.collection("configs");

        const query = {id: req.guildId};
        const config = await configs.findOne(query);

        console.log(config);
    } catch(err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

module.exports = {
    fetchDB
};
