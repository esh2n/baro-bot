"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands");
const http_1 = __importDefault(require("http"));
require('dotenv').config();
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
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
            await new commands_1.Ask().handle(interaction, client);
            break;
        case 'ask-tactics':
            await new commands_1.AskTactics().handle(interaction, client);
            break;
        case 'bo':
            await new commands_1.Bo().handle(interaction, client);
            break;
        case 'crosshair':
            await new commands_1.Crosshair().handle(interaction, client);
            break;
        case 'flower-meaning':
            await new commands_1.FlowerMeaning().handle(interaction, client);
            break;
        case 'stats':
            await new commands_1.Stats().handle(interaction, client);
            break;
        default:
            break;
    }
});
client.login(process.env.DISCORD_BOT_TOKEN || '');
require("./commands");
