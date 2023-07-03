"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gas_1 = require("../lib/gas");
const ask_1 = __importDefault(require("./ask"));
const client_1 = require("../lib/grapevineer/client");
class Bo {
    static instance = null;
    command;
    constructor() {
        this.command = {
            name: 'bo',
            description: 'バロボをします。',
            options: [
                {
                    name: 'message',
                    type: 3,
                    description: 'メッセージ',
                    required: true,
                },
            ],
        };
    }
    static getInstance() {
        if (!Bo.instance) {
            Bo.instance = new Bo();
        }
        return Bo.instance;
    }
    handle = async (i, c) => {
        try {
            const message = i.options.getString('message');
            await i.deferReply();
            await (0, gas_1.sendGAS)(message, c, i.user);
            await i.editReply({ content: `\nLineにメッセージを送りました。` });
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
    bo = async (textChannel, time, c) => {
        const emojiSets = [
            ["🐢", "🐍", "🦎", "🐊"],
            ["🐬", "🐳", "🐠", "🐙"],
            ["🙈", "🙉", "🙊", "🐒"],
            ["🦁", "🐯", "🐅", "🐆"],
            ["🦉", "🦅", "🦆", "🐧"],
            ["🌳", "🍁", "🍄", "🌰"],
            ["⭐", "🌙", "☀️", "☁️"],
            ["🍎", "🍌", "🍇", "🍓"],
            ["🥦", "🥕", "🌽", "🍅"],
            ["💖", "💙", "💚", "💛"],
            ["🎸", "🎷", "🥁", "🎻"],
            ["⚽", "🏀", "🏈", "⚾"],
            ["🍵", "🍶", "🍷", "🍺"],
            ["🚗", "✈️", "🚀", "🚢"],
            ["🏞", "🌆", "🏝", "🌉"],
            ["🎂", "🍦", "🍪", "🍩"],
            ["🎈", "🎁", "🎉", "🎊"],
            ["📚", "✏️", "🎓", "🔬"],
            ["💡", "💻", "📱", "⌚"],
            ["🎭", "🎨", "🎬", "🎤"],
        ];
        const randomEmojiSet = emojiSets[Math.floor(Math.random() * emojiSets.length)];
        let text = "";
        try {
            text = await ask_1.default.generateText(`${time}にVALORANTを募集する文を作ってください。`);
        }
        catch (error) {
            text = await (0, client_1.getBoScriptRandomly)() ?? "";
        }
        ;
        textChannel
            .send(`${text}\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}\n\nあと5人！`)
            .then((message) => {
            message.react(randomEmojiSet[0]);
            message.react(randomEmojiSet[1]);
            message.react(randomEmojiSet[2]);
            message.react(randomEmojiSet[3]);
            let participants = new Set();
            const filter = (reaction, user) => {
                return (randomEmojiSet.includes(reaction.emoji.name) &&
                    user.id !== c.user.id);
            };
            const collector = message.createReactionCollector({ filter });
            collector.on('collect', (_, user) => {
                participants.add(user.id);
                const remaining = 5 - participants.size;
                if (remaining >= 0) {
                    message.edit(`${text}\n1930〜 ${randomEmojiSet[0]}\n2000〜${randomEmojiSet[1]}\n2030〜${randomEmojiSet[2]}\n2100〜${randomEmojiSet[3]}\n\nあと${remaining}人`);
                }
            });
        });
    };
}
exports.default = Bo.getInstance();
