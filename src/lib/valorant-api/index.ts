import ValorantClient from 'unofficial-valorant-api';
import { CrosshairResponse, MatchResponse, MMRResponse, Player, Rank } from './types';

const valorantClient = new ValorantClient();

export const getRecentMatches = async (name: string, tag: string): Promise<any> => {
    try {
        const playerResponse = await valorantClient.getAccount({name, tag});
        const player = playerResponse.data as Player;
        const matchHistory = await valorantClient.getMatchesByPUUID({region: 'ap', puuid: player.puuid, filter: 'competitive'});
        const mmrResponse = await valorantClient.getMMRByPUUID({version: 'v2', region: 'ap', puuid: player.puuid});
        const recentMatchesResponse = matchHistory.data as [MatchResponse]
        const mmr = (mmrResponse as MMRResponse).data?.current_data.mmr_change_to_last_game;
        return [recentMatchesResponse, player, mmr];
    }catch (error) {
        console.error(error);
        return [[], null, null];
    }
};

export const getActualRank = (rank: Rank, mmr: number): Rank => {
  const rankTiers: Rank[] = ["Unrated", "Iron 1", "Iron 2", "Iron 3", "Bronze 1", "Bronze 2", "Bronze 3", "Silver 1", "Silver 2", "Silver 3", "Gold 1", "Gold 2", "Gold 3", "Platinum 1", "Platinum 2", "Platinum 3", "Diamond 1", "Diamond 2", "Diamond 3", "Ascendant 1", "Ascendant 2", "Ascendant 3", "Immortal 1", "Immortal 2", "Immortal 3", "Radiant"];
  const index = rankTiers.indexOf(rank);
  if (index === -1) {
    throw new Error("Invalid rank provided.");
  }
  const adjustedMmr = Math.floor(mmr / 10);
  let adjustedIndex = index + adjustedMmr;
  if (adjustedIndex < 0) {
    adjustedIndex = 0
  } else if (adjustedIndex > 25) {
    adjustedIndex = 25
  }
  return rankTiers[adjustedIndex];
}

export const getRankImageFilename = (rank: Rank): string => {
  const rankName = rank.replace(" ", "_");
  return `${rankName}_Rank.png`;
}

export const getCrosshairImageURL = async (code: string, size = 256): Promise<any> => {
    try {
        const res = await valorantClient.getCrosshair({code, size}) as CrosshairResponse
        return res.url || ''
    } catch (error) {
        console.error(error);
        return "";
    }
}
