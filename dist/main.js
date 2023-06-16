"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const yomiage_1 = __importDefault(require("./commands/yomiage"));
const stats_1 = __importDefault(require("./commands/stats"));
const ask_1 = __importDefault(require("./commands/ask"));
const ask_tactics_1 = __importDefault(require("./commands/ask-tactics"));
const bo_1 = __importDefault(require("./commands/bo"));
const crosshair_1 = __importDefault(require("./commands/crosshair"));
const flower_meaning_1 = __importDefault(require("./commands/flower-meaning"));
const child_process_1 = require("child_process");
const http_1 = __importDefault(require("http"));
require('dotenv').config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
http_1.default
    .createServer(function (_, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Discord bot is active now \n');
})
    .listen(process.env.PORT);
client.on('ready', () => {
    console.log('Bot is ready.');
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = interaction.commandName;
    switch (command) {
        case 'ask':
            await ask_1.default.handle(interaction, client);
            break;
        case 'ask-tactics':
            await ask_tactics_1.default.handle(interaction, client);
            break;
        case 'bo':
            await bo_1.default.handle(interaction, client);
            break;
        case 'crosshair':
            await crosshair_1.default.handle(interaction, client);
            break;
        case 'flower-meaning':
            await flower_meaning_1.default.handle(interaction, client);
            break;
        case 'stats':
            await stats_1.default.handle(interaction, client);
            break;
        case 'yomiage':
            await yomiage_1.default.handle(interaction, client);
            break;
        default:
            break;
    }
});
client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }
    if (!yomiage_1.default.connection) {
        console.log('Not connected to voice channel.');
        return;
    }
    const channelId = message.channel.id;
    if (channelId !== '757145883648327758' &&
        channelId !== '1006967489881718836') {
        return;
    }
    let text = message.content;
    (0, child_process_1.exec)('rm audio.wav');
    const userID = message.author.id;
    const speakerId = yomiage_1.default.setSpeakerIdByUserIdIfNotExist(userID);
    await yomiage_1.default.writeWavFile(text, speakerId);
    await yomiage_1.default.playAudio();
});
client.login(process.env.DISCORD_BOT_TOKEN || '');
require("./commands");
