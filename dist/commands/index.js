"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = exports.FlowerMeaning = exports.Crosshair = exports.Bo = exports.AskTactics = exports.Ask = void 0;
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const ask_1 = require("./ask");
const ask_tactics_1 = require("./ask-tactics");
const bo_1 = require("./bo");
const crosshair_1 = require("./crosshair");
const stats_1 = require("./stats");
const flower_meaning_1 = require("./flower-meaning");
const getCommands = async () => {
    return [
        new ask_1.Ask().command,
        new ask_tactics_1.AskTactics().command,
        new bo_1.Bo().command,
        new crosshair_1.Crosshair().command,
        new flower_meaning_1.FlowerMeaning().command,
        new stats_1.Stats().command,
    ];
};
const waitSeconds = (second) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 1000 * second);
    });
};
(async () => {
    const rest = new rest_1.REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN || '');
    try {
        const commands = await getCommands();
        await waitSeconds(5);
        console.log('Started refreshing application (/) commands.');
        if (process.env.GUILD_ID) {
            await rest.put(v9_1.Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID), {
                body: commands,
            });
        }
        else {
            await rest.put(v9_1.Routes.applicationCommands(process.env.CLIENT_ID || ''), {
                body: commands,
            });
        }
    }
    catch (error) {
        console.error('Error while reloading application (/) commands: ', error);
    }
})();
var ask_2 = require("./ask");
Object.defineProperty(exports, "Ask", { enumerable: true, get: function () { return ask_2.Ask; } });
var ask_tactics_2 = require("./ask-tactics");
Object.defineProperty(exports, "AskTactics", { enumerable: true, get: function () { return ask_tactics_2.AskTactics; } });
var bo_2 = require("./bo");
Object.defineProperty(exports, "Bo", { enumerable: true, get: function () { return bo_2.Bo; } });
var crosshair_2 = require("./crosshair");
Object.defineProperty(exports, "Crosshair", { enumerable: true, get: function () { return crosshair_2.Crosshair; } });
var flower_meaning_2 = require("./flower-meaning");
Object.defineProperty(exports, "FlowerMeaning", { enumerable: true, get: function () { return flower_meaning_2.FlowerMeaning; } });
var stats_2 = require("./stats");
Object.defineProperty(exports, "Stats", { enumerable: true, get: function () { return stats_2.Stats; } });
