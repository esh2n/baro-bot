import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { ApplicationCommandOption } from 'discord.js'

import { Ask } from './ask'
import { AskTactics } from './ask-tactics'
import { Bo } from './bo'
import { Crosshair } from './crosshair'
import { Stats } from './stats'
import { FlowerMeaning } from './flower-meaning'
import Yomiage from './yomiage'

export type RawCommand = {
  name: string
  description: string
  options?: ApplicationCommandOption[]
}

const getCommands = async (): Promise<RawCommand[]> => {
  return [
    new Ask().command,
    new AskTactics().command,
    new Bo().command,
    new Crosshair().command,
    new FlowerMeaning().command,
    new Stats().command,
    Yomiage.command,
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

export { Ask } from './ask'
export { AskTactics } from './ask-tactics'
export { Bo } from './bo'
export { Crosshair } from './crosshair'
export { FlowerMeaning } from './flower-meaning'
export { Stats } from './stats'
