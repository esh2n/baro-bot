"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const ask_1 = __importDefault(require("./ask"));
const bo_1 = __importDefault(require("./bo"));
const crosshair_1 = __importDefault(require("./crosshair"));
const flower_1 = __importDefault(require("./flower"));
const stats_1 = __importDefault(require("./stats"));
const yomiage_1 = __importDefault(require("./yomiage"));
const store_1 = __importDefault(require("./store"));
const getCommands = async () => {
    return [
        ask_1.default.command,
        bo_1.default.command,
        crosshair_1.default.command,
        flower_1.default.command,
        stats_1.default.command,
        yomiage_1.default.command,
        store_1.default.registerCommand,
        store_1.default.storeCommand,
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
