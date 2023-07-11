import {
  ActionRowBuilder,
  CacheType,
  Client,
  ColorResolvable,
  CommandInteraction,
  EmbedBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import { RawCommand } from '.'
import {
  getTodaysStoresByDiscordId,
  setStoreViewer,
} from '../lib/grapevineer/client'
import { Skin } from 'grapevineer/gen/ts/v1/store_pb'

class Store {
  private static instance: Store | null = null
  storeCommand: RawCommand
  registerCommand: RawCommand

  constructor() {
    this.storeCommand = {
      name: 'store',
      description: 'VALORANTのStore情報を提供します。',
    }

    this.registerCommand = {
      name: 'register',
      description: 'VALORANTのStore情報取得のためのTokenを生成します。',
    }
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store()
    }
    return Store.instance
  }

  public handleStore = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      const did = i.user.id
      await i.deferReply()
      await getTodaysStoresByDiscordId(did).then(async (s) => {
        if (s == null) return
        if (s.multiaccountSkinsList.length === 0) {
          await i.editReply({
            content: `\nログインしてください。(/register))`,
          })
          return
        }
        for await (const skin of s.multiaccountSkinsList) {
          const embeds = await this.getEmbed(skin.skinsList)
          if (i.replied || i.deferred) {
            await i.followUp({
              content: `\n${skin.playerName}さんのStore情報です。`,
              embeds: embeds,
            })
          } else {
            await i.editReply({
              content: `\n${skin.playerName}さんのStore情報です。`,
              embeds: embeds,
            })
          }
        }
      })
    } catch (error) {
      console.error(error)
      await i.reply('エラーが発生しました。')
    }
  }

  private getEmbed = async (skins: Skin.AsObject[]) => {
    const arrayEmbed = skins.map((skin, index) => {
      const iconUrl = skin.displayIcon === '' ? null : skin.displayIcon
      const embed = new EmbedBuilder()
        .setTitle(skin.displayName)
        .setAuthor({
          name: `#${index + 1}`,
        })
        .setThumbnail(iconUrl)
        .setColor(skin.tier?.colorCode as ColorResolvable)
        .setFooter({
          text: skin.uuid,
          iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4',
        })
      return embed
    })

    return arrayEmbed
  }

  public handleRegister = async (
    i: CommandInteraction<CacheType>,
    _: Client<boolean>
  ) => {
    try {
      const did = i.user.id
      const [id, pass] = await this.showModal(i)
      console.log(id, pass, 'id, pass')
      await setStoreViewer(did, id, pass)
    } catch (error) {
      console.error(error)
      await i.reply('エラーが発生しました。')
    }
  }

  private showModal = async (
    i: CommandInteraction<CacheType>
  ): Promise<string[]> => {
    const modal = new ModalBuilder()
      .setCustomId('register')
      .setTitle('Login VALORANT')

    const idInput = new TextInputBuilder()
      .setCustomId('IDInput')
      .setLabel('ID')
      .setStyle(TextInputStyle.Short)

    const passInput = new TextInputBuilder()
      .setCustomId('passInput')
      .setLabel('Password')
      .setStyle(TextInputStyle.Short)

    const idb =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        idInput
      )
    const passb =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        passInput
      )

    modal.addComponents(idb, passb)

    await i.showModal(modal)

    const filter = (mInteraction) => mInteraction.customId === 'register'
    const res = await i
      .awaitModalSubmit({ filter, time: 60000 })
      .then(async (mInteraction) => {
        const id = mInteraction.fields.getTextInputValue('IDInput')
        const pass = mInteraction.fields.getTextInputValue('passInput')

        await mInteraction.reply({
          ephemeral: true,
          content: `\n登録完了しました。`,
        })
        return [id, pass]
      })
      .catch(console.error)
    return res as string[]
  }
}

export default Store.getInstance()
