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
import cron from 'node-cron'

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

  client.on('ready', () => {
    console.log('Bot is ready.');

    const textChannel = client.channels.cache.find(channel => channel.id === '1006967319676846130');

    if (textChannel) {
        // 毎日10時に実行
        cron.schedule('0 10 * * *', () => {
            const emojiSets = [
                ['🐢', '🐍', '🦎', '🐊'],
                ['🐬', '🐳', '🐠', '🐙'],
                ['🙈', '🙉', '🙊', '🐒'],
                ['🦁', '🐯', '🐅', '🐆'],
                ['🦉', '🦅', '🦆', '🐧'],
                ['🌳', '🍁', '🍄', '🌰'],
                ['⭐️', '🌙', '☀️', '☁️'],
                ['🍎', '🍌', '🍇', '🍓'],
                ['🥦', '🥕', '🌽', '🍅'],
                ['💖', '💙', '💚', '💛'],
                ['🎸', '🎷', '🥁', '🎻'],
                ['⚽️', '🏀', '🏈', '⚾️'],
                ['🍵', '🍶', '🍷', '🍺'],
                ['🚗', '✈️', '🚀', '⛵️'],
                ['🏞', '🌆', '🏝', '🌉'],
                ['🎂', '🍦', '🍪', '🍩'],
                ['🎈', '🎁', '🎉', '🎊'],
                ['📚', '✏️', '🎓', '🔬'],
                ['💡', '💻', '📱', '⌚️'],
                ['🎭', '🎨', '🎬', '🎤']
            ];

            // ランダムに絵文字セットを選択
            const randomEmojiSet = emojiSets[Math.floor(Math.random() * emojiSets.length)];

            (textChannel as TextChannel).send(`よるぼ！\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}`)
            .then(message => {
                message.react(randomEmojiSet[0]);
                message.react(randomEmojiSet[1]);
                message.react(randomEmojiSet[2]);
                message.react(randomEmojiSet[3]);
            });
        }, {
            scheduled: true,
            timezone: 'Asia/Tokyo',
        });
    }
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
// const userSpeakerMap = new Map<string, number>()

client.on('messageCreate', async (message) => {
  if (message.author.bot) {
    return
  }
  if (!Yomiage.connection) {
    console.log('Not connected to voice channel.')
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
