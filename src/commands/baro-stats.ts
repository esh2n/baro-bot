import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { getEmbedRecentMatchData } from "../lib/valorant-api";

export const handleBaroStats = async (i: CommandInteraction<CacheType>, _: Client<boolean>) => {
try {
    const playerName = (i.options as CommandInteractionOptionResolver).getString('playername') as string;
    let tag = (i.options as CommandInteractionOptionResolver).getString('tag') as string;
    if (tag.startsWith('#')) {
        tag = tag.substring(1)
    }

    await i.deferReply();
    const [recentMatches, agentImageFiles] = await getEmbedRecentMatchData(playerName!, tag!);

    // Add content property with the text for the recent matches
    await i.editReply({ content: `\n${playerName}#${tag}さんの直近5試合`, embeds: recentMatches, files: agentImageFiles});

    } catch (error) {
    console.error(error);
    await i.reply('エラーが発生しました。');
    }
}