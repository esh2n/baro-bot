import { Client, CommandInteractionOptionResolver, GatewayIntentBits } from 'discord.js';
import { getEmbedRecentMatchData } from './lib/valorant-api/index';
import { generateAIResponse, getUserPrompt } from './lib/openai-api/index';
import { Round, Team } from './lib/openai-api/types';
import { sendGAS } from './lib/gas';
import http from 'http';
import querystring from 'querystring';

require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

http.createServer(function(req, res){
  if (req.method == 'POST'){
    let data = "";
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      if(!data){
        console.log("No post data");
        res.end();
        return;
      }
      const dataObject = querystring.parse(data);
      console.log("post:" + dataObject.type);
      if(dataObject.type == "wake"){
        console.log("Woke up in post");
        res.end();
        return;
      }
      res.end();
    });
  }
  else if (req.method == 'GET'){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Discord Bot is active now\n');
  }
}).listen(process.env.PORT);

client.on('ready', () => {
  console.log('Bot is ready.');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  switch (interaction.commandName) {
    case 'baro-bo':
      try {
        const message = (interaction.options as CommandInteractionOptionResolver).getString('message') as string;
        await interaction.deferReply();

        await sendGAS(message, client, interaction.user);
        await interaction.editReply({ content: `\nhoge`});

      } catch (error) {
        console.error(error);
        await interaction.reply('エラーが発生しました。');
      }
      break;
    case 'baro-ask':
      try {
        const prompt = (interaction.options as CommandInteractionOptionResolver).getString('ask') as string;
        await interaction.deferReply();
        const rulePrompt: string = `
        あなたは口を開けば正論パンチしかしない、「正論パンチくん」です。
        以下のルールに従って問いかけに対し、回答をしてください。
        1. 日本語で回答してください。
        2. 回答は100字以内に収めてください。
        3. 言葉遣いは乱暴で、冷たくしてください。
        4. 相手のことは「お前」、自分のことは「私」としてください。
        5. 漢字や誤字脱字など言葉のミスは必要以上に責めてください。
        6. 1/10の確率で優しい回答をしてください。
        7. 回答文のみを提示してください。


        問いかけ:
        `

        const answer = await generateAIResponse(prompt, rulePrompt)

        await interaction.editReply({ content: `\n${prompt}\n${answer}`});

      } catch (error) {
        console.error(error);
        await interaction.reply('エラーが発生しました。');
      }
      break;

    case 'valorant-stats':
      try {
        const playerName = (interaction.options as CommandInteractionOptionResolver).getString('playername') as string;
        let tag = (interaction.options as CommandInteractionOptionResolver).getString('tag') as string;
        if (tag.startsWith('#')) {
          tag = tag.substring(1)
        }

        await interaction.deferReply();
        const [recentMatches, agentImageFiles] = await getEmbedRecentMatchData(playerName!, tag!);

        // Add content property with the text for the recent matches
        await interaction.editReply({ content: `\n${playerName}#${tag}さんの直近5試合`, embeds: recentMatches, files: agentImageFiles});

      } catch (error) {
        console.error(error);
        await interaction.reply('エラーが発生しました。');
      }
      break;

    case 'baro-ask-tactics':
        try {
          const agent = (interaction.options as CommandInteractionOptionResolver).getString('agent') as string;
          const map = (interaction.options as CommandInteractionOptionResolver).getString('map') as string;
          const alliedEcoRound = (interaction.options as CommandInteractionOptionResolver).getString('allied-eco-round') as Round;
          const enemyEcoRound = (interaction.options as CommandInteractionOptionResolver).getString('enemy-eco-round') as Round
          const team = (interaction.options as CommandInteractionOptionResolver).getString('team') as Team;
          const prompt = getUserPrompt(agent, map, alliedEcoRound, enemyEcoRound, team);

          await interaction.deferReply();

          const rulePrompt: string = `
          You are an excellent tactician in the game Valorant, produced by Riot Games.

          The output should be a markdown code snippet formatted in the following schema in Japanese:

          \`\`\`json
          [
              {
                  title: string, // operation name.
                  detail: string // operation detail.
              },
              {
                  title: string, // operation name.
                  detail: string // operation detail.
              },
          ]
          \`\`\`

          NOTES:
          * Do not include non-existent map names or character names.
          * Please provide at least three effective strategies.
          * Please do not include anything other than JSON in your answer.
          * Response must be Japanese
          * If the question includes "whether it is an eco-round" or "where is the map" or "what agent is used" or "whether it is offensive or defensive", please take this into account.
          `

          const answer = await generateAIResponse(prompt, rulePrompt)

          await interaction.editReply({ content: `\n${answer}`});

        } catch (error) {
          console.error(error);
          await interaction.reply('エラーが発生しました。');
        }
      break;

    default:
      break;
  }

});

client.login(process.env.DISCORD_BOT_TOKEN||'');
import './commands'

