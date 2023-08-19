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
import { getWavFromText } from '../lib/grapevineer/client'
import fs from 'fs'

import {
  AudioPlayer,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice'

class Yomiage {
  private static instance: Yomiage | null = null
  command: RawCommand
  player: AudioPlayer
  filePath: string
  connection: VoiceConnection | null
  speakerIds: number[] = []
  userSpeakerMap: Map<string, number> = new Map<string, number>()
  constructor() {
    this.command = {
      name: 'yomiage',
      description: '読み上げます',
      options: [
        {
          name: 'command',
          type: 3,
          description: 'コマンド',
          required: true,
          choices: [
            {
              name: 'スタート',
              value: 'start',
            },
            {
              name: 'ストップ',
              value: 'stop',
            },
            {
              name: 'シャッフル',
              value: 'shuffle',
            },
          ],
        },
      ],
    }
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    })
    this.filePath = 'audio.wav'
    this.connection = null
    this.speakerIds = [
      0, 1, 8, 9, 10, 40, 34, 13, 14, 17, 20, 21, 25, 27, 30, 42, 45, 46, 48,
    ]
  }

  public async writeWavFile(text: string, speakerId: number) {
    const byteData = (await getWavFromText(text, speakerId)) as Uint8Array
    fs.writeFileSync(this.filePath, byteData, 'binary')
  }

  private _getRandomAvailableId() {
    const usedSpeakerIds = Array.from(this.userSpeakerMap.values())
    const availableSpeakerIds = this.speakerIds.filter(
      (id) => !usedSpeakerIds.includes(id)
    )
    const randomIndex = Math.floor(Math.random() * availableSpeakerIds.length)
    return availableSpeakerIds[randomIndex]
  }

  private _clearUserSpeakerMap() {
    this.userSpeakerMap.clear()
  }
  public setSpeakerIdByUserIdIfNotExist(userId: string) {
    const speakerId = this.userSpeakerMap.get(userId)
    if (!speakerId) {
      const randomId = this._getRandomAvailableId()
      this.userSpeakerMap.set(userId, randomId)
      return randomId
    }
    return speakerId
  }

  public static getInstance(): Yomiage {
    if (!Yomiage.instance) {
      Yomiage.instance = new Yomiage()
    }
    return Yomiage.instance
  }
  public handle = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      type Command = 'start' | 'stop' | 'shuffle'
      const command = (i.options as CommandInteractionOptionResolver).getString(
        'command'
      ) as Command

      switch (command) {
        case 'start':
          await i.deferReply()
          if (this.connection) {
            await i.editReply({
              content: '\nすでに読み上げ中です。',
            })
            return
          }
          this.connection = await this._joinVoiceChannel(i)
          await i.editReply({
            content: '\n読み上げを開始します。',
          })
          break
        case 'stop':
          await i.deferReply()
          if (!this.connection) {
            await i.editReply({
              content: '\n読み上げていません。',
            })
            return
          }
          this._destory()
          this._clearUserSpeakerMap()
          await i.editReply({
            content: '\n読み上げを終了します。',
          })
          break
        case 'shuffle':
          await i.deferReply()
          this._clearUserSpeakerMap()
          await i.editReply({
            content: '\n読み上げボイスを初期化しました。',
          })
          break
      }
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

    const c = joinVoiceChannel({
      guildId: guild.id,
      channelId: memberVC.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: false,
    })
    c.on('stateChange', (old_state, new_state) => {
      if (
        old_state.status === VoiceConnectionStatus.Ready &&
        new_state.status === VoiceConnectionStatus.Connecting
      ) {
        c.configureNetworking()
      }
      if (new_state.status == VoiceConnectionStatus.Disconnected) {
        c.destroy()
        this._clearUserSpeakerMap()
        this.connection = null
      }
    })
    return c
  }

  private _destory() {
    if (!this.connection) return
    this.connection.destroy()
    this.connection = null
  }
  public playAudio() {
    if (!this.connection) return

    const resource = createAudioResource(this.filePath, {
      inputType: StreamType.Arbitrary,
    })

    this.player.play(resource)

    this.connection.subscribe(this.player)
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

export default Yomiage.getInstance()
