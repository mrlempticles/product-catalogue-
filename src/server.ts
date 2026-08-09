import 'dotenv/config';
/**
 * src/server.ts
 *
 * HTTP server entry point.
 *
 * Only concern: bind the Express app to a port and handle shutdown gracefully.
 * All application logic lives in app.ts and below.
 */

import { createApp } from './expressApp';

const PORT = parseInt(process.env.PORT ?? '3000', 10);
const VERSION = process.env.APP_VERSION ?? 'v1.0';

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(
    JSON.stringify({
      level: 'info',
      msg: `Product Catalogue Service listening`,
      port: PORT,
      version: VERSION,
      time: new Date().toISOString(),
    })
  );
});

// â”€â”€ Graceful Shutdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// On SIGTERM (Kubernetes pod termination) or SIGINT (Ctrl-C):
//   1. Stop accepting new connections.
//   2. Wait for in-flight requests to complete.
//   3. Exit cleanly.
//
// This prevents requests being dropped mid-flight when a pod is evicted or
// when a rolling update replaces this pod with a new one.

function shutdown(signal: string): void {
  console.log(JSON.stringify({ level: 'info', msg: 'Shutdown signal received', signal }));

  server.close(() => {
    console.log(JSON.stringify({ level: 'info', msg: 'Shutdown complete' }));
    process.exit(0);
  });

  // Force-exit after 10s if connections don't drain (e.g. a hung request)
  setTimeout(() => {
    console.log(JSON.stringify({ level: 'warn', msg: 'Forced shutdown after timeout' }));
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

