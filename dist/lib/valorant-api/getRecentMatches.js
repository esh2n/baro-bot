"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentMatches = void 0;
const unofficial_valorant_api_1 = __importDefault(require("unofficial-valorant-api"));
const valorantClient = new unofficial_valorant_api_1.default();
const getRecentMatches = async (name, tag) => {
    const playerResponse = await valorantClient.getAccount({ name, tag });
    const player = playerResponse.data;
    const matchHistory = await valorantClient.getMatchesByPUUID({ region: 'ap', puuid: player.puuid });
    const recentMatchesResponse = matchHistory.data;
    return [recentMatchesResponse, player];
};
exports.getRecentMatches = getRecentMatches;
