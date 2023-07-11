import {
  ApplicationCommandOptionChoiceData,
  AttachmentBuilder,
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  EmbedBuilder,
} from 'discord.js'
import { RawCommand } from '.'
import { getAllPlayers } from '../lib/grapevineer/client'
import fs from 'fs'
import { MatchResponse, Player, Rank } from '../lib/valorant-api/types'
import { getRecentMatches } from '../lib/valorant-api'

class Stats {
  private static instance: Stats | null = null
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

  public static getInstance(): Stats {
    if (!Stats.instance) {
      Stats.instance = new Stats()
    }
    return Stats.instance
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

  private async getEmbed(
    name: string,
    tag: string
  ): Promise<[EmbedBuilder[], AttachmentBuilder[]]> {
    try {
      const [recentMatchesResponse, player] = await getRecentMatches(name, tag)
      const imageFiles: Array<AttachmentBuilder> = []

      const recentMatches: Array<EmbedBuilder> = recentMatchesResponse
        .slice(0, 20)
        .map((match: MatchResponse, index: number) => {
          const playerInMatch = match.players.all_players.find(
            (p) => p.puuid === (player as Player).puuid
          )
          const playerRank = playerInMatch?.currenttier_patched as Rank

          if (!playerInMatch) {
            throw new Error(`Player not found in match #${index + 1}`)
          }

          const playerTeam = playerInMatch?.team
          const winningTeam = match.teams.red.has_won ? 'Red' : 'Blue'
          const isWin = playerTeam === winningTeam ? '👍' : '👎'
          const winColor = isWin === '👍' ? 0x0000ff : 0xff0000

          const {
            kills,
            deaths,
            assists,
            headshots,
            bodyshots,
            legshots,
            score,
          } = playerInMatch.stats

          const headshotPercentage = Math.round(
            (headshots / (headshots + bodyshots + legshots)) * 100
          )

          const agent = playerInMatch.character

          const agentImage = this.getAgentImageUrl(agent)
          imageFiles.push(agentImage)

          const rankImage = this.getRankImageUrl(playerRank)

          const rankImageUrl = this.getRankImageFilename(playerRank)
          imageFiles.push(rankImage)

          const embed = new EmbedBuilder()
            .setTitle(
              `${agent} ${kills}/${deaths}/${assists} | HS%: ${headshotPercentage}% | Store: ${score}`
            )
            .setAuthor({
              name: `#${index + 1} ${match.metadata.map} ${isWin}`,
              iconURL: `attachment://${rankImageUrl}.png`,
            })
            .setThumbnail(`attachment://${agent}.png`)
            .setColor(winColor)
            .setFooter({
              text: `${match.metadata.mode}, ${match.metadata.game_start_patched}`,
              iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4',
            })
          return embed
        })

      return [recentMatches, imageFiles]
    } catch (error) {
      const embed = new EmbedBuilder().setTitle(
        `エラーが発生しました。${error}`
      )
      return [[embed], []]
    }
  }

  private getAgentImageUrl = (agentName: string): AttachmentBuilder => {
    const imagePath = `./assets/icon/${agentName}.png`

    const attachment = new AttachmentBuilder(fs.readFileSync(imagePath), {
      name: `${agentName}.png`,
    })

    return attachment
  }

  private getRankImageFilename = (rank: Rank): string => {
    const rankName = rank.replace(' ', '_')
    return `${rankName}_Rank`
  }

  private getRankImageUrl = (rank: Rank): AttachmentBuilder => {
    const imagePath = `./assets/rank/${this.getRankImageFilename(rank)}.png`

    const attachment = new AttachmentBuilder(fs.readFileSync(imagePath), {
      name: `${this.getRankImageFilename(rank)}.png`,
    })

    return attachment
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
      const [recentMatches, agentImageFiles] = await this.getEmbed(
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

export default Stats.getInstance()
