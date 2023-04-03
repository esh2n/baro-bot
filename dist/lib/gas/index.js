"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendGAS = void 0;
const sendGAS = (message, client, user) => {
    var jsonData = {
        events: [
            {
                type: "discord",
                name: user.username,
                message: message.content
            }
        ]
    };
    post(message, process.env.GAS_URL || '', jsonData, client);
};
exports.sendGAS = sendGAS;
function post(msg, url, data, client) {
    var request = require("request");
    var options = {
        uri: url,
        headers: { "Content-type": "application/json" },
        json: data,
        followAllRedirects: true
    };
    request.post(options, function (error, response, _) {
        if (error != null) {
            msg.reply("更新に失敗しました");
            return;
        }
        var userid = response.body.userid;
        var channelid = response.body.channelid;
        var message = response.body.message;
        if (userid != undefined &&
            channelid != undefined &&
            message != undefined) {
            var channel = client.channels.get(channelid);
            if (channel != null) {
                channel.send(message);
            }
        }
    });
}
