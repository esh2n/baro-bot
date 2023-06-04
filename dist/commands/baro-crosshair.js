"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBaroCrosshair = void 0;
const getRecentMatches_1 = require("../lib/valorant-api/getRecentMatches");
const handleBaroCrosshair = async (i, _) => {
    try {
        const code = i.options.getString('code');
        await i.deferReply();
        const url = await (0, getRecentMatches_1.getCrosshairImageURL)(code);
        await i.editReply({ content: `\ncode: ${code} \n${url}` });
    }
    catch (error) {
        console.error(error);
        await i.reply('エラーが発生しました。');
    }
};
exports.handleBaroCrosshair = handleBaroCrosshair;
