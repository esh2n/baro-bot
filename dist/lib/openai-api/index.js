"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPrompt = exports.generateAIResponse = void 0;
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new openai_1.OpenAIApi(configuration);
const generateAIResponse = async (prompt, rulePrompt) => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            { role: openai_1.ChatCompletionRequestMessageRoleEnum.System, content: rulePrompt },
            { role: openai_1.ChatCompletionRequestMessageRoleEnum.User, content: prompt },
        ],
        top_p: 2,
        temperature: 2,
    });
    return (completion.data.choices[0].message?.content ?? '').trim();
};
exports.generateAIResponse = generateAIResponse;
const getUserPrompt = (agent, map, alliedEcoRound, enemyEcoRound, team) => {
    return `The agent used is ${agent}, the map is ${map}, the allies are ${alliedEcoRound} and the enemies are ${enemyEcoRound}. Now we are on the ${team}, what is your strategy?`;
};
exports.getUserPrompt = getUserPrompt;
