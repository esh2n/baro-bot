"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBaroAskTactics = void 0;
const openai_api_1 = require("../lib/openai-api");
const handleBaroAskTactics = async (i, _) => {
    try {
        const agent = i.options.getString('agent');
        const map = i.options.getString('map');
        const alliedEcoRound = i.options.getString('allied-eco-round');
        const enemyEcoRound = i.options.getString('enemy-eco-round');
        const team = i.options.getString('team');
        const prompt = (0, openai_api_1.getUserPrompt)(agent, map, alliedEcoRound, enemyEcoRound, team);
        await i.deferReply();
        const rulePrompt = `
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
    `;
        const answer = await (0, openai_api_1.generateAIResponse)(prompt, rulePrompt);
        await i.editReply({ content: `\n${answer}` });
    }
    catch (error) {
        console.error(error);
        await i.reply('エラーが発生しました。');
    }
};
exports.handleBaroAskTactics = handleBaroAskTactics;
