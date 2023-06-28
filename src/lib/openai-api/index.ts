import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { Round, Team } from './types';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new OpenAIApi(configuration);

export const generateAIResponse = async (prompt: string, rulePrompt: string): Promise<string> => {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: ChatCompletionRequestMessageRoleEnum.System, content: rulePrompt},
            {role: ChatCompletionRequestMessageRoleEnum.User, content: prompt},
        ],
    });

    return (completion.data.choices[0].message?.content ?? '').trim();
}

export const getUserPrompt = (agent: string, map: string, alliedEcoRound: Round, enemyEcoRound: Round, team: Team):string =>  {
    return  `The agent used is ${agent}, the map is ${map}, the allies are ${alliedEcoRound} and the enemies are ${enemyEcoRound}. Now we are on the ${team}, what is your strategy?`;
}

