"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBaroStats = void 0;
const valorant_api_1 = require("../lib/valorant-api");
const handleBaroStats = async (i, _) => {
    try {
        const playerName = i.options.getString('playername');
        let tag = i.options.getString('tag');
        if (tag.startsWith('#')) {
            tag = tag.substring(1);
        }
        await i.deferReply();
        const [recentMatches, agentImageFiles] = await (0, valorant_api_1.getEmbedRecentMatchData)(playerName, tag);
        await i.editReply({ content: `\n${playerName}#${tag}さんの直近5試合`, embeds: recentMatches, files: agentImageFiles });
    }
    catch (error) {
        console.error(error);
        await i.reply('エラーが発生しました。');
    }
};
exports.handleBaroStats = handleBaroStats;
