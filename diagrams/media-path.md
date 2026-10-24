# Where media moves

```mermaid
flowchart LR
  game[Game on Linux or Windows]
  obs[OBS]
  ingress[LiveKit WHIP ingress]
  sfu[LiveKit Cloud SFU and TURN]
  page[Browser watch page]
  nodeApp[Node app on Bot-Hosting]
  discord[Discord text channel]

  game --> obs
  obs -->|WHIP, one upload| ingress
  ingress --> sfu
  sfu -->|WebRTC, per viewer| page
  nodeApp -->|room, ingress, subscribe-only JWT| sfu
  nodeApp -->|HTTPS watch page| page
  nodeApp -->|watch link| discord
  discord -.->|friend opens link| page
```
