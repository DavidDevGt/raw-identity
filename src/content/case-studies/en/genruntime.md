---
title: GenRuntime
summary: A local video studio for a single 16 GB GPU. You give it a JSON file describing the shot, and it gives you back a clip that has passed quality checks, with a person approving the keyframes before any GPU time goes into video.
lang: en
year: 2026
order: 5
stack: [Python, FLUX.2 klein, LTX-2.5, OWLv2, DINOv2, Whisper, Ollama, Docker, React Flow]
cover: ../../../assets/projects/genruntime-cover.webp
coverAlt: "Two GenRuntime nodes: the review of an anime swordswoman's keyframes, already approved, and her video take with QA passed and the dialogue Whisper heard."
wideShots: true
shots:
  - src: ../../../assets/projects/genruntime-pipeline.webp
    alt: GenRuntime nodes in order. The spec passes the linter, keyframes of an anime swordswoman get approved, the video take passes QA with the dialogue Whisper heard, and the clip is ready to download.
    caption: 1. From spec to clip
  - src: ../../../assets/projects/genruntime-review.webp
    alt: Review sheet with the character reference, the start keyframe, the end keyframe and a copy that marks in red what changed in the set.
    caption: 2. The review before video
  - src: ../../../assets/projects/genruntime-graph.webp
    alt: The full StudioGraph interface, with shot, character, keyframe, set, action and audio nodes wired into the render flow.
    caption: 3. The full graph
seen: >-
  A real shot from start to finish, with a swordswoman walking through a bamboo forest. The graph shows the spec, the keyframes, the review, the video with its QA and the clip ready to download.
pipeline:
  - JSON spec
  - Linter
  - FLUX.2 keyframes
  - Human approval
  - LTX-2.5 video
  - QA and final clip
architecture:
  intro: >-
    GenRuntime is not one program. It is two containers with dependencies that cannot share an environment, a host that coordinates them, and state on disk that lets every shot resume where it stopped. On a single 16 GB GPU every run counts, so the system avoids repeating work it does not need to repeat.
  layers:
    - name: Spec and linter
      tech: Python
      detail: Each shot is a JSON file. The linter blocks failures we already know about, such as the VRAM budget, dialogue timing, hands, fades and quadruped jumps, before the GPU is touched.
    - name: Keyframes
      tech: FLUX.2 klein
      detail: Generates candidates per keyframe and filters them by character count, design invariants, location with OWLv2 and camera from geometry. The candidate that changes the background least wins.
    - name: Human review
      tech: Host
      detail: The pipeline stops at review.png until someone approves. Approval is tied to the spec hash, so it does not carry over to another version.
    - name: Video and audio
      tech: LTX-2.5 DFR
      detail: Renders the take with Lightricks' stack, in its own container. Each run leaves a record with the command, the timings and the real VRAM peak.
    - name: Quality control
      tech: VLM, DINOv2, Whisper
      detail: Checks content, camera, likeness to the keyframes and dialogue. A take is delivered only if it passes every check. If it fails, it is retried with another seed.
  services:
    - name: Docker
      role: Two images with isolated dependencies
    - name: Ollama
      role: Vision model for questions about a frame
    - name: OWLv2 and DINOv2
      role: Locating characters and measuring similarity
    - name: Whisper
      role: Transcribes the dialogue to verify it
    - name: React Flow
      role: The interface graph is the same spec the pipeline consumes
  decisions:
    - title: Several processes, not one
      text: The two containers pin incompatible versions of torch and the models. The host coordinates and the containers do the GPU work, so no dependency fights another.
    - title: State lives on disk
      text: output/studio/<name>/ keeps the progress. Running it again continues where it stopped, and if the spec changes only what depended on it is cleared.
    - title: Rules born from real failures
      text: Every linter rule and every QA threshold answers a failure that actually happened, not a hunch. That is why the thresholds are concrete, such as a 0.80 similarity to the keyframes.
    - title: Measure before judging
      text: Every QA verdict rests on a measurement, such as the background homography with the subjects masked, the DINOv2 similarity or the Whisper transcript. The VLM only answers simple questions about one frame.
    - title: Retry with judgment
      text: A QA failure is not always bad luck. The experimental runner classifies each failure, and it rolls the seed again only when the failure looks random, and aborts when the problem is in the spec.
challenge: >-
  Generating video on a single 16 GB GPU leaves little room, and a bad shot tends to show up late, after the render has already used its time. The challenge was getting from a description to a reliable clip on my own machine, with checkpoints before GPU time goes into video, and with a system that can explain why a shot failed.
approach:
  - Each shot starts as a JSON file that passes through a linter before the GPU is touched.
  - FLUX.2 generates keyframe candidates and filters them with computer vision. Characters are kept as references so they stay the same across shots.
  - A person approves the keyframes. Only after that is the video rendered.
  - LTX-2.5 generates video and audio inside its own container, without changing its code.
  - Quality control combines specialized models. Each one measures a single thing, and the VLM only answers simple questions about one frame.
  - A graph interface shows every stage. The graph is the spec, so what is drawn compiles to the same JSON the pipeline consumes.
  - The experimental multi-shot runner predicts VRAM and time, and classifies failures to decide whether to retry or abort.
tradeoffs:
  - A person approves before video. It slows the flow, but it avoids spending a video run on keyframes that already look wrong.
  - Two Docker images instead of one. There is more to maintain, but the dependencies of each part conflict, so this way each keeps its own.
  - Fully local instead of a cloud API. The 16 GB limit shapes every model choice, and in exchange I do not depend on a provider.
  - The multi-shot runner is experimental. It saves GPU time in batches, but it is not the main flow yet, so I do not present it as one.
---
