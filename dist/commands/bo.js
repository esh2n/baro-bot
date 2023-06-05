"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bo = void 0;
const gas_1 = require("../lib/gas");
class Bo {
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
exports.Bo = Bo;
