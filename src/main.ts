import { CacheType, Client, GatewayIntentBits, Interaction } from 'discord.js'
import Yomiage from './commands/yomiage'
import Stats from './commands/stats'
import Ask from './commands/ask'
import AskTactics from './commands/ask-tactics'
import Bo from './commands/bo'
import Crosshair from './commands/crosshair'
import FlowerMeaning from './commands/flower-meaning'
import { exec } from 'child_process'
import http from 'http'

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
  console.log('Bot is ready.')
})

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

client.login(process.env.DISCORD_BOT_TOKEN || '')
import './commands'
