"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../lib/grapevineer/client");
class FlowerMeaning {
    static instance = null;
    command;
    constructor() {
        this.command = {
            name: 'flower-meaning',
            description: '花言葉を表示します。',
            options: [
                {
                    name: 'date',
                    type: 3,
                    description: '日付(ex. 1月11日 → 0111)',
                    required: false,
                },
            ],
        };
    }
    static getInstance() {
        if (!FlowerMeaning.instance) {
            FlowerMeaning.instance = new FlowerMeaning();
        }
        return FlowerMeaning.instance;
    }
    handle = async (i, _) => {
        try {
            const date = i.options.getString('date');
            const flowerMeaning = await (0, client_1.getFlowerMeaningByDate)(date);
            await i.deferReply();
            await i.editReply({
                content: `\n${flowerMeaning?.sumamry}`,
            });
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
}
exports.default = FlowerMeaning.getInstance();
