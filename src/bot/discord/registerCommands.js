import { REST, Routes } from 'discord.js';
import { getDiscordAppId, getDiscordGuildId, getDiscordToken } from '../../config/env.js';
import { streamCommands } from './commandDefinitions.js';

export async function registerSlashCommands() {
  const token = getDiscordToken();
  const clientId = getDiscordAppId();
  if (!token || !clientId) {
    throw new Error('DISCORD_TOKEN and DISCORD_APP_ID are required for the bot.');
  }

  const rest = new REST({ version: '10' }).setToken(token);
  const guildId = getDiscordGuildId();

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: streamCommands,
    });
    console.log(`Slash commands registered for guild ${guildId}`);
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), {
    body: streamCommands,
  });
  console.log('Slash commands registered globally (may take up to an hour).');
}
