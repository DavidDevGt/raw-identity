---
title: KuraiMusik
summary: An internet radio that never switches off. AI generates the music, and the system mixes and streams it on its own, around the clock, across several stations with nobody in the booth.
lang: en
year: 2026
order: 4
stack: [Next.js, FastAPI, Celery, Redis, Liquidsoap, Icecast, ACE-Step, Docker, Prometheus]
link: https://music.kuraitachi.com/
shots:
  - src: ../../../assets/projects/kuraimusik-entry.webp
    alt: The KuraiMusik landing page, with the Enter Experience button on a dark background.
    caption: 1. Step in
  - src: ../../../assets/projects/kuraimusik-mood.webp
    alt: The KuraiMusik mood selector, with Dubstep, Hacker Music and Jazz, above the playback and volume controls.
    caption: 2. Pick a mood and press play
  - src: ../../../assets/projects/kuraimusik-player.webp
    alt: The KuraiMusik player streaming an AI-generated jazz track.
    caption: 3. Listen
seen: >-
  Step in, pick a station from Dubstep, Hacker Music and Jazz, and listen to a continuous stream, just like a real radio. There's no playlist to build: tracks are generated with AI, blend into each other with a crossfade, and the player shows you what's on.
architecture:
  intro: >-
    A radio can't pause while a model finishes generating. So I separated what takes time from what always has to be playing: music is generated in the background, and the broadcast only picks up what's already ready.
  layers:
    - name: Web client
      tech: Next.js
      detail: Lives in its own repository. It picks the station, plays the stream and gets the current track and system status in real time.
    - name: Orchestrator
      tech: FastAPI
      detail: Exposes the stations, the current track and system health, and announces changes over WebSocket and Socket.IO.
    - name: Background generation
      tech: Celery and Redis
      detail: Watches each station's buffer and queues new tracks when they're needed, without touching the broadcast.
    - name: Mixing and broadcast
      tech: Liquidsoap and Icecast
      detail: Liquidsoap blends tracks with a crossfade and normalizes the volume, and Icecast delivers the audio to whoever is listening.
  services:
    - name: ACE-Step
      role: Generates the music, as a separate microservice
    - name: Redis
      role: Work queues
    - name: Liquidsoap
      role: Mixing and gain control
    - name: Icecast
      role: Streaming to listeners
    - name: Prometheus
      role: Metrics and system health
  decisions:
    - title: A playlist that evolves
      text: Each station keeps a dynamic buffer. New tracks are generated continuously and the oldest ones leave to make room, so over time the programming changes completely instead of looping the same songs.
    - title: Failures never reach your ears
      text: A circuit breaker protects the system when the generation API fails, and the radio keeps playing what's already in the buffer. Its state also reaches the client, which can say so with a friendly "we're tuning the signal".
    - title: Making it sound like a radio
      text: Crossfades and automatic gain control prevent cuts and volume jumps between tracks that were generated separately. Each MP3 also carries its ID3 metadata.
    - title: Stations as configuration
      text: Each station is declared in a YAML file, with its mount point, its name and its prompts. Adding one doesn't require touching the orchestrator's code.
    - title: A client that knows right away
      text: Track changes, buffer updates and the circuit breaker's state are sent as events, so the interface doesn't have to keep asking.
challenge: >-
  Keeping a radio station of AI-generated music going all day with no operator, so that a single failure never reaches the ears of whoever is listening. Generating a track takes time, and a live stream can't wait.
approach:
  - The backend and streaming engine live in one repository, the Next.js client in another, and ACE-Step runs as an independent service.
  - The whole backend starts with Docker Compose, including Icecast and Liquidsoap.
  - The system exposes health probes, Prometheus metrics and structured logs.
  - Rate limiting protects the API from abuse.
  - Tests cover unit, integration, smoke, API contracts, resilience and load with Locust.
tradeoffs:
  - Generate before streaming. Generating ahead uses more resources, but listeners never depend on the model's inference time.
  - Degrade instead of going down. If one piece fails, the system isolates it and the radio keeps playing.
  - Keep the generator apart from the radio. There are more services to coordinate, but the model can fail, restart or change without stopping the broadcast.
  - Use Icecast and Liquidsoap instead of custom streaming. I depend on how they're configured, and in return I lean on radio tools that are already proven.
---
