---
title: TRAZO
summary: A local pipeline that turns a text file into a one-minute vertical video explaining a technical concept, with narration, programmed animation and automatic quality checks.
lang: en
year: 2026
order: 2
stack: [Node.js, Python, skia-canvas, FFmpeg, Kokoro, YAML, JSON Schema]
highlights:
  - value: YAML
    label: One file per video
  - value: 1080×1920
    label: Vertical, at 30 fps
wideShots: true
cover: ../../../assets/projects/trazo-render.png
coverAlt: "TRAZO render screen with the video preview, the buttons to download the MP4 and SRT, and the QA checklist with its key frames."
shots:
  - src: ../../../assets/projects/trazo-yaml.png
    alt: A video editor in the TRAZO interface. It shows the YAML file with the title, the idea, the shots and their lines, and the validation panel on the right.
    caption: 1. The script is a text file
  - src: ../../../assets/projects/trazo-inventario.png
    alt: TRAZO scene inventory, with search, topic filters and one card per scene with its description and a preview.
    caption: 2. An inventory of reusable scenes
  - src: ../../../assets/projects/trazo-fotogramas.png
    alt: TRAZO test bench with the key frames of each scene and their timing, to review the animation before the full render.
    caption: 3. Key frames before the render
  - src: ../../../assets/projects/trazo-render.png
    alt: TRAZO render screen with the video preview, the buttons to download the MP4 and SRT, and the QA checklist with its key frames.
    caption: 4. Render and quality control
seen: >-
  A short video that explains a technical concept with animation, my voice and subtitles, made for someone who has never programmed. I publish them on YouTube, TikTok and Instagram.
architecture:
  intro: >-
    A video is a text file with its shots, lines and scenes. Everything else is generated from that file, so a changed line shows up in both the narration and the animation without touching anything else.
  layers:
    - name: Script and storyboard
      tech: YAML
      detail: Each video lives in one file with its shots, lines, scenes and parameters. A JSON schema validates the structure before any time is spent rendering.
    - name: Narration
      tech: My microphone and Kokoro
      detail: I record the narration with my microphone and the pipeline aligns it word by word with the animation. Kokoro can also generate a voice with those same timings.
    - name: Scene engine
      tech: Node.js and skia-canvas
      detail: Draws each 1080×1920 frame at 30 fps as a pure function of time. That is why every scene can be tested and repeated.
    - name: Audio and mixing
      tech: FFmpeg
      detail: Mixes the voice with sound effects and a music bed synthesized from the scene's events, normalizes the loudness and exports the MP4 and the subtitles.
    - name: Quality control
      tech: Python
      detail: Checks the format, the sound, whether text stays inside the safe zone, the pacing and the loop ending. It flags failures and warnings before a person reviews the video.
  services:
    - name: Kokoro
      role: A voice generated locally, as an alternative to my recording
    - name: skia-canvas
      role: 2D rasterizing of each frame
    - name: FFmpeg
      role: Encoding, mixing and subtitles
    - name: Local interface
      role: A browser panel that runs the same pipeline commands
  decisions:
    - title: The text is the source of truth
      text: Only the video file is edited by hand. Everything generated is rebuilt from scratch, so the script always describes faithfully what is seen and heard.
    - title: Every stimulus has a reason
      text: A zoom, a sound or an appearance matches something said in the narration. There are no decorative effects, because an effect with no meaning distracts from the explanation.
    - title: Same script, same video
      text: Each frame depends only on time, not on randomness or earlier state. The result is reproducible, and a change in one scene does not alter the others.
challenge: >-
  Explaining a technical topic to someone who has never programmed, in 60 to 90 seconds, without the video turning into a sequence of text cards. And doing it with a tool that can repeat the same result every time.
approach:
  - The video is written as text. Shots, lines and scenes live in one file, and the rest is generated from it.
  - The narration is my voice, recorded with a microphone, with word-level timings so each animation lines up with what is said.
  - Each scene is a JavaScript module that draws with Canvas 2D on Skia. The figures shown on screen are calculated from the data being drawn.
  - Sound effects and the music bed are synthesized from the scene's events, so every sound matches something happening on screen.
  - Before delivery, automatic QA checks format, sound, text inside the safe zone, pacing and the loop ending.
  - A person reviews the pronunciation and the clarity of the explanation before publishing.
tradeoffs:
  - Human review before publishing. It is slower, but the engine cannot tell whether an explanation is clear to someone starting from zero.
  - Everything runs locally, with my own voice. I do not depend on cloud services, and in exchange each video takes the time to record by hand.
  - Scenes are programmed instead of using a video editor. Each animation needs code, but it can be tested, versioned and repeated.
  - Every term is explained inside the same video. The script gets longer, but each video makes sense on its own, without relying on earlier ones.
---

The videos are published on my official accounts:

- [YouTube](https://www.youtube.com/@daviddevgt)
- [TikTok](https://www.tiktok.com/@daviddevgt)
- [Instagram](https://www.instagram.com/daviddevgt/)
