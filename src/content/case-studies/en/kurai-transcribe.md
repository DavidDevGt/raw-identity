---
title: Kurai-Transcribe
summary: My own Whisper transcription service, running on my GPU. Upload audio and get punctuated text back, with word-level timing and without sending it to any transcription provider.
lang: en
year: 2026
order: 3
stack: [Faster-Whisper, CTranslate2, FastAPI, CUDA, Transformers, Prometheus, NGINX, WireGuard]
link: https://transcribe.kuraitachi.com/
cover: ../../../assets/projects/kurai-transcribe-cover.webp
coverAlt: "The Kurai-Transcribe page, with its audio-to-text heading and the audio drop zone."
shots:
  - src: ../../../assets/projects/kurai-transcribe.webp
    alt: The Kurai-Transcribe page, with its audio-to-text heading and the audio drop zone.
    caption: Drop in an audio file, that's it
seen: >-
  The API is the product, and this public page is the fastest way to try it without writing code. Drop in an audio file and Whisper transcribes it on my GPU, with punctuation already restored, ready to copy or download.
architecture:
  intro: >-
    I designed it as infrastructure rather than a demo. GPU inference isn't magic: it's compute, memory and heat, so the service looks after all three and keeps them in plain sight.
  layers:
    - name: Public access
      tech: NGINX and WireGuard
      detail: NGINX takes requests over HTTPS and a WireGuard tunnel carries them to my GPU machine, which isn't directly exposed.
    - name: API
      tech: FastAPI
      detail: Transcribes synchronously or in the background with a webhook, and offers system health and metrics on their own endpoints.
    - name: Audio preparation
      tech: pydub and ffmpeg
      detail: Validates each file before it reaches the GPU and converts formats like the OGG Opus of WhatsApp voice notes.
    - name: Inference
      tech: Faster-Whisper
      detail: Runs large-v3 on CTranslate2 in float16, with voice activity filtering (VAD) and word-level timestamps.
    - name: Punctuation
      tech: Transformers
      detail: A model restores the text's punctuation, with a rule-based fallback if it isn't available.
  services:
    - name: NVIDIA CUDA
      role: GPU-accelerated inference
    - name: NVML
      role: Reads VRAM, usage and temperature
    - name: Prometheus
      role: Service and GPU metrics
    - name: Webhooks
      role: Delivers async jobs
  decisions:
    - title: One inference at a time on the GPU
      text: A semaphore guards the GPU to prevent VRAM fragmentation and unstable parallel inference. Requests wait their turn instead of competing for memory and taking the service down.
    - title: The model loads once
      text: Whisper loads at startup and stays resident in VRAM, so no request pays the time it takes to load it.
    - title: Not hiding the system's state
      text: The health endpoint and metrics show VRAM, temperature, GPU usage, latency, error rate and speed against real time. If something goes wrong, you can see why.
    - title: Two ways to ask for the same thing
      text: For short audio, the API answers in the same request. For long audio, it replies right away and delivers the result to a webhook, so nobody is left holding a connection open.
    - title: Failing fast and clearly
      text: Files that won't work are rejected before they take up the GPU, and errors come back as clear JSON.
challenge: >-
  Getting quality transcription without sending audio to a transcription provider. That means controlling the data and the model on my own hardware, without GPU memory taking the service down and always knowing what's going on inside.
approach:
  - The service doesn't depend on any outside SaaS to transcribe.
  - The response includes the language, the full text, word-level timestamps, the latency and the speed of that transcription.
  - The web page is just a client of the API, with drag and drop, plus options to copy and download.
  - It runs as a Linux service on my own machine, with scripts to install and start it.
tradeoffs:
  - API first. The website is just one more client, so another application can integrate without touching the engine.
  - My own hardware instead of an outside provider. I gain control over the data and the model, and in exchange memory and availability are my responsibility.
  - One inference at a time. Fewer requests are served in parallel, but the service stays stable on a single GPU.
  - Model always resident. It holds VRAM even with no work to do, in exchange for every request starting without waiting for a load.
---
