---
title: KurAI.tech
summary: 14 AI agents working as a software team, from business goal to Pull Request, with local models on Ollama and a single 16 GB GPU.
lang: en
year: 2026
order: 1
stack: [Python, LangGraph, FastAPI, Ollama, PostgreSQL, Redis, Qdrant, Docker, Gitea, Astro]
highlights:
  - value: '14'
    label: AI agents
  - value: 16 GB
    label: On a single GPU
shots:
  - src: ../../../assets/projects/kuraitech-dashboard.webp
    alt: The KurAI.tech console showing its operations center, with 11 agents, 3 models, the iterative methodology, delivery to Gitea and the sprint pipeline from CEO to Frontend.
    caption: The operations center
  - src: ../../../assets/projects/kuraitech-monitor.webp
    alt: The KurAI.tech sprint monitor with a demo ticket, showing the six stages from Brief to Delivery and landing page sections with their build, overflow, accessibility, link and metadata gates.
    caption: The monitor, with demo data
seen: >-
  You give it a business goal and a whole team gets to work. A CEO sets the direction, a Tech Lead cuts the work into pieces, the developers write the tests first and a DevOps agent opens the Pull Request with the code, tests, migrations and rollback plan. The video tells the story in a minute, and the console is where I follow each sprint.
architecture:
  intro: >-
    The system builds one vertical slice at a time and integrates it into a trunk that must always stay green. What matters most to me here is that every result can be measured, and that nothing a model generates is taken as good without checking it.
  layers:
    - name: Console and API
      tech: FastAPI
      detail: Starts sprints, protects the API with a key and shows sections, gates, screenshots and results as the graph moves along.
    - name: SprintWorkflow
      tech: LangGraph
      detail: Runs, resumes and reports each sprint. Nodes, routing decisions and shared state live in separate modules.
    - name: Graph profiles
      tech: landing · general
      detail: Each profile is a different topology over the same pieces, so a new flow doesn't mean rewriting the orchestrator.
  services:
    - name: Ollama
      role: The models, running locally
    - name: Docker
      role: Sandbox and quality gates
    - name: PostgreSQL
      role: Tasks, audit trail and checkpoints
    - name: Qdrant
      role: Agent memory
    - name: Gitea
      role: Repository and Pull Request
  profiles:
    - name: Landing profile
      note: Where the product is heading, and still in development. It's designed to build a landing page section by section and measure each one with real gates. It hasn't completed a real sprint yet.
      steps:
        - Brief
        - CEO and PM
        - Copy and design
        - Section plan
        - Frontend and gates
        - Merge to trunk
        - Final gates and PR
    - name: General profile
      note: The original pipeline, with backend, frontend and pytest. Each slice starts with its tests and only joins the trunk if the build and QA come back green.
      steps:
        - Goal
        - CEO and PM
        - CTO and Architect
        - Tech Lead
        - Tests, backend and frontend
        - Integration and QA
        - DevOps and PR
  decisions:
    - title: One model at a time in 16 GB
      text: The models don't fit in the GPU together, so the agents take turns. Each one loads its model, uses it and unloads it with keep_alive at 0. Reasoning roles use ministral-3:14b, at 9 GB, and coding roles use devstral-small-2, at 15 GB. Memory uses nomic-embed-text for embeddings.
    - title: Gates that really measure
      text: In the landing profile, each section is built and opened in Chromium with external requests blocked. It's checked with screenshots at 320, 768 and 1280 px, axe, overflow, links and metadata, and Lighthouse joins at the end. Whatever blocks goes back to the Frontend agent as specific feedback.
    - title: Everything a model generates is untrusted
      text: Paths are validated, and code runs in a container with no root, no capabilities, resource limits and no platform credentials. It can't reach the databases' network either. Previews are served with an opaque origin, so they can't touch the API.
    - title: People in the loop
      text: When retries run out, the graph stops with interrupt() and its state is saved in PostgreSQL. A person decides whether to approve, retry or abort, and the sprint picks up right where it left off.
    - title: Deterministic where possible
      text: In the landing profile, copy and design arrive as JSON, with one corrective retry and a fallback if they fail. Design tokens become CSS through ordinary code, without going back to the model.
    - title: Success means an open Pull Request
      text: A sprint only counts as successful in the DORA metrics if it really opened a PR. If it's paused waiting for a person, it isn't reported until it ends.
    - title: Every piece of data in its place
      text: PostgreSQL keeps tasks, audit trail, reports and checkpoints. Qdrant keeps semantic memory only, with no reports or screenshots, so agents remember what's useful and not everything.
challenge: >-
  Asking a model to generate a whole project in one go leaves little room to correct course. I wanted something closer to a real team, with roles, small deliveries and real tests. And I wanted it on my own machine, with a single 16 GB GPU, where the models don't fit together and every decision counts.
approach:
  - LangGraph coordinates 14 specialized agents. That's 11 in the general profile, from CEO to DevOps, and 3 more in landing, which are Copywriter, Designer and an optional Visual Critic.
  - Everything runs locally on Ollama, on a single 16 GB GPU, with no outside API to depend on.
  - Each slice follows TDD and goes through a real build before joining the trunk.
  - Retries have a budget, and in the general profile agents get a diagnosis of recurring failures.
  - The result is a real repository on Gitea, with a Pull Request to review it.
tradeoffs:
  - Local models instead of a cloud API. The 16 GB limits which models I can use and means loading them in turns. In return, the code doesn't go out to any model provider and costs stay predictable.
  - Context versus speed. A wide context keeps Ollama from truncating prompts, but it makes each call slower, and with it the largest coding model no longer fits entirely in the GPU, so part of it runs on the CPU. It's a balance I'm still tuning.
  - Iterate instead of generating everything at once. It takes more steps, but each piece arrives tested before the next one starts.
  - A person steps in after three retries. The system is less autonomous, but it doesn't keep circling a problem it can't solve.
  - Observe before automating. The metrics and recommendations exist, but they don't change the configuration on their own yet. That way every adjustment still has a reason I can review.
---
