import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js'
import { RawCommand } from '.'
import { getFlowerMeaningByDate } from '../lib/grapevineer/client'

class Flower {
  private static instance: Flower | null = null
  command: RawCommand

  constructor() {
    this.command = {
      name: 'flower',
      description: '誕生花を表示します。',
      options: [
        {
          name: 'date',
          type: 3,
          description: '日付(ex. 1月11日 → 0111)',
          required: false,
        },
      ],
    }
  }

  public static getInstance(): Flower {
    if (!Flower.instance) {
      Flower.instance = new Flower()
    }
    return Flower.instance
  }
  public handle = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      const date = (i.options as CommandInteractionOptionResolver).getString(
        'date'
      ) as string

      const flowerMeaning = await getFlowerMeaningByDate(date)

      await i.deferReply()

      await i.editReply({
        content: `\n${flowerMeaning?.sumamry}`,
      })
    } catch (error) {
      console.error(error)
      await i.reply('エラーが発生しました。')
    }
  }
}

export default Flower.getInstance()
