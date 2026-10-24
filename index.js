import { startServer } from './src/server/start.js';

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
