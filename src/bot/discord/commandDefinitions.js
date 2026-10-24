export const streamCommands = [
  {
    name: 'stream',
    description: 'Private game stream (browser watch link)',
    options: [
      {
        name: 'start',
        description: 'Create a room and post a watch link',
        type: 1,
      },
      {
        name: 'stop',
        description: 'End the stream and tear down the LiveKit room',
        type: 1,
      },
    ],
  },
];
