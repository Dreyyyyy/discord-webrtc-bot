# Discord WebRTC Bot Project

ANPD’s [order](https://www.gov.br/anpd/pt-br/assuntos/noticias/em-medida-preventiva-anpd-determina-que-discord-suspenda-transmissoes-ao-vivo-no-brasil) suspends Discord Go Live and functionally equivalent live video, including video delivered by bots, integrations, and commands. Voice and text stay available. This project stays a private watch page that each operator runs for their own friends.

- Media moves from the gaming PC to that operator’s LiveKit project (Cloud by default), then to a browser.
- Discord only receives a text message with the viewer link.
- Each install is one operator, one friend group, private rooms, a hard cap on viewers.
- No Discord Activities, no video embedded in the Discord client, and no work aimed at hiding the bot from Discord’s enforcement.

*This project will be done using LLMs on most part, and when I use it, It will be denoted on the commit.*



## Phase 0 — Accounts (done)

- **LiveKit Cloud** — [livekit.io](https://livekit.io) → Build (free), create a project, save `LIVEKIT_URL`, API key, and secret. Read their Ingress + WHIP docs once so I can know what the bot will call later.
- **Discord** — Discord Developer Portal → New application → Bot → token; enable Message Content (slash commands usually don’t). Invite the bot with the `applications.commands` scope.
- **Bot-Hosting** — [bot-hosting.net](https://bot-hosting.net) account; note 4-day renewal on the free tier.



## Phase 1 — Capture proof (done)

**Goal:** MP4 on disk = game video + game audio only (no Discord bleed).

1. Install OBS + Linux plugins (`vkcapture`, PipeWire app audio) or Windows Game Capture + app audio.
2. Build one scene, **Record** (not stream) for 2–3 minutes while in a game.
3. Play the file: correct window, correct audio, no friends’ voices from Discord.



## Phase 2 — LiveKit proof (done)

**Goal:** Same OBS scene → WHIP → watch in a browser on phone 4G.

1. In the LiveKit dashboard or CLI, learn how to create a WHIP ingress and get the URL + stream key (I’ll automate this in the bot later; do it manually once).
2. OBS → Settings → Stream → Custom / WHIP (per LiveKit encoder docs) → paste URL/key.
3. Start streaming; open LiveKit’s sample meet app or a minimal HTML page with `livekit-client` using a token I mint (dashboard or a one-off script you write yourself).

## Phase 3 — Watch page (done)

**Goal:** `https://your-host/...#token=...` → click Join → video.

- One HTML page + `livekit-client` (npm bundle or CDN).
- Read the token from `location.hash` (fragment), not the query string (Discord preview).
- `Room.connect(LIVEKIT_URL, token)` and attach the remote video track to a `<video>` element.
- Run locally with Node + Express serving `web/` until it works against my Cloud project.



## Phase 4 — Discord bot (done)

- `/stream start` — LiveKit room + RTMP ingress, ephemeral OBS URL/key, channel link `#room=…`
- `/stream stop` — delete ingress and room
- Watch page mints per-viewer tokens via `GET /api/viewer-token?room=…`

Run locally: copy `.env.example` → `.env`, then `npm start`.



## Phase 5 — Deploy on Bot-Hosting (Done)

Step-by-step: **[docs/bot-hosting.md](docs/bot-hosting.md)**

Summary:

1. GitHub → Bot-Hosting → **Node.js** deployment, start command **`npm start`**.
2. Set env vars (`DISCORD_*`, `LIVEKIT_*`, `MAX_VIEWERS`).
3. After first deploy, set **`PUBLIC_WATCH_URL`** to your `https://….apps.bot-hosting.cloud` URL and restart.
4. Renew the free deployment every **4 days** in the panel.

## Things that can be improved/keep in mind
- Currently im using [livekit cloud](https://cloud.livekit.io/) for the webrtc part, and [bot-hosting](https://bot-hosting.net/) for hosting the frontend/backend, I didnt test any othe infras but its possible to do that with some changes;
- Need to add other resolutions support, as it is hardcoded to 720p 30 fps at the moment;
- Need to translate it to PT-BR;

