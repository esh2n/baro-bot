import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js'
import { getCrosshairImageURL } from '../lib/valorant-api/getRecentMatches'
import { RawCommand } from '.'

export class Crosshair {
  command: RawCommand

  constructor() {
    this.command = {
      name: 'crosshair',
      description: 'クロスヘアが表示されます。',
      options: [
        {
          name: 'code',
          type: 3,
          description: 'クロスヘアコード',
          required: true,
        },
      ],
    }
  }

  public handle = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      const code = (i.options as CommandInteractionOptionResolver).getString(
        'code'
      ) as string

      await i.deferReply()
      const url = await getCrosshairImageURL(code)

      await i.editReply({ content: `\ncode: ${code} \n${url}` })
    } catch (error) {
      console.error(error)
      await i.reply('エラーが発生しました。')
    }
  }
}
