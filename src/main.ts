import { CacheType, Client, GatewayIntentBits, Interaction } from 'discord.js'
import {
  Ask,
  AskTactics,
  Bo,
  Crosshair,
  FlowerMeaning,
  Stats,
} from './commands'
import Yomiage from './commands/yomiage'
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
      await new Ask().handle(interaction, client)
      break
    case 'ask-tactics':
      await new AskTactics().handle(interaction, client)
      break
    case 'bo':
      await new Bo().handle(interaction, client)
      break
    case 'crosshair':
      await new Crosshair().handle(interaction, client)
      break
    case 'flower-meaning':
      await new FlowerMeaning().handle(interaction, client)
      break
    case 'stats':
      await new Stats().handle(interaction, client)
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

  await Yomiage.writeWavFile(text)
  await Yomiage.playAudio()
})

client.login(process.env.DISCORD_BOT_TOKEN || '')
import './commands'
