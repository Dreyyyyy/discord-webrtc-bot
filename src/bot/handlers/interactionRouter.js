import { handleStreamStart } from './streamStart.js';
import { handleStreamStop } from './streamStop.js';

export async function routeInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'stream') return;

  if (!interaction.guildId) {
    await interaction.reply({
      content: 'Use this command in a server, not in DMs.',
      ephemeral: true,
    });
    return;
  }

  const sub = interaction.options.getSubcommand();
  if (sub === 'start') {
    await handleStreamStart(interaction);
    return;
  }
  if (sub === 'stop') {
    await handleStreamStop(interaction);
    return;
  }
}
