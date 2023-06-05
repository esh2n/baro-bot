import {
  ApplicationCommandOptionChoiceData,
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
} from 'discord.js'
import { getEmbedRecentMatchData } from '../lib/valorant-api'
import { RawCommand } from '.'
import { getAllPlayers } from '../lib/grapevineer/client'

export class Stats {
  command: RawCommand

  constructor() {
    this.command = {
      name: 'stats',
      description: 'VALORANTの直近20戦の戦績を表示します。',
      options: [
        {
          name: 'playername',
          type: 3,
          description: 'プレイヤー名#タグ',
          required: true,
          choices: [],
        },
      ],
    }

    this.initialize()
  }

  private async initialize() {
    let choices: ApplicationCommandOptionChoiceData<string>[] = []
    const players = await getAllPlayers()
    players.map((player) => {
      const choice: ApplicationCommandOptionChoiceData<string> = {
        name: player.getName() + '#' + player.getPlayerId(),
        value: player.getName() + '#' + player.getPlayerId(),
      }
      choices.push(choice)
    })

    this.command.options = [
      {
        name: 'playername',
        type: 3,
        description: 'プレイヤー名#タグ',
        required: true,
        choices: choices,
      },
    ]
  }

  waitSeconds = (second: number): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000 * second)
    })
  }
  public handle = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      const playerNameWithTag = (
        i.options as CommandInteractionOptionResolver
      ).getString('playername') as string
      const [playerName, tag] = playerNameWithTag.split('#')

      await i.deferReply()
      const [recentMatches, agentImageFiles] = await getEmbedRecentMatchData(
        playerName!,
        tag!
      )

      // Add content property with the text for the recent matches
      await i.editReply({
        content: `\n${playerName}#${tag}さんの直近5試合`,
        embeds: recentMatches,
        files: agentImageFiles,
      })
    } catch (error) {
      console.error(error)
      await i.reply('エラーが発生しました。')
    }
  }
}
