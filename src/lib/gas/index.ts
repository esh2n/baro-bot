import { GAS_URL } from "../../secrets";

export const sendGAS = (message, client) =>{
    // LINE Messaging API風の形式に仕立てる(GASでの場合分けが楽になるように)
    var jsonData = {
      events: [
        {
          type: "discord",
          name: message.author.username,
          message: message.content
        }
      ]
    };
    //GAS URLに送る
    post(message, GAS_URL, jsonData, client);
}

function post(msg, url, data, client) {
    //requestモジュールを使う
    var request = require("request");
    var options = {
      uri: url,
      headers: { "Content-type": "application/json" },
      json: data,
      followAllRedirects: true
    };
    // postする
    request.post(options, function(error, response, body) {
      if (error != null) {
        msg.reply("更新に失敗しました");
        return;
      }

      var userid = response.body.userid;
      var channelid = response.body.channelid;
      var message = response.body.message;
      if (
        userid != undefined &&
        channelid != undefined &&
        message != undefined
      ) {
        var channel = client.channels.get(channelid);
        if (channel != null) {
          channel.send(message);
        }
      }
    });
}