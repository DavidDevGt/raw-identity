---
title: KuraiMusik
summary: Una radio por internet que nunca se apaga. La IA genera la música y el sistema la mezcla y la transmite solo, las 24 horas, en varias estaciones y sin nadie en cabina.
lang: es
year: 2026
order: 4
stack: [Next.js, FastAPI, Celery, Redis, Liquidsoap, Icecast, ACE-Step, Docker, Prometheus]
link: https://music.kuraitachi.com/
shots:
  - src: ../../../assets/projects/kuraimusik-entry.webp
    alt: Portada de KuraiMusik, con el botón Enter Experience sobre un fondo oscuro.
    caption: 1. Entra
  - src: ../../../assets/projects/kuraimusik-mood.webp
    alt: Selector de moods de KuraiMusik, con Dubstep, Hacker Music y Jazz, sobre los controles de reproducción y volumen.
    caption: 2. Elige un mood y dale play
  - src: ../../../assets/projects/kuraimusik-player.webp
    alt: Reproductor de KuraiMusik sonando un tema de jazz generado con IA.
    caption: 3. Escucha
seen: >-
  Entra, elige una estación entre Dubstep, Hacker Music y Jazz, y escucha una transmisión continua como en una radio de verdad. No hay lista que armar: los temas se generan con IA, pasan de uno a otro con crossfade y el reproductor te muestra qué está sonando.
architecture:
  intro: >-
    Una radio no puede hacer pausa mientras un modelo termina de generar. Por eso separé lo que tarda de lo que tiene que sonar siempre: la música se genera en segundo plano y la emisión solo toma lo que ya está listo.
  layers:
    - name: Cliente web
      tech: Next.js
      detail: Vive en su propio repositorio. Elige la estación, reproduce el stream y recibe en tiempo real la canción actual y el estado del sistema.
    - name: Orquestador
      tech: FastAPI
      detail: Expone las estaciones, la canción en curso y la salud del sistema, y avisa de los cambios por WebSocket y Socket.IO.
    - name: Generación en segundo plano
      tech: Celery y Redis
      detail: Vigila el buffer de cada estación y encola temas nuevos cuando hacen falta, sin tocar la emisión.
    - name: Mezcla y emisión
      tech: Liquidsoap e Icecast
      detail: Liquidsoap mezcla las pistas con crossfade y normaliza el volumen, e Icecast distribuye el audio a quien esté escuchando.
  services:
    - name: ACE-Step
      role: Genera la música, como microservicio aparte
    - name: Redis
      role: Colas de trabajo
    - name: Liquidsoap
      role: Mezcla y control de ganancia
    - name: Icecast
      role: Streaming a los oyentes
    - name: Prometheus
      role: Métricas y salud del sistema
  decisions:
    - title: Una playlist que evoluciona
      text: Cada estación mantiene un buffer dinámico. Se generan temas nuevos de forma continua y los más antiguos salen para hacerles espacio, así que con el tiempo la programación cambia por completo en vez de repetir las mismas canciones en bucle.
    - title: Los fallos no llegan a los oídos
      text: Un circuit breaker protege al sistema cuando falla la API de generación, y la radio sigue sonando con lo que ya hay en el buffer. Su estado también llega al cliente, que puede avisar con un amable "estamos afinando la señal".
    - title: Que suene como una radio
      text: Las transiciones con crossfade y el control automático de ganancia evitan cortes y saltos de volumen entre temas generados por separado. Cada MP3 lleva además sus metadatos ID3.
    - title: Estaciones como configuración
      text: Cada estación se declara en un archivo YAML, con su punto de montaje, su nombre y sus prompts. Sumar una no requiere tocar el código del orquestador.
    - title: Un cliente que se entera al instante
      text: Los cambios de canción, las actualizaciones del buffer y el estado del circuit breaker se envían como eventos, para que la interfaz no tenga que estar preguntando.
challenge: >-
  Sostener una radio de música generada con IA todo el día, sin operador, de forma que un fallo puntual nunca llegue a los oídos de quien está escuchando. Generar un tema tarda, y una transmisión en vivo no puede esperar.
approach:
  - El backend y el motor de streaming viven en un repositorio, el cliente en Next.js en otro y ACE-Step corre como un servicio independiente.
  - Todo el backend se levanta con Docker Compose, incluidos Icecast y Liquidsoap.
  - El sistema expone sondas de salud, métricas de Prometheus y logs estructurados.
  - Tiene rate limiting para proteger la API de abusos.
  - Las pruebas cubren unidad, integración, smoke, contratos de API, resiliencia y carga con Locust.
tradeoffs:
  - Generar antes de transmitir. Generar por adelantado consume más recursos, pero quien escucha no depende del tiempo de inferencia del modelo.
  - Degradar en vez de caer. Si una pieza falla, el sistema la aísla y la radio sigue sonando.
  - Separar el generador de la radio. Hay más servicios que coordinar, pero el modelo puede fallar, reiniciarse o cambiar sin detener la emisión.
  - Usar Icecast y Liquidsoap en vez de un streaming propio. Dependo de sus formas de configurarse, y a cambio me apoyo en herramientas de radio ya probadas.
---
