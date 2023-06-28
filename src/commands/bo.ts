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

  public bo = async (textChannel: TextChannel, time: Time, c: Client<boolean>) => {
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
        `${text}\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}\n\nあと5人！`
      )
      .then((message) => {
        message.react(randomEmojiSet[0])
        message.react(randomEmojiSet[1])
        message.react(randomEmojiSet[2])
        message.react(randomEmojiSet[3])

        let participants = new Set()

        const filter = (reaction, user) => {
          return (
            randomEmojiSet.includes(reaction.emoji.name) &&
            user.id !== c!.user!.id
          )
        }
        const collector = message.createReactionCollector({ filter })
        collector.on('collect', (_, user) => {
          participants.add(user.id) // 参加者を追加
          const remaining = 5 - participants.size // 残りの募集人数
          if (remaining >= 0) {
            message.edit(`${text}\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}\n\nあと${remaining}人`);
          }
        })
      })
  }
}

export default Bo.getInstance()
