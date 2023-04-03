import { EmbedBuilder, AttachmentBuilder } from 'discord.js'
import fs from 'fs';

import { getRecentMatches } from './getRecentMatches';
import { Player, MatchResponse } from './types';

export const getEmbedRecentMatchData = async (name: string, tag: string): Promise<any> => {
    const [recentMatchesResponse, player] = await getRecentMatches(name, tag)
    const agentImageFiles: Array<AttachmentBuilder> = []

    const recentMatches: Array<EmbedBuilder> = recentMatchesResponse.slice(0, 20).map((match: MatchResponse, index: number) => {
        const playerInMatch = match.players.all_players.find(p => p.puuid === (player as Player).puuid);
        const playerRank = playerInMatch?.currenttier_patched;

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
        agentImageFiles.push(agentImage);

        const embed = new EmbedBuilder()
            .setTitle(`#${index + 1} ${match.metadata.map} ${isWin} (${playerRank})`)
            .setDescription(`${agent} ${kills}/${deaths}/${assists}`)
            .setImage(`attachment://${agent}.png`)
            .setColor(winColor)
            .setFooter({ text: `${match.metadata.mode}, ${match.metadata.game_start_patched}`, iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4' });

        return embed;
    });

    return [recentMatches, agentImageFiles]
}

const getAgentImageUrl = (agentName: string): AttachmentBuilder => {
    const imagePath = `./assets/icon/${agentName}.png`;

    const attachment = new AttachmentBuilder(fs.readFileSync(imagePath), {name: `${agentName}.png`});

    return attachment;
};
