import { EmbedBuilder, AttachmentBuilder } from 'discord.js'
import fs from 'fs';

import { getRecentMatches, getActualRank } from './getRecentMatches';
import { Player, MatchResponse, Rank } from './types';

export const getEmbedRecentMatchData = async (name: string, tag: string): Promise<any> => {
    const [recentMatchesResponse, player, mmr] = await getRecentMatches(name, tag)
    const imageFiles: Array<AttachmentBuilder> = []

    const recentMatches: Array<EmbedBuilder> = recentMatchesResponse.slice(0, 20).map((match: MatchResponse, index: number) => {
        const playerInMatch = match.players.all_players.find(p => p.puuid === (player as Player).puuid);
        const playerRank = playerInMatch?.currenttier_patched as Rank;

        const actualRank = getActualRank(playerRank, mmr)

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
        const rankImageUrl = getRankImageFilename(playerRank)
        imageFiles.push(rankImage);

        const embed = new EmbedBuilder()
        .setTitle(`${agent} ${kills}/${deaths}/${assists} (MMR: ${actualRank})`)
        .setAuthor({name: `#${index+1} ${match.metadata.map} ${isWin}`, iconURL: `attachment://${rankImageUrl}.png`})
        .setThumbnail(`attachment://${agent}.png`)
        .setColor(winColor)
        .setFooter({ text: `${match.metadata.mode}, ${match.metadata.game_start_patched}`, iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4' });

        return embed;
    });

    return [recentMatches, imageFiles]
}

const getAgentImageUrl = (agentName: string): AttachmentBuilder => {
    const imagePath = `./assets/icon/${agentName}.png`;

    const attachment = new AttachmentBuilder(fs.readFileSync(imagePath), {name: `${agentName}.png`});

    return attachment;
};

export const getRankImageFilename = (rank: Rank): string => {
    const rankName = rank.replace(" ", "_");
    return `${rankName}_Rank`;
  }


  const getRankImageUrl = (rank: Rank): AttachmentBuilder => {
    const imagePath = `./assets/rank/${getRankImageFilename(rank)}.png`;

    const attachment = new AttachmentBuilder(fs.readFileSync(imagePath), {name: `${getRankImageFilename(rank)}.png`});

    return attachment;
};