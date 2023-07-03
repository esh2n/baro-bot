// import {
//     ActionRowBuilder,
//     CacheType,
//     Client,
//     CommandInteraction,
//     CommandInteractionOptionResolver,
//     ModalBuilder,
//   } from 'discord.js'
//   import { RawCommand } from '.'

//   class Store {
//     private static instance: Store | null = null
//     commands: RawCommand[]

//     model: ModalBuilder | null = null
//     constructor() {
//       this.commands = [
//         {
//           name: 'store',
//           description: '「正論パンチくん」とお話ができます。',
//           options: [
//             {
//               name: 'ask',
//               type: 3,
//               description: '問いかけ',
//               required: true,
//             },
//           ],
//         },
//         {
//           name: 'login',
//           description: '「正論パンチくん」とお話ができます。',
//           options: [
//             {
//               name: 'ask',
//               type: 3,
//               description: '問いかけ',
//               required: true,
//             },
//           ],
//         }
//       ]

//       this.model = new ModalBuilder()
//         .setTitle('ログイン')
//         .setDescription('ログインしてください。')


//       this.model = new ModalBuilder()
//         .setTitle("ログイン")
//         .setCustomId("userId");

//       const TextInput = new TextInputBuilder()
//         .setLabel("ユーザー名")
//         .setCustomId("name")
//         .setStyle(TextInputStyle.Short)
//         .setMaxLength(100)
//         .setMinLength(2)
//         .setRequired(true);

//       const ActionRow = new ActionRowBuilder().setComponents(TextInput);
//       this.modal.setComponents(ActionRow);
//     }

//     public static getInstance(): Store {
//       if (!Store.instance) {
//         Store.instance = new Store()
//       }
//       return Store.instance
//     }



//     public handle = async (
//       i: CommandInteraction<CacheType>,
//       _: Client<boolean>
//     ) => {
//       try {
//         const prompt = (i.options as CommandInteractionOptionResolver).getString(
//           'ask'
//         ) as string
//         await i.deferReply()
//         await i.editReply({ content: `\nsasa` })
//       } catch (error) {
//         console.error(error)
//         await i.reply('エラーが発生しました。')
//       }
//     }
//   }

//   export default Store.getInstance()
