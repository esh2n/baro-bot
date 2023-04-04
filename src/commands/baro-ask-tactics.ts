import { CacheType, Client, CommandInteraction, CommandInteractionOptionResolver } from "discord.js";
import { generateAIResponse, getUserPrompt } from "../lib/openai-api";
import { Round, Team } from "../lib/openai-api/types";

export const handleBaroAskTactics = async (i: CommandInteraction<CacheType>, _: Client<boolean>) => {
try {
    const agent = (i.options as CommandInteractionOptionResolver).getString('agent') as string;
    const map = (i.options as CommandInteractionOptionResolver).getString('map') as string;
    const alliedEcoRound = (i.options as CommandInteractionOptionResolver).getString('allied-eco-round') as Round;
    const enemyEcoRound = (i.options as CommandInteractionOptionResolver).getString('enemy-eco-round') as Round
    const team = (i.options as CommandInteractionOptionResolver).getString('team') as Team;
    const prompt = getUserPrompt(agent, map, alliedEcoRound, enemyEcoRound, team);

    await i.deferReply();

    const rulePrompt: string = `
    You are an excellent tactician in the game Valorant, produced by Riot Games.

    The output should be a markdown code snippet formatted in the following schema in Japanese:

    \`\`\`json
    [
        {
            title: string, // operation name.
            detail: string // operation detail.
        },
        {
            title: string, // operation name.
            detail: string // operation detail.
        },
    ]
    \`\`\`

    NOTES:
    * Do not include non-existent map names or character names.
    * Please provide at least three effective strategies.
    * Please do not include anything other than JSON in your answer.
    * Response must be Japanese
    * If the question includes "whether it is an eco-round" or "where is the map" or "what agent is used" or "whether it is offensive or defensive", please take this into account.
    `

    const answer = await generateAIResponse(prompt, rulePrompt)

    await i.editReply({ content: `\n${answer}`});

    } catch (error) {
    console.error(error);
    await i.reply('エラーが発生しました。');
    }
}