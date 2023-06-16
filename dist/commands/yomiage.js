"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../lib/grapevineer/client");
const fs_1 = __importDefault(require("fs"));
const voice_1 = require("@discordjs/voice");
class Yomiage {
    static instance = null;
    command;
    player;
    filePath;
    connection;
    speakerIds = [];
    userSpeakerMap = new Map();
    constructor() {
        this.command = {
            name: 'yomiage',
            description: '読み上げます',
            options: [
                {
                    name: 'command',
                    type: 3,
                    description: 'コマンド',
                    required: true,
                    choices: [
                        {
                            name: 'スタート',
                            value: 'start',
                        },
                        {
                            name: 'ストップ',
                            value: 'stop',
                        },
                    ],
                },
            ],
        };
        this.player = (0, voice_1.createAudioPlayer)({
            behaviors: {
                noSubscriber: voice_1.NoSubscriberBehavior.Pause,
            },
        });
        this.filePath = 'audio.wav';
        this.connection = null;
        this.speakerIds = [
            0, 1, 8, 9, 10, 40, 34, 13, 14, 17, 20, 21, 25, 27, 30, 42, 45, 46, 48,
        ];
    }
    async writeWavFile(text, speakerId) {
        const byteData = (await (0, client_1.getWavFromText)(text, speakerId));
        fs_1.default.writeFileSync(this.filePath, byteData, 'binary');
    }
    _getRandomAvailableId() {
        const usedSpeakerIds = Array.from(this.userSpeakerMap.values());
        const availableSpeakerIds = this.speakerIds.filter((id) => !usedSpeakerIds.includes(id));
        const randomIndex = Math.floor(Math.random() * availableSpeakerIds.length);
        return availableSpeakerIds[randomIndex];
    }
    _clearUserSpeakerMap() {
        this.userSpeakerMap.clear();
    }
    setSpeakerIdByUserIdIfNotExist(userId) {
        const speakerId = this.userSpeakerMap.get(userId);
        if (!speakerId) {
            const randomId = this._getRandomAvailableId();
            this.userSpeakerMap.set(userId, randomId);
            return randomId;
        }
        return speakerId;
    }
    static getInstance() {
        if (!Yomiage.instance) {
            Yomiage.instance = new Yomiage();
        }
        return Yomiage.instance;
    }
    handle = async (i, _) => {
        try {
            const command = i.options.getString('command');
            switch (command) {
                case 'start':
                    await i.deferReply();
                    if (this.connection) {
                        await i.editReply({
                            content: '\nすでに読み上げ中です。',
                        });
                        return;
                    }
                    this.connection = await this._joinVoiceChannel(i);
                    await i.editReply({
                        content: '\n読み上げを開始します。',
                    });
                    break;
                case 'stop':
                    await i.deferReply();
                    if (!this.connection) {
                        await i.editReply({
                            content: '\n読み上げていません。',
                        });
                        return;
                    }
                    this._destory();
                    this._clearUserSpeakerMap();
                    await i.editReply({
                        content: '\n読み上げを終了します。',
                    });
            }
        }
        catch (error) {
            console.error(error);
            await i.reply({
                content: 'エラーが発生しました。',
                ephemeral: true,
            });
        }
    };
    async _joinVoiceChannel(i) {
        const guild = i.guild;
        const member = (await guild.members.fetch(i.member.user.id));
        const memberVC = member.voice.channel;
        await this._validateToPlay(i, memberVC);
        const c = (0, voice_1.joinVoiceChannel)({
            guildId: guild.id,
            channelId: memberVC.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false,
        });
        c.on('stateChange', (old_state, new_state) => {
            if (old_state.status === voice_1.VoiceConnectionStatus.Ready &&
                new_state.status === voice_1.VoiceConnectionStatus.Connecting) {
                c.configureNetworking();
            }
            if (new_state.status == voice_1.VoiceConnectionStatus.Disconnected) {
                c.destroy();
                this._clearUserSpeakerMap();
                this.connection = null;
            }
        });
        return c;
    }
    async _destory() {
        if (!this.connection)
            return;
        this.connection.destroy();
        this.connection = null;
    }
    async playAudio() {
        if (!this.connection)
            return;
        const resource = (0, voice_1.createAudioResource)(this.filePath, {
            inputType: voice_1.StreamType.Arbitrary,
        });
        this.player.play(resource);
        this.connection.subscribe(this.player);
    }
    _validateToPlay = async (i, vc) => {
        if (!vc) {
            return i.reply({
                content: '接続先のVCが見つかりません。',
                ephemeral: true,
            });
        }
        if (!vc.joinable) {
            return i.reply({
                content: 'VCに接続できません。',
                ephemeral: true,
            });
        }
    };
}
exports.default = Yomiage.getInstance();
