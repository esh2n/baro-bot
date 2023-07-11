"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const valorant_api_1 = require("../lib/valorant-api");
class Crosshair {
    static instance = null;
    command;
    constructor() {
        this.command = {
            name: 'crosshair',
            description: 'クロスヘアが表示されます。',
            options: [
                {
                    name: 'code',
                    type: 3,
                    description: 'クロスヘアコード',
                    required: true,
                },
            ],
        };
    }
    static getInstance() {
        if (!Crosshair.instance) {
            Crosshair.instance = new Crosshair();
        }
        return Crosshair.instance;
    }
    handle = async (i, _) => {
        try {
            const code = i.options.getString('code');
            await i.deferReply();
            const url = await (0, valorant_api_1.getCrosshairImageURL)(code);
            await i.editReply({ content: `\ncode: ${code} \n${url}` });
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
}
exports.default = Crosshair.getInstance();
