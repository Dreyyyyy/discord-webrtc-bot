# Deploy on Bot-Hosting.net (Phase 5)

One **Node.js** deployment runs the Discord bot, the watch page, and `/api/viewer-token`. LiveKit stays on **LiveKit Cloud**; Bot-Hosting only serves HTTP + the bot gateway.

Free tier: **256 MB RAM**, **one deployment**, **manual renewal every 4 days** in the panel ([bot-hosting.net](https://bot-hosting.net)).

## 1. Push the repo to GitHub

Bot-Hosting deploys from GitHub (public or private). Ensure `.env` is **not** committed (only `.env.example`).

## 2. Create the deployment

1. [Bot-Hosting](https://bot-hosting.net) → **Deploy an application** → **From GitHub**.
2. Select this repository and branch (e.g. `main`).
3. Runtime: **Node.js**.
4. **Start command:** `npm start` (runs `node index.js`).

## 3. Environment variables

In the deployment **Environment** tab, add each variable as **secret** where possible:

| Variable | Value |
|----------|--------|
| `DISCORD_TOKEN` | Bot token (Developer Portal → Bot) |
| `DISCORD_APP_ID` | Application ID (same portal → General Information) |
| `DISCORD_GUILD_ID` | *(recommended)* Test server ID for instant slash commands |
| `LIVEKIT_URL` | `wss://….livekit.cloud` |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `MAX_VIEWERS` | e.g. `8` |
| `PUBLIC_WATCH_URL` | See step 4 |

Do **not** set `PORT` unless the panel docs say to; the host usually injects `PORT` automatically.

## 4. `PUBLIC_WATCH_URL` (two-step)

1. **First deploy** without `PUBLIC_WATCH_URL` (or use a placeholder).
2. Open the deployment → copy the **HTTPS** URL (e.g. `https://your-name.apps.bot-hosting.cloud`). No trailing slash.
3. Set `PUBLIC_WATCH_URL` to that URL → **restart** the deployment.

Discord watch links will look like:  
`https://your-name.apps.bot-hosting.cloud#room=stream-…`

## 5. Verify

1. Logs: `Discord bot logged in as …` and `Server is running on …`.
2. Open `PUBLIC_WATCH_URL` in a browser → watch page loads.
3. In Discord: `/stream` → `start` → ephemeral RTMP creds + channel link.
4. OBS → stream → open link → **Join**.

## 6. Slash commands in production

- With **`DISCORD_GUILD_ID`**: commands update on the next bot start (seconds).
- Without it: **global** commands can take up to ~1 hour.

## 7. Free tier renewal

Every **4 days**, renew the deployment in the Bot-Hosting panel or the bot goes offline (watch page + Discord).

## 8. Local vs hosted

| | Local | Bot-Hosting |
|---|--------|-------------|
| `PUBLIC_WATCH_URL` | `http://localhost:3000` | `https://….apps.bot-hosting.cloud` |
| Friends watch from | Same PC / LAN / tunnel | Anywhere with the Discord link |
| OBS | Your gaming PC | Still your gaming PC |

## Troubleshooting

- **`PUBLIC_WATCH_URL is not configured`** — set step 4 and restart.
- **Ingress limit (2)** — delete old ingresses: `command lk ingress list` / `delete` (see README).
- **Bot offline** — check renewal, `DISCORD_TOKEN`, and logs in the panel console.
