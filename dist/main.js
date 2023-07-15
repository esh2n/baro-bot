"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const yomiage_1 = __importDefault(require("./commands/yomiage"));
const stats_1 = __importDefault(require("./commands/stats"));
const ask_1 = __importDefault(require("./commands/ask"));
const bo_1 = __importDefault(require("./commands/bo"));
const crosshair_1 = __importDefault(require("./commands/crosshair"));
const flower_1 = __importDefault(require("./commands/flower"));
const store_1 = __importDefault(require("./commands/store"));
const child_process_1 = require("child_process");
const http_1 = __importDefault(require("http"));
const node_cron_1 = __importDefault(require("node-cron"));
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
client.on('ready', async () => {
    console.log('Bot is ready.');
    const textChannel = client.channels.cache.find((channel) => channel.id === '1006967319676846130');
    if (textChannel) {
        node_cron_1.default.schedule('0 9 * * 1-5', async () => {
            bo_1.default.bo(textChannel, '夜', client);
        }, {
            scheduled: true,
            timezone: 'Asia/Tokyo',
        });
        node_cron_1.default.schedule('0 10 * * 0,6', async () => {
            bo_1.default.bo(textChannel, '終日', client);
        }, {
            scheduled: true,
            timezone: 'Asia/Tokyo',
        });
    }
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    const command = interaction.commandName;
    switch (command) {
        case 'ask':
            await ask_1.default.handle(interaction, client);
            break;
        case 'bo':
            await bo_1.default.handle(interaction, client);
            break;
        case 'crosshair':
            await crosshair_1.default.handle(interaction, client);
            break;
        case 'flower':
            await flower_1.default.handle(interaction, client);
            break;
        case 'stats':
            await stats_1.default.handle(interaction, client);
            break;
        case 'yomiage':
            await yomiage_1.default.handle(interaction, client);
            break;
        case 'store':
            await store_1.default.handleStore(interaction, client);
            break;
        case 'register':
            await store_1.default.handleRegister(interaction, client);
            break;
        default:
            break;
    }
});
client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    }
    switch (message.content) {
        case '!よるぼ':
            bo_1.default.bo(message.channel, '夜', client);
            break;
        case '!ひるぼ':
            bo_1.default.bo(message.channel, '昼', client);
            break;
        case '!あさぼ':
            bo_1.default.bo(message.channel, '朝', client);
            break;
        case '!おはよう':
            bo_1.default.bo(message.channel, '朝', client);
            break;
        case '!おやすみ':
            bo_1.default.bo(message.channel, '夜', client);
            break;
    }
    if (!yomiage_1.default.connection) {
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
client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member?.user.bot) {
        return;
    }
    if (newState && oldState) {
        const textChannel = newState.guild.channels.cache.find((channel) => channel.id === '1006967319676846130');
        if (oldState.channelId === newState.channelId) {
        }
        if (oldState.channelId === null && newState.channelId != null) {
            const voiceChannel = newState.channel;
            if (voiceChannel.members.size === 1) {
                const vcName = voiceChannel.name;
                if (vcName === 'VALORANT' || vcName === '雑談') {
                    let guild = client.guilds.cache.get('1005117753960693863');
                    if (!guild)
                        return;
                    let role = guild.roles.cache.find((role) => role.name === 'VALORANT');
                    if (!role)
                        return;
                    textChannel.send(`<@&${role.id}> ${newState.member.nickname || newState.member.user.username}さんがVC「${vcName}」であなたを待っています。可哀想なので参加してあげましょう。`);
                }
            }
        }
        if (oldState.channelId != null && newState.channelId === null) {
        }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN || '');
require("./commands");
