import { CacheType, Client, GatewayIntentBits, Interaction } from 'discord.js'
import {
  Ask,
  AskTactics,
  Bo,
  Crosshair,
  FlowerMeaning,
  Stats,
} from './commands'
import http from 'http'

require('dotenv').config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

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
    default:
      break
  }
})

client.login(process.env.DISCORD_BOT_TOKEN || '')
import './commands'
