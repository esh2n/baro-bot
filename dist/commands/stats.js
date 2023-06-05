"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = void 0;
const valorant_api_1 = require("../lib/valorant-api");
const client_1 = require("../lib/grapevineer/client");
class Stats {
    command;
    constructor() {
        this.command = {
            name: 'stats',
            description: 'VALORANTの直近20戦の戦績を表示します。',
            options: [
                {
                    name: 'playername',
                    type: 3,
                    description: 'プレイヤー名#タグ',
                    required: true,
                    choices: [],
                },
            ],
        };
        this.initialize();
    }
    async initialize() {
        let choices = [];
        const players = await (0, client_1.getAllPlayers)();
        players.map((player) => {
            const choice = {
                name: player.getName() + '#' + player.getPlayerId(),
                value: player.getName() + '#' + player.getPlayerId(),
            };
            choices.push(choice);
        });
        this.command.options = [
            {
                name: 'playername',
                type: 3,
                description: 'プレイヤー名#タグ',
                required: true,
                choices: choices,
            },
        ];
    }
    waitSeconds = (second) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000 * second);
        });
    };
    handle = async (i, _) => {
        try {
            const playerNameWithTag = i.options.getString('playername');
            const [playerName, tag] = playerNameWithTag.split('#');
            await i.deferReply();
            const [recentMatches, agentImageFiles] = await (0, valorant_api_1.getEmbedRecentMatchData)(playerName, tag);
            await i.editReply({
                content: `\n${playerName}#${tag}さんの直近5試合`,
                embeds: recentMatches,
                files: agentImageFiles,
            });
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
}
exports.Stats = Stats;
