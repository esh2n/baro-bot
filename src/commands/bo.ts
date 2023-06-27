import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js'
import { sendGAS } from '../lib/gas'
import { RawCommand } from '.'

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
}

export default Bo.getInstance()