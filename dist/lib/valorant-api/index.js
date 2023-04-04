"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankImageFilename = exports.getEmbedRecentMatchData = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const getRecentMatches_1 = require("./getRecentMatches");
const getEmbedRecentMatchData = async (name, tag) => {
    const [recentMatchesResponse, player, mmr] = await (0, getRecentMatches_1.getRecentMatches)(name, tag);
    const imageFiles = [];
    const recentMatches = recentMatchesResponse.slice(0, 20).map((match, index) => {
        const playerInMatch = match.players.all_players.find(p => p.puuid === player.puuid);
        const playerRank = playerInMatch?.currenttier_patched;
        const actualRank = (0, getRecentMatches_1.getActualRank)(playerRank, mmr);
        if (!playerInMatch) {
            throw new Error(`Player not found in match #${index + 1}`);
        }
        const playerTeam = playerInMatch?.team;
        const winningTeam = match.teams.red.has_won ? 'Red' : 'Blue';
        const isWin = playerTeam === winningTeam ? '👍' : '👎';
        const winColor = isWin === '👍' ? 0x0000ff : 0xff0000;
        const { kills, deaths, assists } = playerInMatch.stats;
        const agent = playerInMatch.character;
        const agentImage = getAgentImageUrl(agent);
        imageFiles.push(agentImage);
        const rankImage = getRankImageUrl(playerRank);
        let embed;
        if (playerRank == "Unrated") {
            embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${agent} ${kills}/${deaths}/${assists} (MMR: ${actualRank})`)
                .setAuthor({ name: `#${index + 1} ${match.metadata.map} ${isWin}` })
                .setThumbnail(`attachment://${agent}.png`)
                .setColor(winColor)
                .setFooter({ text: `${match.metadata.mode}, ${match.metadata.game_start_patched}`, iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4' });
        }
        else {
            const rankImageUrl = (0, exports.getRankImageFilename)(playerRank);
            imageFiles.push(rankImage);
            embed = new discord_js_1.EmbedBuilder()
                .setTitle(`${agent} ${kills}/${deaths}/${assists} (MMR: ${actualRank})`)
                .setAuthor({ name: `#${index + 1} ${match.metadata.map} ${isWin}`, iconURL: `attachment://${rankImageUrl}.png` })
                .setThumbnail(`attachment://${agent}.png`)
                .setColor(winColor)
                .setFooter({ text: `${match.metadata.mode}, ${match.metadata.game_start_patched}`, iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4' });
        }
        return embed;
    });
    return [recentMatches, imageFiles];
};
exports.getEmbedRecentMatchData = getEmbedRecentMatchData;
const getAgentImageUrl = (agentName) => {
    const imagePath = `./assets/icon/${agentName}.png`;
    const attachment = new discord_js_1.AttachmentBuilder(fs_1.default.readFileSync(imagePath), { name: `${agentName}.png` });
    return attachment;
};
const getRankImageFilename = (rank) => {
    const rankName = rank.replace(" ", "_");
    return `${rankName}_Rank`;
};
exports.getRankImageFilename = getRankImageFilename;
const getRankImageUrl = (rank) => {
    const imagePath = `./assets/rank/${(0, exports.getRankImageFilename)(rank)}.png`;
    const attachment = new discord_js_1.AttachmentBuilder(fs_1.default.readFileSync(imagePath), { name: `${(0, exports.getRankImageFilename)(rank)}.png` });
    return attachment;
};
