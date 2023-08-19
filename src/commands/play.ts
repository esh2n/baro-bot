import {
  CacheType,
  Client,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Guild,
  GuildMember,
  VoiceBasedChannel,
} from 'discord.js'
import { RawCommand } from '.'
import { QueryType, useQueue, useMainPlayer } from 'discord-player'

import { VoiceConnection } from '@discordjs/voice'

class Play {
  private static instance: Play | null = null
  playCommand: RawCommand
  playStopCommand: RawCommand
  connection: VoiceConnection | null
  constructor() {
    this.playCommand = {
      name: 'play',
      description: 'YouTubeを再生します',
      options: [
        {
          name: 'url',
          type: 3,
          description: 'YouTube URL',
          required: true,
        },
      ],
    }
    this.playStopCommand = {
      name: 'play-stop',
      description: 'YouTubeを停止します',
    }

    this.connection = null
  }

  public static getInstance(): Play {
    if (!Play.instance) {
      Play.instance = new Play()
    }
    return Play.instance
  }
  public handlePlay = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      await this._play(i)
    } catch (error) {
      console.error(error)
      await i.reply({
        content: 'エラーが発生しました。',
        ephemeral: true,
      })
    }
  }

  public handlePlayStop = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      await this._stop(i)
    } catch (error) {
      console.error(error)
      await i.reply({
        content: 'エラーが発生しました。',
        ephemeral: true,
      })
    }
  }

  private async _joinVoiceChannel(i: CommandInteraction<CacheType>) {
    const guild = i.guild as Guild
    const member = (await guild.members.fetch(i.member!.user.id)) as GuildMember
    const memberVC = member.voice.channel as VoiceBasedChannel
    await this._validateToPlay(i, memberVC)
  }

  private async _stop(i: CommandInteraction<CacheType>) {
    if (!i.guild) return

    const queue = useQueue(i.guild.id)

    if (!queue) {
      return await i.reply({
        content: '音楽が再生されていません',
        ephemeral: true,
      })
    }

    queue.delete()

    await i.reply({
      content: '再生を終了しました',
    })
  }
  private async _play(i: CommandInteraction<CacheType>) {
    await this._joinVoiceChannel(i)
    if (!i.guild) return

    const query = (i.options as CommandInteractionOptionResolver).getString(
      'url'
    ) as string
    if (query.length < 2) {
      return
    }
    const player = useMainPlayer()

    const guild = i.guild as Guild
    const member = (await guild.members.fetch(i.member!.user.id)) as GuildMember
    const memberVC = member.voice.channel as VoiceBasedChannel
    const queue = player!.queues.create(i.guild!.id, {
      metadata: {
        channel: memberVC,
      },
      volume: 0.6,
    })

    try {
      if (!queue!.connection) {
        await queue!.connect(memberVC)
      }
    } catch {
      queue!.delete()
      return await i.reply({
        content: 'ボイスチャンネルに参加できませんでした',
        ephemeral: true,
      })
    }

    await i.deferReply()

    const track = await player!
      .search(query, {
        requestedBy: i.user,
        searchEngine: QueryType.YOUTUBE_SEARCH,
      })
      .then((x) => x.tracks[0])

    if (!track) {
      return await i.followUp({
        content: '動画が見つかりませんでした',
      })
    }

    queue!.addTrack(track)

    await player!.play(memberVC, track, {
      nodeOptions: {
        metadata: {
          channel: i.channel,
          client: i.guild.members.me,
          requestedBy: i.user,
        },
        volume: 0.6,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 60000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 300000,
      },
    })

    return await i.followUp({
      content: `音楽をキューに追加しました **${track.title}**`,
    })
  }

  private _validateToPlay = (
    i: CommandInteraction<CacheType>,
    vc: VoiceBasedChannel
  ) => {
    if (!vc) {
      return i.reply({
        content: '接続先のVCが見つかりません。',
        ephemeral: true,
      })
    }
    if (!vc.joinable) {
      return i.reply({
        content: 'VCに接続できません。',
        ephemeral: true,
      })
    }
  }
}

export default Play.getInstance()
