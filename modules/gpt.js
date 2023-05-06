const process = require("process");
const {Client, Collection, Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, TextInputComponent} = require("discord.js");
const {Configuration, OpenAIApi} = require("openai");


let configed = false;
let openai;

function configOpenAI() {
    if(configed) {
        throw "config() should only be called once.";
    }

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(configuration);
    configed = true;
}


/**
 * @param {Object} message The prompt to prompt
 */
async function gpt(message, client) {
    try {
        const prompt = message.content;
        const requesting = new MessageEmbed()
            .setColor("YELLOW")
            .setAuthor({name: `${message.author.name}`, iconURL: `${message.member.user.displayAvatarURL({dynamic: true, size: 32})}`})
            .setTitle(`${prompt}`)
            .setDescription("*Generating response... This may take around 5 seconds.*")
            .setFooter({text: "OpenAI gpt-3.5-turbo"});

        message.reply({embeds: [requesting]});
        message.channel.sendTyping();
        const completion = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: `${prompt}`,
            temperature: 0.7,
            n: 1
        });

        // CODE FROM CHATGPT
        // const openai = require('openai');
        // const api_key = 'YOUR_API_KEY';

        // openai.api_key = api_key;

        // const prompt = 'Hello, World!';
        // const model = 'text-davinci-002';
        // const max_tokens = 5;

        // // Define a function to handle the streamed responses
        // const handleResponse = (response) => {
        //     console.log(response.choices[0].text);
        // }

        // // Call the stream method to start streaming responses
        // const stream = openai.completions.stream({
        //     prompt: prompt,
        //     model: model,
        //     max_tokens: max_tokens,
        //     n: 1,
        //     stop: '\n',
        // });

        // // Attach the response handler function to the stream
        // stream.on('data', handleResponse);

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor({name: `${message.author.name}`, iconURL: `${message.member.user.displayAvatarURL({dynamic: true, size: 32})}`})
            .setTitle(`${prompt}`)
            .setDescription(`${completion.data.choices[0].text}`)
            .setFooter({text: "OpenAI gpt-3.5-turbo"});

        message.editReply({embeds: [embed]});
    } catch(err) {
        if(err.response) {
            console.log(err.response.status);
            // console.log(err.response.data);
        } else {
            console.log(err.message);
        }
    }
}


module.exports = {
    configOpenAI,
    gpt
};
