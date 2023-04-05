import { CacheType, Client, GatewayIntentBits, Interaction } from 'discord.js';
import { handleBaroAsk, handleBaroBo, handleBaroStats, handleBaroAskTactics, handleBaroCrosshair } from './commands';
import http from 'http';

require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

http
.createServer(function(_, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Discord bot is active now \n");
})
.listen(process.env.PORT);

client.on('ready', () => {
  console.log('Bot is ready.');
});

client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;
  switch (command) {
    case 'baro-bo':
      await handleBaroBo(interaction, client)
      break;
    case 'baro-ask':
      await handleBaroAsk(interaction, client)
      break;
    case 'baro-stats':
      await handleBaroStats(interaction, client)
      break;
    case 'baro-crosshair':
      await handleBaroCrosshair(interaction, client)
      break;
    case 'baro-ask-tactics':
      await handleBaroAskTactics(interaction, client)
      break;
    default:
      break;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN||'');
import './commands'
