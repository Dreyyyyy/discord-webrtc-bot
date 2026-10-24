import { Client, Events, GatewayIntentBits } from 'discord.js';
import { getDiscordToken } from '../config/env.js';
import { registerSlashCommands } from './discord/registerCommands.js';
import { routeInteraction } from './handlers/interactionRouter.js';

export async function startBot() {
  const token = getDiscordToken();
  if (!token) {
    console.warn('DISCORD_TOKEN not set — bot disabled.');
    return null;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`Discord bot logged in as ${readyClient.user.tag}`);
    try {
      await registerSlashCommands();
    } catch (err) {
      console.error('Failed to register slash commands:', err);
    }
  });

  client.on(Events.InteractionCreate, (interaction) => {
    routeInteraction(interaction).catch((err) => {
      console.error('Interaction error:', err);
      if (interaction.isRepliable() && !interaction.replied) {
        interaction.reply({ content: 'Something went wrong.', ephemeral: true }).catch(() => {});
      }
    });
  });

  await client.login(token);
  return client;
}
