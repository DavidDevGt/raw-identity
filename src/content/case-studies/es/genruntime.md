---
title: GenRuntime
summary: Un estudio de video local para una sola GPU de 16 GB. Le das un JSON que describe el plano y te devuelve un clip que ya pasó control de calidad, con una persona que aprueba los keyframes antes de gastar GPU en el video.
lang: es
year: 2026
order: 5
stack: [Python, FLUX.2 klein, LTX-2.5, OWLv2, DINOv2, Whisper, Ollama, Docker, React Flow]
cover: ../../../assets/projects/genruntime-cover.webp
coverAlt: "Dos nodos de GenRuntime: la revisión de los keyframes de una espadachina anime, ya aprobada, y su toma en video con el QA aprobado y el diálogo que oyó Whisper."
wideShots: true
shots:
  - src: ../../../assets/projects/genruntime-pipeline.webp
    alt: Nodos de GenRuntime en orden. La spec pasa el linter, los keyframes de una espadachina anime se aprueban, la toma en video pasa el QA con el diálogo que oyó Whisper y el clip queda listo para descargar.
    caption: 1. Del spec al clip
  - src: ../../../assets/projects/genruntime-review.webp
    alt: Hoja de revisión con la referencia del personaje, el keyframe inicial, el final y una copia que marca en rojo lo que cambió en el escenario.
    caption: 2. La revisión antes del video
  - src: ../../../assets/projects/genruntime-graph.webp
    alt: Interfaz completa de StudioGraph, con los nodos de toma, personaje, keyframes, escenario, acción y audio conectados al flujo de render.
    caption: 3. El grafo completo
seen: >-
  Una toma real de principio a fin, con una espadachina caminando por un bosque de bambú. El grafo muestra la spec, los keyframes, la revisión, el video con su QA y el clip listo para descargar.
pipeline:
  - Spec en JSON
  - Linter
  - Keyframes con FLUX.2
  - Aprobación humana
  - Video con LTX-2.5
  - QA y clip final
architecture:
  intro: >-
    GenRuntime no es un solo programa. Son dos contenedores con dependencias que no pueden convivir, un host que los coordina y un estado en disco que permite retomar cada plano donde quedó. En una sola GPU de 16 GB cada corrida cuenta, así que el sistema evita repetir lo que no hace falta.
  layers:
    - name: Spec y linter
      tech: Python
      detail: Cada plano es un JSON. El linter bloquea fallas que ya conocemos, como el presupuesto de VRAM, los tiempos de diálogo, las manos, los fundidos y los saltos de cuadrúpedos, antes de tocar la GPU.
    - name: Keyframes
      tech: FLUX.2 klein
      detail: Genera candidatos por keyframe y los filtra con el conteo de personajes, invariantes de diseño, localización con OWLv2 y la cámara por geometría. Gana el candidato que menos cambia el fondo.
    - name: Revisión humana
      tech: Host
      detail: El pipeline se detiene en review.png hasta que alguien aprueba. La aprobación queda ligada al hash de la spec, así que no sirve para otra versión.
    - name: Video y audio
      tech: LTX-2.5 DFR
      detail: Renderiza el take con el stack de Lightricks en su propio contenedor. Cada corrida deja un registro con el comando, los tiempos y el pico real de VRAM.
    - name: Control de calidad
      tech: VLM, DINOv2, Whisper
      detail: Revisa contenido, cámara, parecido con los keyframes y diálogo. Un take se entrega solo si pasa todos los chequeos. Si falla, se reintenta con otra seed.
  services:
    - name: Docker
      role: Dos imágenes con dependencias aisladas
    - name: Ollama
      role: Modelo de visión para preguntas sobre un frame
    - name: OWLv2 y DINOv2
      role: Localizar personajes y medir similitud
    - name: Whisper
      role: Transcribe el diálogo para verificarlo
    - name: React Flow
      role: El grafo de la interfaz es la misma spec que consume el pipeline
  decisions:
    - title: Varios procesos, no uno
      text: Los dos contenedores fijan versiones incompatibles de torch y de los modelos. El host coordina y los contenedores hacen el trabajo de GPU, así que ninguna dependencia le pelea a otra.
    - title: El estado vive en disco
      text: output/studio/<nombre>/ guarda el avance. Repetir run continúa donde quedó, y si cambia la spec se borra solo lo que dependía de ella.
    - title: Reglas nacidas de fallas reales
      text: Cada regla del linter y cada umbral de QA responde a una falla que ocurrió, no a una intuición. Por eso los umbrales son concretos, como una similitud de 0.80 con los keyframes.
    - title: Medir antes de opinar
      text: Cada veredicto de QA se apoya en una medición, como la homografía del fondo con los sujetos enmascarados, la similitud DINOv2 o la transcripción de Whisper. El VLM solo responde preguntas simples sobre un frame.
    - title: Reintentar con criterio
      text: Un fallo de QA no siempre es mala suerte. El runner experimental clasifica cada falla, y vuelve a tirar la seed solo cuando la falla parece aleatoria, y aborta cuando el problema está en la spec.
challenge: >-
  Generar video en una sola GPU de 16 GB deja poco margen, y un plano malo suele notarse tarde, cuando el render ya gastó su tiempo. El reto fue llegar de una descripción a un clip confiable en mi propio equipo, con puntos de control antes de gastar GPU en video, y con un sistema que explique por qué falló lo que falló.
approach:
  - Cada plano empieza como un JSON que pasa por un linter antes de tocar la GPU.
  - FLUX.2 genera candidatos de keyframe y los filtra con visión por computadora. Los personajes se guardan como referencias para mantener su identidad entre planos.
  - Una persona aprueba los keyframes. Solo después el video se renderiza.
  - LTX-2.5 genera video y audio dentro de su propio contenedor, sin modificar su código.
  - El control de calidad combina modelos especializados. Cada uno mide una cosa, y el VLM solo responde preguntas simples sobre un frame.
  - Una interfaz de grafo muestra cada etapa. El grafo es la spec, así que lo que se dibuja se compila al mismo JSON que consume el pipeline.
  - El runner experimental para varios planos predice VRAM y tiempo, y clasifica las fallas para decidir si reintentar o abortar.
tradeoffs:
  - Una persona aprueba antes del video. Frena el flujo, pero evita gastar una corrida de video en keyframes que ya se ven mal.
  - Dos imágenes de Docker en vez de una. Hay más que mantener, pero las dependencias de cada parte entran en conflicto y así cada una conserva las suyas.
  - Todo en local en vez de una API en la nube. El límite de 16 GB condiciona cada elección de modelo, y a cambio no dependo de un proveedor.
  - El runner multi-plano es experimental. Ahorra GPU en lotes, pero todavía no es el flujo principal, así que no lo presento como tal.
---
