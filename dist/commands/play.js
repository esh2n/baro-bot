"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_player_1 = require("discord-player");
class Play {
    static instance = null;
    playCommand;
    playStopCommand;
    connection;
    constructor() {
        this.playCommand = {
            name: 'play',
            description: 'YouTubeを再生します',
            options: [
                {
                    name: 'url',
                    type: 3,
                    description: 'YouTube URL',
                    required: true,
                },
            ],
        };
        this.playStopCommand = {
            name: 'play-stop',
            description: 'YouTubeを停止します',
        };
        this.connection = null;
    }
    static getInstance() {
        if (!Play.instance) {
            Play.instance = new Play();
        }
        return Play.instance;
    }
    handlePlay = async (i, _) => {
        try {
            await this._play(i);
        }
        catch (error) {
            console.error(error);
            await i.reply({
                content: 'エラーが発生しました。',
                ephemeral: true,
            });
        }
    };
    handlePlayStop = async (i, _) => {
        try {
            await this._stop(i);
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
    }
    async _stop(i) {
        if (!i.guild)
            return;
        const queue = (0, discord_player_1.useQueue)(i.guild.id);
        if (!queue) {
            return await i.reply({
                content: '音楽が再生されていません',
                ephemeral: true,
            });
        }
        queue.delete();
        await i.reply({
            content: '再生を終了しました',
        });
    }
    async _play(i) {
        await this._joinVoiceChannel(i);
        if (!i.guild)
            return;
        const query = i.options.getString('url');
        if (query.length < 2) {
            return;
        }
        const player = (0, discord_player_1.useMainPlayer)();
        const guild = i.guild;
        const member = (await guild.members.fetch(i.member.user.id));
        const memberVC = member.voice.channel;
        const queue = player.queues.create(i.guild.id, {
            metadata: {
                channel: memberVC,
            },
        });
        try {
            if (!queue.connection) {
                await queue.connect(memberVC);
            }
        }
        catch {
            queue.delete();
            return await i.reply({
                content: 'ボイスチャンネルに参加できませんでした',
                ephemeral: true,
            });
        }
        await i.deferReply();
        const track = await player
            .search(query, {
            requestedBy: i.user,
            searchEngine: discord_player_1.QueryType.YOUTUBE_SEARCH,
        })
            .then((x) => x.tracks[0]);
        if (!track) {
            return await i.followUp({
                content: '動画が見つかりませんでした',
            });
        }
        queue.addTrack(track);
        await player.play(memberVC, track, {
            nodeOptions: {
                metadata: {
                    channel: i.channel,
                    client: i.guild.members.me,
                    requestedBy: i.user,
                },
                volume: 0.15,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 60000,
                leaveOnEnd: true,
                leaveOnEndCooldown: 300000,
            },
        });
        return await i.followUp({
            content: `音楽をキューに追加しました **${track.title}**`,
        });
    }
    _validateToPlay = (i, vc) => {
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
exports.default = Play.getInstance();
