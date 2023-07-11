import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || '',
})
const openai = new OpenAIApi(configuration)

export const generateAIResponse = async (
  prompt: string,
  rulePrompt: string
): Promise<string> => {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: rulePrompt,
      },
      { role: ChatCompletionRequestMessageRoleEnum.User, content: prompt },
    ],
  })

  return (completion.data.choices[0].message?.content ?? '').trim()
}
