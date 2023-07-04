import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { ApplicationCommandOption } from 'discord.js'

import Ask from './ask'
import AskTactics from './ask-tactics'
import Bo from './bo'
import Crosshair from './crosshair'
import FlowerMeaning from './flower-meaning'
import Stats from './stats'
import Yomiage from './yomiage'
import Store from './store'

export type RawCommand = {
  name: string
  description: string
  options?: ApplicationCommandOption[]
}

const getCommands = async (): Promise<RawCommand[]> => {
  return [
    Ask.command,
    AskTactics.command,
    Bo.command,
    Crosshair.command,
    FlowerMeaning.command,
    Stats.command,
    Yomiage.command,
    Store.registerCommand,
    Store.storeCommand,
  ]
}

const waitSeconds = (second: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000 * second)
  })
}

;(async () => {
  const rest: REST = new REST({ version: '10' }).setToken(
    process.env.DISCORD_BOT_TOKEN || ''
  )
  try {
    const commands = await getCommands()
    await waitSeconds(5)
    console.log('Started refreshing application (/) commands.')
    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID || '',
          process.env.GUILD_ID as string
        ),
        {
          body: commands,
        }
      )
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID || ''), {
        body: commands,
      })
    }
  } catch (error) {
    console.error('Error while reloading application (/) commands: ', error)
  }
})()
