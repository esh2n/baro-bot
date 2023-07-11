"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIResponse = void 0;
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new openai_1.OpenAIApi(configuration);
const generateAIResponse = async (prompt, rulePrompt) => {
    const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: openai_1.ChatCompletionRequestMessageRoleEnum.System,
                content: rulePrompt,
            },
            { role: openai_1.ChatCompletionRequestMessageRoleEnum.User, content: prompt },
        ],
    });
    return (completion.data.choices[0].message?.content ?? '').trim();
};
exports.generateAIResponse = generateAIResponse;
