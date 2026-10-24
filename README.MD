# Discord WebRTC Bot Project

ANPD’s [order](https://www.gov.br/anpd/pt-br/assuntos/noticias/em-medida-preventiva-anpd-determina-que-discord-suspenda-transmissoes-ao-vivo-no-brasil) suspends Discord Go Live and functionally equivalent live video, including video delivered by bots, integrations, and commands. Voice and text stay available. This project stays a private watch page that each operator runs for their own friends.

- Media moves from the gaming PC to that operator’s LiveKit project (Cloud by default), then to a browser.
- Discord only receives a text message with the viewer link.
- Each install is one operator, one friend group, private rooms, a hard cap on viewers.
- No Discord Activities, no video embedded in the Discord client, and no work aimed at hiding the bot from Discord’s enforcement.

## Phase 0 — Accounts (done)

- **LiveKit Cloud** — [livekit.io](https://livekit.io) → Build (free), create a project, save `LIVEKIT_URL`, API key, and secret. Read their Ingress + WHIP docs once so I can know what the bot will call later.
- **Discord** — Discord Developer Portal → New application → Bot → token; enable Message Content (slash commands usually don’t). Invite the bot with the `applications.commands` scope.
- **Bot-Hosting** — [bot-hosting.net](https://bot-hosting.net) account; note 4-day renewal on the free tier.

## Phase 1 — Capture proof (in progress)

**Goal:** MP4 on disk = game video + game audio only (no Discord bleed).

1. Install OBS + Linux plugins (`vkcapture`, PipeWire app audio) or Windows Game Capture + app audio.
2. Build one scene, **Record** (not stream) for 2–3 minutes while in a game.
3. Play the file: correct window, correct audio, no friends’ voices from Discord.

## Phase 2 — LiveKit proof

**Goal:** Same OBS scene → WHIP → watch in a browser on phone 4G.

1. In the LiveKit dashboard or CLI, learn how to create a WHIP ingress and get the URL + stream key (I’ll automate this in the bot later; do it manually once).
2. OBS → Settings → Stream → Custom / WHIP (per LiveKit encoder docs) → paste URL/key.
3. Start streaming; open LiveKit’s sample meet app or a minimal HTML page with `livekit-client` using a token I mint (dashboard or a one-off script you write yourself).

## Phase 3 — Watch page

**Goal:** `https://your-host/...#token=...` → click Join → video.

- One HTML page + `livekit-client` (npm bundle or CDN).
- Read the token from `location.hash` (fragment), not the query string (Discord preview).
- `Room.connect(LIVEKIT_URL, token)` and attach the remote video track to a `<video>` element.
- Run locally with Node + Express serving `web/` until it works against my Cloud project.

## Phase 4 — Discord bot

**Goal:** `/stream start` and `/stream stop` without OBS automation.

Learn in order:

- **discord.js** — register slash commands, `interaction.reply` ephemeral vs channel message.
- **livekit-server-sdk** — `RoomServiceClient`, `IngressClient` (or REST): create room, create WHIP ingress, delete on stop.
- **JWT** — subscribe-only token for viewers (`VideoGrant` `canSubscribe`, not publish).

`/stream start` flow I implement:

1. Create room + ingress → ephemeral reply with WHIP server + stream key for the streamer.
2. Channel message: `PUBLIC_WATCH_URL` + `'#'` + token (or my chosen fragment format).
3. Store `roomName` / `ingressId` in memory (or a JSON file) for `/stream stop`.
4. `/stream stop`: delete ingress, delete room, clear state.

## Phase 5 — Deploy on Bot-Hosting

- One Node deployment: `index.js` starts the Discord client + `express.static('web')`.
- Env vars in the panel: `DISCORD_TOKEN`, `LIVEKIT_*`, `PUBLIC_WATCH_URL` = your `*.apps.bot-hosting.cloud` URL.
- Deploy from GitHub; set the start command to `node index.js` (or whatever you use).
- Re-register slash commands if I used a guild ID for dev (global vs guild commands).
