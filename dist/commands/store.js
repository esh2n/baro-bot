"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("../lib/grapevineer/client");
class Store {
    static instance = null;
    storeCommand;
    registerCommand;
    constructor() {
        this.storeCommand = {
            name: 'store',
            description: 'VALORANTのStore情報を提供します。',
        };
        this.registerCommand = {
            name: 'register',
            description: 'VALORANTのStore情報取得のためのTokenを生成します。',
        };
    }
    static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }
    handleStore = async (i, _) => {
        try {
            const did = i.user.id;
            await i.deferReply();
            await (0, client_1.getTodaysStoresByDiscordId)(did).then(async (s) => {
                if (s == null)
                    return;
                if (s.multiaccountSkinsList.length === 0) {
                    await i.editReply({
                        content: `\nログインしてください。(/register))`,
                    });
                    return;
                }
                for await (const skin of s.multiaccountSkinsList) {
                    const embeds = await this.getEmbed(skin.skinsList);
                    if (i.replied || i.deferred) {
                        await i.followUp({
                            content: `\n${skin.playerName}さんのStore情報です。`,
                            embeds: embeds,
                        });
                    }
                    else {
                        await i.editReply({
                            content: `\n${skin.playerName}さんのStore情報です。`,
                            embeds: embeds,
                        });
                    }
                }
            });
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
    getEmbed = async (skins) => {
        const arrayEmbed = skins.map((skin, index) => {
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(skin.displayName)
                .setAuthor({
                name: `#${index + 1}`,
            })
                .setThumbnail(skin.displayIcon)
                .setColor(skin.tier?.colorCode)
                .setFooter({
                text: skin.uuid,
                iconURL: 'https://avatars.githubusercontent.com/u/55518345?v=4',
            });
            return embed;
        });
        console.log(arrayEmbed);
        return arrayEmbed;
    };
    handleRegister = async (i, _) => {
        try {
            const did = i.user.id;
            const [id, pass] = await this.showModal(i);
            console.log(id, pass, 'id, pass');
            await (0, client_1.setStoreViewer)(did, id, pass);
        }
        catch (error) {
            console.error(error);
            await i.reply('エラーが発生しました。');
        }
    };
    showModal = async (i) => {
        const modal = new discord_js_1.ModalBuilder()
            .setCustomId('register')
            .setTitle('Login VALORANT');
        const idInput = new discord_js_1.TextInputBuilder()
            .setCustomId('IDInput')
            .setLabel('ID')
            .setStyle(discord_js_1.TextInputStyle.Short);
        const passInput = new discord_js_1.TextInputBuilder()
            .setCustomId('passInput')
            .setLabel('Password')
            .setStyle(discord_js_1.TextInputStyle.Short);
        const idb = new discord_js_1.ActionRowBuilder().addComponents(idInput);
        const passb = new discord_js_1.ActionRowBuilder().addComponents(passInput);
        modal.addComponents(idb, passb);
        await i.showModal(modal);
        const filter = (mInteraction) => mInteraction.customId === 'register';
        const res = await i
            .awaitModalSubmit({ filter, time: 60000 })
            .then(async (mInteraction) => {
            const id = mInteraction.fields.getTextInputValue('IDInput');
            const pass = mInteraction.fields.getTextInputValue('passInput');
            await mInteraction.reply({
                ephemeral: true,
                content: `\n登録完了しました。`,
            });
            return [id, pass];
        })
            .catch(console.error);
        return res;
    };
}
exports.default = Store.getInstance();
