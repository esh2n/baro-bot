import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  TextChannel,
} from 'discord.js'
import { sendGAS } from '../lib/gas'
import { RawCommand } from '.'
import Ask from './ask'
import { Time } from '../lib/openai-api/types'

class Bo {
  private static instance: Bo | null = null
  command: RawCommand

  constructor() {
    this.command = {
      name: 'bo',
      description: 'バロボをします。',
      options: [
        {
          name: 'message',
          type: 3,
          description: 'メッセージ',
          required: true,
        },
      ],
    }
  }

  public static getInstance(): Bo {
    if (!Bo.instance) {
      Bo.instance = new Bo()
    }
    return Bo.instance
  }

  public handle = async (
    i: CommandInteraction<CacheType>,
    c: Client<boolean>
  ) => {
    try {
      const message = (i.options as CommandInteractionOptionResolver).getString(
        'message'
      ) as string
      await i.deferReply()

      await sendGAS(message, c, i.user)
      await i.editReply({ content: `\nLineにメッセージを送りました。` })
    } catch (error) {
      console.error(error)
      await i.reply('エラーが発生しました。')
    }
  }

  public bo = async (textChannel: TextChannel, time: Time) => {
    const emojiSets = [
      ["🐢", "🐍", "🦎", "🐊"],
      ["🐬", "🐳", "🐠", "🐙"],
      ["🙈", "🙉", "🙊", "🐒"],
      ["🦁", "🐯", "🐅", "🐆"],
      ["🦉", "🦅", "🦆", "🐧"],
      ["🌳", "🍁", "🍄", "🌰"],
      ["⭐", "🌙", "☀️", "☁️"],
      ["🍎", "🍌", "🍇", "🍓"],
      ["🥦", "🥕", "🌽", "🍅"],
      ["💖", "💙", "💚", "💛"],
      ["🎸", "🎷", "🥁", "🎻"],
      ["⚽", "🏀", "🏈", "⚾"],
      ["🍵", "🍶", "🍷", "🍺"],
      ["🚗", "✈️", "🚀", "🚢"],
      ["🏞", "🌆", "🏝", "🌉"],
      ["🎂", "🍦", "🍪", "🍩"],
      ["🎈", "🎁", "🎉", "🎊"],
      ["📚", "✏️", "🎓", "🔬"],
      ["💡", "💻", "📱", "⌚"],
      ["🎭", "🎨", "🎬", "🎤"],
    ]

    // ランダムに絵文字セットを選択
    const randomEmojiSet =
      emojiSets[Math.floor(Math.random() * emojiSets.length)]
    const text = await Ask.generateText(
      `${time}にVALORANTを募集する文を作ってください。`
    )
    ;(textChannel as TextChannel)
      .send(
        `${text}\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}`
      )
      .then((message) => {
        message.react(randomEmojiSet[0])
        message.react(randomEmojiSet[1])
        message.react(randomEmojiSet[2])
        message.react(randomEmojiSet[3])
      })
  }
}

export default Bo.getInstance()
