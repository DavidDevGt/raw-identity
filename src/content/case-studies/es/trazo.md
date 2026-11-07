---
title: TRAZO
summary: Un pipeline local que convierte un archivo de texto en un video vertical de un minuto para explicar conceptos técnicos, con narración, animación programada y control de calidad automático.
lang: es
year: 2026
order: 2
stack: [Node.js, Python, skia-canvas, FFmpeg, Kokoro, YAML, JSON Schema]
highlights:
  - value: YAML
    label: Un archivo por video
  - value: 1080×1920
    label: Vertical, a 30 fps
wideShots: true
cover: ../../../assets/projects/trazo-render.png
coverAlt: "Pantalla de render de TRAZO con la vista previa del video, los botones para descargar el MP4 y el SRT, y la lista de comprobaciones de la QA con sus fotogramas clave."
shots:
  - src: ../../../assets/projects/trazo-yaml.png
    alt: Editor de un video en la interfaz de TRAZO. Muestra el archivo YAML con el título, la idea, las tomas y sus frases, y a la derecha el panel de validación.
    caption: 1. El guion es un archivo de texto
  - src: ../../../assets/projects/trazo-inventario.png
    alt: Inventario de escenas de TRAZO, con búsqueda, filtros por tema y una tarjeta por escena con su descripción y una vista previa.
    caption: 2. Un inventario de escenas reutilizables
  - src: ../../../assets/projects/trazo-fotogramas.png
    alt: Banco de pruebas de TRAZO con los fotogramas clave de cada escena y su instante, para revisar la animación antes del render completo.
    caption: 3. Fotogramas clave antes del render
  - src: ../../../assets/projects/trazo-render.png
    alt: Pantalla de render de TRAZO con la vista previa del video, los botones para descargar el MP4 y el SRT, y la lista de comprobaciones de la QA con sus fotogramas clave.
    caption: 4. Render y control de calidad
seen: >-
  Un video corto que explica un concepto técnico con animación, mi voz y subtítulos, pensado para alguien que nunca programó. Los publico en YouTube, TikTok e Instagram.
architecture:
  intro: >-
    Un video es un archivo de texto con sus tomas, sus frases y sus escenas. Todo lo demás se genera a partir de ese archivo, así que una frase cambiada se refleja en la narración y en la animación sin tocar nada más.
  layers:
    - name: Guion y storyboard
      tech: YAML
      detail: Cada video vive en un archivo con sus tomas, frases, escenas y parámetros. Un esquema JSON valida la estructura antes de gastar tiempo en renderizar.
    - name: Narración
      tech: Mi micrófono y Kokoro
      detail: Grabo la narración con mi micrófono y el pipeline la alinea palabra por palabra con la animación. Kokoro también puede generar una voz con esos mismos tiempos.
    - name: Motor de escenas
      tech: Node.js y skia-canvas
      detail: Dibuja cada fotograma de 1080×1920 a 30 fps como una función pura del tiempo. Por eso cada escena se puede probar y repetir.
    - name: Audio y montaje
      tech: FFmpeg
      detail: Mezcla la voz con efectos y una base musical sintetizados a partir de los eventos de la escena, normaliza el volumen y exporta el MP4 y los subtítulos.
    - name: Control de calidad
      tech: Python
      detail: Revisa el formato, el sonido, el texto dentro de la zona segura, el ritmo y el cierre en bucle. Marca fallos y avisos antes de que una persona revise el video.
  services:
    - name: Kokoro
      role: Voz generada en local, como alternativa a mi grabación
    - name: skia-canvas
      role: Rasterizado 2D de cada fotograma
    - name: FFmpeg
      role: Codificación, mezcla y subtítulos
    - name: Interfaz local
      role: Un panel en el navegador que ejecuta los mismos comandos del pipeline
  decisions:
    - title: El texto es la fuente de verdad
      text: Solo el archivo del video se edita a mano. Lo que se genera se reconstruye desde cero, así que el guion siempre describe fielmente lo que se ve y se escucha.
    - title: Cada estímulo tiene un motivo
      text: Un zoom, un sonido o una aparición corresponde a algo que se dice en la narración. No hay efectos de adorno, porque un efecto sin significado distrae de la explicación.
    - title: Mismo guion, mismo video
      text: Cada fotograma depende solo del tiempo y no del azar ni del estado anterior. Así el resultado es reproducible y un cambio en una escena no altera las demás.
challenge: >-
  Explicar un tema técnico a alguien que nunca programó, en 60 a 90 segundos, sin que el video se convierta en una secuencia de tarjetas de texto. Y hacerlo con una herramienta que pueda repetir el mismo resultado cada vez.
approach:
  - El video se escribe como texto. Las tomas, las frases y las escenas viven en un archivo, y el resto se genera a partir de él.
  - La narración es mi voz, grabada con micrófono, con tiempos por palabra para sincronizar cada animación con lo que se dice.
  - Cada escena es un módulo en JavaScript que dibuja con Canvas 2D sobre Skia. Las cifras que aparecen en pantalla se calculan a partir de los datos que se dibujan.
  - Los efectos de sonido y la base musical se sintetizan desde los eventos de la escena, así que cada sonido corresponde a algo que pasa en pantalla.
  - Antes de entregar, una QA automática revisa formato, sonido, texto dentro de la zona segura, ritmo y cierre en bucle.
  - Una persona revisa la pronunciación y la claridad de la explicación antes de publicar.
tradeoffs:
  - Revisión humana antes de publicar. Es más lento, pero el motor no puede saber si una explicación es clara para alguien que empieza desde cero.
  - Todo local y con mi propia voz. No dependo de servicios en la nube, y a cambio cada video lleva el tiempo de grabarlo a mano.
  - Escenas programadas en lugar de un editor de video. Cada animación requiere código, pero se puede probar, versionar y repetir.
  - Cada término se explica dentro del mismo video. El guion se alarga, pero cada video se entiende solo, sin depender de los anteriores.
---

Los videos se publican en mis cuentas oficiales:

- [YouTube](https://www.youtube.com/@daviddevgt)
- [TikTok](https://www.tiktok.com/@daviddevgt)
- [Instagram](https://www.instagram.com/daviddevgt/)
