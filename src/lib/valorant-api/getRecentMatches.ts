import ValorantClient from 'unofficial-valorant-api';
import { Player, MatchResponse } from './types';

const valorantClient = new ValorantClient();

export const getRecentMatches = async (name: string, tag: string): Promise<any> => {
    const playerResponse = await valorantClient.getAccount({name, tag});
    const player = playerResponse.data as Player;
    const matchHistory = await valorantClient.getMatchesByPUUID({region: 'ap', puuid: player.puuid});
    const recentMatchesResponse = matchHistory.data as [MatchResponse]

    return [recentMatchesResponse, player];
};

