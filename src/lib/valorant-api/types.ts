export type MatchResponse = {
    metadata: MatchMetadata;
    players: {
        all_players: PlayerInMatch[];
    };
    teams: {
        red: Team;
        blue: Team;
    };
};

type PlayerInMatch = {
    puuid: string;
    team: string;
    stats: PlayerStats;
    character: string
    currenttier_patched: string;
};

type PlayerStats = {
    kills: number;
    deaths: number;
    assists: number;
};

type Team = {
    has_won: boolean;
    rounds_won: number;
    rounds_lost: number;

};

type MatchMetadata = {
    map: string;
    mode: string;
    game_start_patched: string;
};

export type Player = {
    puuid: string;
};

export type Rank = "Iron 1" | "Iron 2" | "Iron 3" | "Bronze 1" | "Bronze 2" | "Bronze 3" | "Silver 1" | "Silver 2" | "Silver 3" | "Gold 1" | "Gold 2" | "Gold 3" | "Platinum 1" | "Platinum 2" | "Platinum 3" | "Diamond 1" | "Diamond 2" | "Diamond 3" | "Ascendant 1" | "Ascendant 2" | "Ascendant 3" | "Immortal 1" | "Immortal 2" | "Immortal 3" | "Radiant";

interface MMRData {
    name: string;
    tag: string;
    current_data: {
      currenttier: number;
      currenttierpatched: string;
      images: {
        [key: string]: string;
      };
      ranking_in_tier: number;
      mmr_change_to_last_game: number;
      elo: number;
      games_needed_for_rating: number;
      old: boolean;
    };
    highest_rank: {
      old: boolean;
      tier: number;
      patched_tier: string;
      season: string;
      converted: number;
    };
    by_season: {
      [key: string]: {
        tier: number;
        patched_tier: string;
        ranked_rating: number;
        wins: number;
        games: number;
        gamesneeded: number;
      };
    };
  }

 export interface MMRResponse {
    status: number;
    data: MMRData;
    ratelimits: {
      used: number;
      remaining: number;
      reset: number;
    };
    error: any;
    url: string;
  }