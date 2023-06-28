import {
  CacheType,
  Client,
  GatewayIntentBits,
  Interaction,
  TextChannel,
} from 'discord.js'
import Yomiage from './commands/yomiage'
import Stats from './commands/stats'
import Ask from './commands/ask'
import AskTactics from './commands/ask-tactics'
import Bo from './commands/bo'
import Crosshair from './commands/crosshair'
import FlowerMeaning from './commands/flower-meaning'
import { exec } from 'child_process'
import http from 'http'
// import cron from 'node-cron'

require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

http
  .createServer(function (_, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end('Discord bot is active now \n')
  })
  .listen(process.env.PORT)

  client.on('ready', async () => {
    console.log('Bot is ready.');

    // const textChannel = client.channels.cache.find(channel => channel.id === '1006967319676846130');

    // if (textChannel) {
      // 平日10時に実行
        // cron.schedule('0 10 * * 1-5', async () => {
        //   Bo.bo(textChannel as TextChannel, "夜");
        // }, {
        //     scheduled: true,
        //     timezone: 'Asia/Tokyo',
        // })
        // // 土日10時に実行
        // cron.schedule('0 10 * * 0,6', async () => {
        //   Bo.bo(textChannel as TextChannel, "終日");
        // }, {
        //     scheduled: true,
        //     timezone: 'Asia/Tokyo',
        // });
    // }
});

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return

  const command = interaction.commandName
  switch (command) {
    case 'ask':
      await Ask.handle(interaction, client)
      break
    case 'ask-tactics':
      await AskTactics.handle(interaction, client)
      break
    case 'bo':
      await Bo.handle(interaction, client)
      break
    case 'crosshair':
      await Crosshair.handle(interaction, client)
      break
    case 'flower-meaning':
      await FlowerMeaning.handle(interaction, client)
      break
    case 'stats':
      await Stats.handle(interaction, client)
      break
    case 'yomiage':
      await Yomiage.handle(interaction, client)
      break
    default:
      break
  }
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return
  }
  switch (message.content) {
    case '!よるぼ':
      Bo.bo(message.channel as TextChannel, '夜')
      break
    case '!ひるぼ':
      Bo.bo(message.channel as TextChannel, '昼')
      break
    case '!あさぼ':
      Bo.bo(message.channel as TextChannel, '朝')
      break
    case '!おはよう':
      Bo.bo(message.channel as TextChannel, '朝')
      break
    case '!おやすみ':
      Bo.bo(message.channel as TextChannel, '夜')
      break
  }

  if (!Yomiage.connection) {
    return
  }
  const channelId = message.channel.id
  if (
    channelId !== '757145883648327758' &&
    channelId !== '1006967489881718836'
  ) {
    return
  }

  let text = message.content
  exec('rm audio.wav')

  const userID = message.author.id
  const speakerId = Yomiage.setSpeakerIdByUserIdIfNotExist(userID)
  await Yomiage.writeWavFile(text, speakerId)
  await Yomiage.playAudio()
})

client.on('voiceStateUpdate', (oldState, newState) => {
  // botの場合は無視
  if (newState.member?.user.bot) {
    return
  }
  if (newState && oldState) {
    const textChannel = newState.guild.channels.cache.find(
      (channel) => channel.id === '1006967319676846130'
    )
    if (oldState.channelId === newState.channelId) {
      // ミュートなどの動作
    }
    if (oldState.channelId === null && newState.channelId != null) {
      // connect
      const voiceChannel = newState.channel
      if (voiceChannel!.members.size === 1) {
        // VCに1人だけいる場合
        const vcName = voiceChannel!.name
        if (vcName === 'VALORANT' || vcName === '雑談') {
          ;(textChannel as TextChannel).send(
            `@VALORANT ${
              newState!.member!.nickname || newState!.member!.user.username
            }さんがVC「${vcName}」であなたを待っています。可哀想なので参加してあげましょう。`
          )
        }
      }
    }
    if (oldState.channelId != null && newState.channelId === null) {
      // disconnect
    }
  }
})

client.login(process.env.DISCORD_BOT_TOKEN || '')
import './commands'
