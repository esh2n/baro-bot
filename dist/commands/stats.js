"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("../lib/grapevineer/client");
const fs_1 = __importDefault(require("fs"));
const valorant_api_1 = require("../lib/valorant-api");
class Stats {
    static instance = null;
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
    static getInstance() {
        if (!Stats.instance) {
            Stats.instance = new Stats();
        }
        return Stats.instance;
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
    async getEmbed(name, tag) {
        try {
            const [recentMatchesResponse, player] = await (0, valorant_api_1.getRecentMatches)(name, tag);
            const imageFiles = [];
            const recentMatches = recentMatchesResponse
                .slice(0, 20)
                .map((match, index) => {
                const playerInMatch = match.players.all_players.find((p) => p.puuid === player.puuid);
                const playerRank = playerInMatch?.currenttier_patched;
                if (!playerInMatch) {
                    throw new Error(`Player not found in match #${index + 1}`);
                }
                const playerTeam = playerInMatch?.team;
                const winningTeam = match.teams.red.has_won ? 'Red' : 'Blue';
                const isWin = playerTeam === winningTeam ? '👍' : '👎';
                const winColor = isWin === '👍' ? 0x0000ff : 0xff0000;
                const { kills, deaths, assists, headshots, bodyshots, legshots, score, } = playerInMatch.stats;
                const headshotPercentage = Math.round((headshots / (headshots + bodyshots + legshots)) * 100);
                const agent = playerInMatch.character;
                const agentImage = this.getAgentImageUrl(agent);
                imageFiles.push(agentImage);
                const rankImage = this.getRankImageUrl(playerRank);
                const rankImageUrl = this.getRankImageFilename(playerRank);
                imageFiles.push(rankImage);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`${agent} ${kills}/${deaths}/${assists} | HS%: ${headshotPercentage}% | Store: ${score}`)
                    .setAuthor({
                    name: `#${index + 1} ${match.metadata.map} ${isWin}`,
                    iconURL: `attachment://${rankImageUrl}.png`,
                })
                    .setThumbnail(`attachment://${agent}.png`)
                    .setColor(winColor)
                    .setFooter({
                    text: `${match.metadata.mode}, ${match.metadata.game_start_patched}`,
                    iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4',
                });
                return embed;
            });
            return [recentMatches, imageFiles];
        }
        catch (error) {
            const embed = new discord_js_1.EmbedBuilder().setTitle(`エラーが発生しました。${error}`);
            return [[embed], []];
        }
    }
    getAgentImageUrl = (agentName) => {
        const imagePath = `./assets/icon/${agentName}.png`;
        const attachment = new discord_js_1.AttachmentBuilder(fs_1.default.readFileSync(imagePath), {
            name: `${agentName}.png`,
        });
        return attachment;
    };
    getRankImageFilename = (rank) => {
        const rankName = rank.replace(' ', '_');
        return `${rankName}_Rank`;
    };
    getRankImageUrl = (rank) => {
        const imagePath = `./assets/rank/${this.getRankImageFilename(rank)}.png`;
        const attachment = new discord_js_1.AttachmentBuilder(fs_1.default.readFileSync(imagePath), {
            name: `${this.getRankImageFilename(rank)}.png`,
        });
        return attachment;
    };
    handle = async (i, _) => {
        try {
            const playerNameWithTag = i.options.getString('playername');
            const [playerName, tag] = playerNameWithTag.split('#');
            await i.deferReply();
            const [recentMatches, agentImageFiles] = await this.getEmbed(playerName, tag);
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
exports.default = Stats.getInstance();
