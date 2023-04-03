export　type MatchResponse = {
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


