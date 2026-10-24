import { MessageFlags } from 'discord.js';
import { startStreamSession } from '../livekit/streamSessionService.js';
import { buildWatchLink } from '../discord/buildWatchLink.js';

export async function handleStreamStart(interaction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  try {
    const { rtmpUrl, streamKey, session } = await startStreamSession({
      guildId: interaction.guildId,
      channelId: interaction.channelId,
    });

    const watchLink = buildWatchLink(session.roomName);

    await interaction.editReply({
      content: [
        '**OBS (Custom / RTMP)**',
        `Server: \`${rtmpUrl}\``,
        `Stream key: \`${streamKey}\``,
        '',
        'Start Streaming in OBS, then friends use the link posted in this channel.',
      ].join('\n'),
    });

    await interaction.channel.send({
      content: [
        `**Stream is live** (when OBS is connected) — ${interaction.user} started a stream.`,
        `Watch: ${watchLink}`,
      ].join('\n'),
    });
  } catch (err) {
    console.error(err);
    await interaction.editReply({
      content: err.message || 'Could not start stream.',
    });
  }
}
