import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { sendGAS } from "../lib/gas";

export const handleBaroBo = async (i: CommandInteraction<CacheType>, c: Client<boolean>) => {
try {
    const message = (i.options as CommandInteractionOptionResolver).getString('message') as string;
    await i.deferReply();

    await sendGAS(message, c, i.user);
    await i.editReply({ content: `\nLineにメッセージを送りました。`});

    } catch (error) {
    console.error(error);
    await i.reply('エラーが発生しました。');
    }
}