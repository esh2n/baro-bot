"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gas_1 = require("../lib/gas");
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
}
exports.default = Bo.getInstance();
