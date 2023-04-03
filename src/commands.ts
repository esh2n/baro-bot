import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';


const commands = [
  {
    name: 'baro-bo',
    description: 'バロボをします。',
    options: [
      {
        name: 'message',
        type: 3,
        description: 'メッセージ',
        required: true,
      },
    ],
  },
  {
    name: 'baro-ask',
    description: '「正論パンチくん」とお話ができます。',
    options: [
      {
        name: 'ask',
        type: 3,
        description: '問いかけ',
        required: true,
      },
    ],
  },
  {
    name: 'baro-stats',
    description: 'VALORANTの直近20戦の戦績を表示します。',
    options: [
      {
        name: 'playername',
        type: 3,
        description: 'プレイヤー名',
        required: true,
      },
      {
        name: 'tag',
        type: 3,
        description: 'プレイヤーのタグ',
        required: true,
      },
    ],
  },
  {
    name: 'baro-ask-tactics',
    description: '戦術についてAIに質問します。',
    options: [
      {
        name: 'agent',
        type: 3,
        description: '使用エージェント',
        required: true,
        choices: [
          {
            name: 'ブリムストーン',
            value: 'Brimstone',
          },
          {
            name: 'ヴァイパー',
            value: 'Viper',
          },
          {
            name: 'オーメン',
            value: 'Omen',
          },
          {
            name: 'キルジョイ',
            value: 'Killjoy',
          },
          {
            name: 'サイファー',
            value: 'Cypher',
          },
          {
            name: 'ソーヴァ',
            value: 'Sova',
          },
          {
            name: 'セージ',
            value: 'Sage',
          },
          {
            name: 'フェニックス',
            value: 'Phoenix',
          },
          {
            name: 'ジェット',
            value: 'Jett',
          },
          {
            name: 'レイナ',
            value: 'Reyna',
          },
          {
            name: 'レイズ',
            value: 'Raze',
          },
          {
            name: 'ブリーチ',
            value: 'Breach',
          },
          {
            name: 'スカイ',
            value: 'Skye',
          },
          {
            name: 'ヨル',
            value: 'Yoru',
          },
          {
            name: 'アストラ',
            value: 'Astra',
          },
          {
            name: 'KAY/O',
            value: 'KAY/O',
          },
          {
            name: 'チェンバー',
            value: 'Chamber',
          },
          {
            name: 'ネオン',
            value: 'Neon',
          },
          {
            name: 'フェイド',
            value: 'Fade',
          },
          {
            name: 'ハーバー',
            value: 'Harbor',
          },
          {
            name: 'ゲッコー',
            value: 'Gekko',
          },
        ]
      },
      {
        name: 'map',
        type: 3,
        description: 'マップ',
        required: true,
        choices: [
          {
            name: 'アセント(マーケットがある)',
            value: 'Ascent',
          },
          // {
          //   name: 'バインド(テレポートできる)',
          //   value: 'Bind',
          // },
          // {
          //   name: 'ブリーズ(メタルがある)',
          //   value: 'Breeze',
          // },
          {
            name: 'フラクチャー(真ん中にロープがある)',
            value: 'Fracture',
          },
          {
            name: 'ヘイヴン(サイトが3つあり、ガレージがある)',
            value: 'Haven',
          },
          {
            name: 'アイスボックス(雪だるまがある)',
            value: 'Icebox',
          },
          {
            name: 'パール(アートがある)',
            value: 'Pearl',
          },
          {
            name: 'スプリット(ベントがある)',
            value: 'Split',
          },
          {
            name: 'ロータス(サイトが3つあり、滝がある)',
            value: 'Lotus',
          },
        ]
      },
      {
        name: 'allied-eco-round',
        type: 3,
        description: '味方がエコラウンドかどうか',
        required: true,
        choices: [
          {
            name: '味方がエコラウンド',
            value: 'Eco-Round',
          },
          {
            name: '味方がバイラウンド',
            value: 'Buy-Round',
          },
        ]
      },
      {
        name: 'enemy-eco-round',
        type: 3,
        description: '敵がエコラウンドかどうか',
        required: true,
        choices: [
          {
            name: '敵がエコラウンド',
            value: 'Eco-Round',
          },
          {
            name: '敵がバイラウンド',
            value: 'Buy-Round',
          },
        ]
      },

      {
        name: 'team',
        type: 3,
        description: '攻めか守りか',
        required: true,
        choices: [
          {
              name: '攻め',
              value: 'Attack',
          },
          {
              name: '守り',
              value: 'Defense',
          },
        ]
      },
    ],
  },
];

(async () => {
  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN||'');

  try {
    console.log('Started refreshing application (/) commands.');
    if (process.env.GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID||'', process.env.GUILD_ID as string), {
        body: commands,
      });
    } else {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID||''), {
        body: commands,
      });
    }
  }catch (error) {
    console.error('Error while reloading application (/) commands: ', error);
  }
})();