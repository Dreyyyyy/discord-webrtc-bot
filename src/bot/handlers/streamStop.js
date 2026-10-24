import { MessageFlags } from 'discord.js';
import { stopStreamSession } from '../livekit/streamSessionService.js';

export async function handleStreamStop(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  try {
    await stopStreamSession(interaction.guildId);
    await interaction.editReply({ content: 'Stream ended. Room and ingress removed.' });
    await interaction.channel.send('Stream ended.');
  } catch (err) {
    console.error(err);
    await interaction.editReply({
      content: err.message || 'Could not stop stream.',
    });
  }
}
