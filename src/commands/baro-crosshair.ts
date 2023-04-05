import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { getCrosshairImageURL } from "../lib/valorant-api/getRecentMatches";

export const handleBaroCrosshair = async (i: CommandInteraction<CacheType>, _: Client<boolean>) => {
try {
    const code = (i.options as CommandInteractionOptionResolver).getString('code') as string;

    await i.deferReply();
    const url = await getCrosshairImageURL(code)

    await i.editReply({ content: `\ncode: ${code} \n${url}`});

    } catch (error) {
    console.error(error);
    await i.reply('エラーが発生しました。');
    }
}