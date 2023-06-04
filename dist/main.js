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
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Discord bot is active now \n");
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
        case 'baro-bo':
            await (0, commands_1.handleBaroBo)(interaction, client);
            break;
        case 'baro-ask':
            await (0, commands_1.handleBaroAsk)(interaction, client);
            break;
        case 'baro-stats':
            await (0, commands_1.handleBaroStats)(interaction, client);
            break;
        case 'baro-crosshair':
            await (0, commands_1.handleBaroCrosshair)(interaction, client);
            break;
        case 'baro-ask-tactics':
            await (0, commands_1.handleBaroAskTactics)(interaction, client);
            break;
        default:
            break;
    }
});
client.login(process.env.DISCORD_BOT_TOKEN || '');
require("./commands");
