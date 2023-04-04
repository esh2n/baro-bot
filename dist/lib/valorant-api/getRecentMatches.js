"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRankImageFilename = exports.getActualRank = exports.getRecentMatches = void 0;
const unofficial_valorant_api_1 = __importDefault(require("unofficial-valorant-api"));
const valorantClient = new unofficial_valorant_api_1.default();
const getRecentMatches = async (name, tag) => {
    try {
        const playerResponse = await valorantClient.getAccount({ name, tag });
        const player = playerResponse.data;
        const matchHistory = await valorantClient.getMatchesByPUUID({ region: 'ap', puuid: player.puuid, filter: 'competitive' });
        const mmrResponse = await valorantClient.getMMRByPUUID({ version: 'v2', region: 'ap', puuid: player.puuid });
        const recentMatchesResponse = matchHistory.data;
        const mmr = mmrResponse.data?.current_data.mmr_change_to_last_game;
        return [recentMatchesResponse, player, mmr];
    }
    catch (error) {
        console.error(error);
    }
};
exports.getRecentMatches = getRecentMatches;
const getActualRank = (rank, mmr) => {
    const rankTiers = ["Unrated", "Iron 1", "Iron 2", "Iron 3", "Bronze 1", "Bronze 2", "Bronze 3", "Silver 1", "Silver 2", "Silver 3", "Gold 1", "Gold 2", "Gold 3", "Platinum 1", "Platinum 2", "Platinum 3", "Diamond 1", "Diamond 2", "Diamond 3", "Ascendant 1", "Ascendant 2", "Ascendant 3", "Immortal 1", "Immortal 2", "Immortal 3", "Radiant"];
    const index = rankTiers.indexOf(rank);
    if (index === -1) {
        throw new Error("Invalid rank provided.");
    }
    const adjustedMmr = Math.floor(mmr / 10);
    let adjustedIndex = index + adjustedMmr;
    if (adjustedIndex < 0) {
        adjustedIndex = 0;
    }
    else if (adjustedIndex > 25) {
        adjustedIndex = 25;
    }
    return rankTiers[adjustedIndex];
};
exports.getActualRank = getActualRank;
const getRankImageFilename = (rank) => {
    const rankName = rank.replace(" ", "_");
    return `${rankName}_Rank.png`;
};
exports.getRankImageFilename = getRankImageFilename;
