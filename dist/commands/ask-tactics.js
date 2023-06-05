"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskTactics = void 0;
const openai_api_1 = require("../lib/openai-api");
class AskTactics {
    command;
    _rulePrompt;
    constructor() {
        this.command = {
            name: 'ask-tactics',
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
                    ],
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
                    ],
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
                    ],
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
                    ],
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
                    ],
                },
            ],
        };
        this._rulePrompt = `
        You are an excellent tactician in the game Valorant, produced by Riot Games.

        The output should be a markdown code snippet formatted in the following schema in Japanese:

        \`\`\`json
        [
            {
                title: string, // operation name.
                detail: string // operation detail.
            },
            {
                title: string, // operation name.
                detail: string // operation detail.
            },
        ]
        \`\`\`

        NOTES:
        * Do not include non-existent map names or character names.
        * Please provide at least three effective strategies.
        * Please do not include anything other than JSON in your answer.
        * Response must be Japanese
        * If the question includes "whether it is an eco-round" or "where is the map" or "what agent is used" or "whether it is offensive or defensive", please take this into account.
        `;
    }
    handle = async (i, _) => {
        try {
            const agent = i.options.getString('agent');
            const map = i.options.getString('map');
            const alliedEcoRound = i.options.getString('allied-eco-round');
            const enemyEcoRound = i.options.getString('enemy-eco-round');
            const team = i.options.getString('team');
            const prompt = (0, openai_api_1.getUserPrompt)(agent, map, alliedEcoRound, enemyEcoRound, team);
            const answer = await (0, openai_api_1.generateAIResponse)(prompt, this._rulePrompt);
            await i.editReply({ content: `\n${answer}` });
            await i.deferReply();
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
}
exports.AskTactics = AskTactics;
