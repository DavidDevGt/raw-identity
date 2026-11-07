# Sistema de diseño (neobrutalismo)

El sitio usa un sistema neobrutalista oscuro: fondo casi negro, bandas profundas a todo el ancho, bloques de color ácido, titulares enormes, bordes gruesos color hueso y sombras duras de color. El sitio tiene un solo tema, oscuro. Los tokens y las clases compartidas están en `src/styles/global.css`.

| Token | Valor | Uso |
|---|---|---|
| `--line` | `#08060f` | Negro violáceo: cabecera, líneas de los dibujos y texto sobre color |
| `--paper` | `#f5eedc` | Hueso: bordes, texto principal y guantes |
| `--ink` | `--paper` (`--line` en `.on-color`) | Bordes y texto |
| `--cast` | Según el tono | Color de la sombra dura. Una sombra negra desaparecería sobre este fondo |
| `--color-bg` / `--color-surface` | `#0d0a17` / `#171228` | Fondo de página y de bloques. Cada tono los redefine |
| `--color-lemon` | `#e6ff2e` | Marca, cinta, tarjetas, correo, nombre del pie |
| `--color-pink` | `#ff5ca8` | Etiquetas de sección, segunda cinta, zapatos |
| `--color-aqua` | `#14e0c0` | Botón principal, hover del correo, sombras de la banda petróleo |
| `--color-violet` | `#a084ff` | Sombras sobre el fondo de página, estrella de contacto |
| `--color-purple` | `#7a3ff2` | Cuerpo de la consola (`handheld`). Solo para dibujo, no para fondos con texto |
| `--on-color` | `--line` | Texto sobre cualquier bloque de color |
| `--border-width` | `4px` | Grosor de los bordes |
| `--shadow-sm` / `--shadow` / `--shadow-lg` | `4px` / `8px` / `14px` | Sombras sólidas en `--cast`, sin desenfoque |

| Fuente | Variable | Uso |
|---|---|---|
| Anton | `--font-head` | Titulares, cifras y nombre del pie. Tiene un solo peso: no le pongas `bold` |
| Bricolage Grotesque | `--font-body` | Texto y botones |
| Space Mono | `--font-label` | Metadatos y etiquetas pequeñas |

Reglas:

- **Bandas con tono.** `.tone-violet`, `.tone-teal`, `.tone-wine` y `.tone-ink` pintan una sección con un color profundo y definen su sombra (`--cast`) y su etiqueta (`--label-bg`). `.on-color` invierte la tinta para lo que va sobre un bloque claro. `.band` añade el relleno y las líneas hueso. `Section.astro` lo aplica con la prop `tone`.
- **Tokens derivados.** Si un ámbito cambia `--ink` o `--cast`, debe volver a declarar `--shadow*`, `--color-focus` y `--dot-color`. Ya está hecho para los tonos: al añadir uno, súmalo a ese selector de `global.css`.
- **Sin pasteles ni degradados visibles.** El texto sobre color siempre es `--on-color`, con más de 6:1 de contraste, y el texto hueso sobre las bandas supera 10:1. Las tramas (`.dots`, el damero del pie) usan cortes duros.
- **Clases compartidas.** `.neo` da borde y sombra; `.btn` es el botón con efecto de presión; `.cards` numera, inclina y colorea las tarjetas; `.label-title` es el título de sección; `.tag` es la etiqueta de metadatos.
- **Elenco de personajes.** `Mascot.astro` dibuja cinco personajes originales con la prop `name`: `window` (por defecto), `server`, `magnifier`, `handheld` y `cloud`. Ellos y la estrella (`StarBurst.astro`) son decorativos: `aria-hidden`, sin significado. Cada uno tiene extremidades de su propio material: pistas de circuito (`window`), cables de poder trenzados en una torre gamer (`server`) y cables de consola en espiral (`handheld`); `magnifier` y `cloud` no tienen extremidades. Todos tienen una animación continua y otra propia al pasar el mouse, ambas solo con CSS y desactivadas con `prefers-reduced-motion`. Las extremidades finas y la sombra del cuerpo usan `--limb` y `--drop`, así que se leen sobre fondo oscuro; dentro de un `.sticker` pasan a líneas oscuras.
- **Estilos entre componentes.** Astro limita el CSS al componente, así que una clase de la página no llega al SVG de un hijo. Para colocar una estrella, envuélvela en un elemento de la página.
- **Movimiento ligado al scroll.** La cinta, los rayos, la estrella, las extremidades y el parallax se mueven con `animation-timeline`: nada se mueve si el usuario no se desplaza, no hace falta control de pausa (WCAG 2.2.2) y no cuesta JavaScript. Sin soporte del navegador o con `prefers-reduced-motion`, quedan estáticos.
- **Parallax por profundidad.** `Section.astro` acepta `slot="scene"`, una capa decorativa detrás del contenido, y siempre pone detrás su título enorme y hueco (`.ghost`). Las capas se ordenan respecto al contenido, que no se mueve por su cuenta: `.px-far` y `.px-back` van contra el scroll y se quedan atrás; `.px-mid`, `.px-near` y `.px-front` lo adelantan y se ven cerca. El recorrido es una fracción de la altura de la pantalla (`--depth`) y se reduce en móvil. Las formas lejanas además se atenúan. `--drift` añade recorrido lateral, `--tilt` giro con el scroll y `--r` la inclinación de reposo (no uses `rotate` directamente en una capa). `.px-run` cruza en horizontal y `.px-rise` sube desde detrás de su contenedor y se queda ahí. `.shape-ring`, `.shape-block`, `.shape-stripes` y `.shape-checker` son las formas de fondo; mantenlas lejos del texto. No uses `overflow: hidden` en un ancestro porque rompe `view()`: usa `overflow: clip`.
- **Entradas y salida.** `.slap` lanza un bloque a la página y lo deja plano; lo ajustan `--slap-x`, `--slap-y`, `--slap-r` y `--slap-end`. Solo desplaza, nunca oculta el texto, y termina antes de que se lea. Las tarjetas y los títulos de sección ya lo usan. Al salir, el héroe se hunde más despacio que la página y sus líneas se separan (`--hero`).
- **Enlaces accesibles.** El texto del enlace es tinta y el subrayado es de color, así que no depende de azul de bajo contraste.

Textos ligados al diseño, en `src/i18n/ui.ts`: `hero.title` es una lista de líneas donde `mark` resalta una línea; `exp.items` son áreas con detalle y stack, sin nombres de empleadores a propósito. El `font-size` de `.wordmark` en `Footer.astro` y el de `.mail` en el inicio están ajustados a la longitud del nombre y del correo actuales.

Para cambiar la paleta, edita los tokens de `:root` y los bloques `.tone-*` en `global.css`.
