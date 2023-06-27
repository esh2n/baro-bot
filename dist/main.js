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
client.on('ready', () => {
    console.log('Bot is ready.');
    const textChannel = client.channels.cache.find(channel => channel.id === '1006967319676846130');
    if (textChannel) {
        node_cron_1.default.schedule('0 10 * * *', () => {
            const emojiSets = [
                ['🐢', '🐍', '🦎', '🐊'],
                ['🐬', '🐳', '🐠', '🐙'],
                ['🙈', '🙉', '🙊', '🐒'],
                ['🦁', '🐯', '🐅', '🐆'],
                ['🦉', '🦅', '🦆', '🐧'],
                ['🌳', '🍁', '🍄', '🌰'],
                ['⭐️', '🌙', '☀️', '☁️'],
                ['🍎', '🍌', '🍇', '🍓'],
                ['🥦', '🥕', '🌽', '🍅'],
                ['💖', '💙', '💚', '💛'],
                ['🎸', '🎷', '🥁', '🎻'],
                ['⚽️', '🏀', '🏈', '⚾️'],
                ['🍵', '🍶', '🍷', '🍺'],
                ['🚗', '✈️', '🚀', '⛵️'],
                ['🏞', '🌆', '🏝', '🌉'],
                ['🎂', '🍦', '🍪', '🍩'],
                ['🎈', '🎁', '🎉', '🎊'],
                ['📚', '✏️', '🎓', '🔬'],
                ['💡', '💻', '📱', '⌚️'],
                ['🎭', '🎨', '🎬', '🎤']
            ];
            const randomEmojiSet = emojiSets[Math.floor(Math.random() * emojiSets.length)];
            textChannel.send(`よるぼ！\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}`)
                .then(message => {
                message.react(randomEmojiSet[0]);
                message.react(randomEmojiSet[1]);
                message.react(randomEmojiSet[2]);
                message.react(randomEmojiSet[3]);
            });
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
client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState && oldState) {
        const textChannel = newState.guild.channels.cache.find((channel) => channel.id === '1006967319676846130');
        if (oldState.channelId === newState.channelId) {
        }
        if (oldState.channelId === null && newState.channelId != null) {
            const voiceChannel = newState.channel;
            if (voiceChannel.members.size === 1) {
                const vcName = voiceChannel.name;
                if (vcName === 'VALORANT' || vcName === '雑談') {
                    ;
                    textChannel.send(`@VALORANT ${newState.member.nickname || newState.member.user.username}さんがVC「${vcName}」であなたを待っています。可哀想なので参加してあげましょう。`);
                }
            }
        }
        if (oldState.channelId != null && newState.channelId === null) {
        }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN || '');
require("./commands");
