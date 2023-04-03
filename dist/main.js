"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("./lib/valorant-api/index");
const index_2 = require("./lib/openai-api/index");
const gas_1 = require("./lib/gas");
const http_1 = __importDefault(require("http"));
const querystring_1 = __importDefault(require("querystring"));
require('dotenv').config();
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
http_1.default.createServer(function (req, res) {
    if (req.method == 'POST') {
        let data = "";
        req.on('data', function (chunk) {
            data += chunk;
        });
        req.on('end', function () {
            if (!data) {
                console.log("No post data");
                res.end();
                return;
            }
            const dataObject = querystring_1.default.parse(data);
            console.log("post:" + dataObject.type);
            if (dataObject.type == "wake") {
                console.log("Woke up in post");
                res.end();
                return;
            }
            res.end();
        });
    }
    else if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is active now\n');
    }
}).listen(process.env.PORT);
client.on('ready', () => {
    console.log('Bot is ready.');
});
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
        return;
    switch (interaction.commandName) {
        case 'baro-bo':
            try {
                const message = interaction.options.getString('message');
                await interaction.deferReply();
                await (0, gas_1.sendGAS)(message, client, interaction.user);
                await interaction.editReply({ content: `\nhoge` });
            }
            catch (error) {
                console.error(error);
                await interaction.reply('エラーが発生しました。');
            }
            break;
        case 'baro-ask':
            try {
                const prompt = interaction.options.getString('ask');
                await interaction.deferReply();
                const rulePrompt = `
        あなたは口を開けば正論パンチしかしない、「正論パンチくん」です。
        以下のルールに従って問いかけに対し、回答をしてください。
        1. 日本語で回答してください。
        2. 回答は100字以内に収めてください。
        3. 言葉遣いは乱暴で、冷たくしてください。
        4. 相手のことは「お前」、自分のことは「私」としてください。
        5. 漢字や誤字脱字など言葉のミスは必要以上に責めてください。
        6. 1/10の確率で優しい回答をしてください。
        7. 回答文のみを提示してください。


        問いかけ:
        `;
                const answer = await (0, index_2.generateAIResponse)(prompt, rulePrompt);
                await interaction.editReply({ content: `\n${prompt}\n${answer}` });
            }
            catch (error) {
                console.error(error);
                await interaction.reply('エラーが発生しました。');
            }
            break;
        case 'valorant-stats':
            try {
                const playerName = interaction.options.getString('playername');
                let tag = interaction.options.getString('tag');
                if (tag.startsWith('#')) {
                    tag = tag.substring(1);
                }
                await interaction.deferReply();
                const [recentMatches, agentImageFiles] = await (0, index_1.getEmbedRecentMatchData)(playerName, tag);
                await interaction.editReply({ content: `\n${playerName}#${tag}さんの直近5試合`, embeds: recentMatches, files: agentImageFiles });
            }
            catch (error) {
                console.error(error);
                await interaction.reply('エラーが発生しました。');
            }
            break;
        case 'baro-ask-tactics':
            try {
                const agent = interaction.options.getString('agent');
                const map = interaction.options.getString('map');
                const alliedEcoRound = interaction.options.getString('allied-eco-round');
                const enemyEcoRound = interaction.options.getString('enemy-eco-round');
                const team = interaction.options.getString('team');
                const prompt = (0, index_2.getUserPrompt)(agent, map, alliedEcoRound, enemyEcoRound, team);
                await interaction.deferReply();
                const rulePrompt = `
          You are an excellent tactician in the game Valorant, produced by Riot Games.

          The output should be a markdown code snippet formatted in the following schema in Japanese:

          \`\`\`json
          [
              {
                  title: string, // operation name.
                  detail: string // operation detail.
              },
              {
                  title: string, // operation name.
                  detail: string // operation detail.
              },
          ]
          \`\`\`

          NOTES:
          * Do not include non-existent map names or character names.
          * Please provide at least three effective strategies.
          * Please do not include anything other than JSON in your answer.
          * Response must be Japanese
          * If the question includes "whether it is an eco-round" or "where is the map" or "what agent is used" or "whether it is offensive or defensive", please take this into account.
          `;
                const answer = await (0, index_2.generateAIResponse)(prompt, rulePrompt);
                await interaction.editReply({ content: `\n${answer}` });
            }
            catch (error) {
                console.error(error);
                await interaction.reply('エラーが発生しました。');
            }
            break;
        default:
            break;
    }
});
client.login(process.env.DISCORD_BOT_TOKEN || '');
require("./commands");
