# Portafolio de David Vargas

Portafolio de David Vargas, Software Engineer (backend, QA Automation e infraestructura). Es un sitio estático en español e inglés con casos de estudio de proyectos reales, hecho con Astro 7 y con presupuestos de rendimiento y accesibilidad que el CI hace cumplir.

**Stack:** Astro 7 · TypeScript estricto · CSS propio, sin framework · Content Collections con Zod · Lighthouse CI

## Inicio rápido

Requiere Node 22.23.4 o superior y pnpm 11. Con [Corepack](https://nodejs.org/api/corepack.html) activado (`corepack enable`), se usa la versión de pnpm fijada en `package.json`.

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

## Qué incluye

| Área | Implementación |
|---|---|
| Accesibilidad | Skip link, `:focus-visible` visible, contraste AA en los tokens, `prefers-reduced-motion`, un `h1` por página y niveles de encabezado ordenados |
| i18n | Enrutado nativo de Astro (`/en/…`, `/es/…`), `/` redirige a inglés (el idioma por defecto), `lang` correcto por página, `hreflang` con `x-default`, selector de idioma que conserva la ruta |
| Proyectos | Content collection con esquema Zod: stack, métricas, enlace, reto, cómo se construyó y trade-offs. Las secciones sin datos no se muestran |
| Rendimiento | JS mínimo: `ClientRouter` para las transiciones, el reproductor de video y las métricas. Fuentes autoalojadas, precargadas las de titular y texto, con fallback métrico |
| Métricas de campo | `web-vitals` (LCP, INP, CLS) enviado a un endpoint opcional con `sendBeacon` |
| Seguridad | Content Security Policy generada por Astro (`security.csp`) y cabeceras HTTP en `public/_headers` |
| SEO | Canonical, Open Graph, sitemap y `robots.txt` generados desde `site` |
| Calidad | Typecheck, tests unitarios, build y Lighthouse CI con presupuestos que fallan el job |

## Comandos

| Comando | Acción |
|---|---|
| `pnpm dev` | Servidor local en `localhost:4321` |
| `pnpm build` | Genera `dist/` (sitio estático) |
| `pnpm preview` | Sirve el build localmente |
| `pnpm typecheck` | Comprueba los tipos, incluidos los componentes `.astro` |
| `pnpm test` | Tests unitarios de rutas de idioma y del estado del reproductor |
| `pnpm lighthouse` | Lighthouse CI sobre `dist/` (requiere Chrome y un build previo) |
| `pnpm verify` | Typecheck, tests, build y Lighthouse, en el mismo orden que el CI |

No uses `pnpm ci` para esto: es un comando integrado de pnpm que reinstala desde cero.

## Estructura

```text
/
├── .github/                      CI y actualizaciones de Dependabot
├── astro.config.mjs              i18n, fuentes, CSP, variables de entorno tipadas
├── lighthouserc.json             Presupuestos de rendimiento y accesibilidad
├── docs/                         Decisiones de arquitectura y sistema de diseño
├── public/                       Archivos estáticos, videos y cabeceras HTTP
├── src/
│   ├── content.config.ts         Esquema de los proyectos
│   ├── content/case-studies/     Proyectos en es/ y en/
│   ├── components/               Header, Footer, SEO, Section, CaseStudyCard…
│   ├── data/videos.ts            Catálogo de videos
│   ├── i18n/
│   │   ├── paths.ts              Lógica pura de idioma y rutas (testeable)
│   │   └── ui.ts                 Textos en es y en; `en` está tipado contra `es`
│   ├── layouts/BaseLayout.astro  Documento, ClientRouter, fuente y métricas
│   ├── pages/
│   │   ├── [lang]/index.astro    Inicio
│   │   ├── [lang]/work/          Lista y caso de estudio
│   │   └── 404.astro · sitemap.xml.ts · robots.txt.ts
│   ├── scripts/                  Reproductor de video y métricas de campo (cliente)
│   └── styles/global.css         Tokens de color (tema oscuro), foco, parallax
└── tests/                        Tests de rutas de idioma y del reproductor
```

## Configuración

Copia `.env.example` a `.env` o define las variables en tu proveedor de hosting:

- `SITE_URL`: origen canónico. Se usa en canonical, hreflang, sitemap y robots. Por defecto, `https://davidwebgt.com`.
- `PUBLIC_VITALS_ENDPOINT`: opcional. Si lo defines, `vitals.ts` envía LCP, INP y CLS de usuarios reales.

Las variables se leen en build time porque el sitio es estático. Cambiarlas exige volver a compilar.

## Despliegue

`pnpm build` genera un sitio estático en `dist/`, que sirve en cualquier hosting. `public/_headers` y `public/_redirects` los leen Cloudflare y Netlify; en otro proveedor, configura allí las mismas cabeceras y la redirección de `/`.

### Cloudflare (Workers con static assets)

El sitio se publica como un Worker sin script que sirve `dist/`. La configuración vive en `wrangler.jsonc`; el nombre (`raw-identity`) debe coincidir con el Worker del panel.

En el panel: **Workers & Pages → Create → Import a repository** y elige este repositorio.

| Ajuste | Valor |
| --- | --- |
| Production branch | `main` |
| Build command | `pnpm build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

Variables de entorno de build (Settings → Build → Variables and secrets):

| Variable | Valor | Para qué |
| --- | --- | --- |
| `SITE_URL` | `https://davidwebgt.com` | Canonical, hreflang, sitemap y robots. |
| `PUBLIC_VITALS_ENDPOINT` | opcional | Beacons de Core Web Vitals. |

Cloudflare detecta Node y pnpm desde `.nvmrc` y `packageManager`, así que no hace falta `NODE_VERSION` ni `PNPM_VERSION`. Después añade el dominio propio en **Domains & Routes**; `SITE_URL` debe ser ese dominio, no el `*.workers.dev`.

Notas:

- Sin `wrangler.jsonc`, `wrangler deploy` intenta autoconfigurar el proyecto (instala el adaptador de Astro y `wrangler`) y falla con pnpm. No lo quites.
- No añadas `wrangler` como dependencia: pnpm 11 bloquea sus scripts de instalación (`esbuild`, `workerd`) y rompe `pnpm install`. `npx` lo descarga solo al desplegar.
- `public/_headers` pone cabeceras de seguridad y caché, y marca `*.workers.dev`, `*.pages.dev` y las previews por rama con `X-Robots-Tag: noindex` para que solo se indexe el dominio propio.
- `public/_redirects` envía `/` a `/en/`. `404.html` atiende las rutas desconocidas.
- Límites de assets: 20 000 archivos por versión y 25 MiB por archivo. Hoy son unos 150 archivos y el mayor pesa 5,9 MiB; si añades videos más grandes, comprímelos o sírvelos desde R2.
- El CI de GitHub Actions (typecheck, tests, Lighthouse) corre aparte; Cloudflare solo compila y publica.
- Para probarlo en local: `pnpm build && npx wrangler dev`.

Antes de desplegar:

- Comprueba que `SITE_URL` sea el dominio donde publicas.
- Revisa que las métricas de los proyectos sigan vigentes.

## Cómo añadir un proyecto

1. Crea `src/content/case-studies/es/mi-proyecto.md` y su par en `en/` con el mismo nombre de archivo, para que el selector de idioma conserve la página.
2. Rellena el frontmatter. Solo `title`, `summary`, `lang` y `stack` son obligatorios.
3. Omite lo que no tengas: una sección vacía no se muestra. Si no hay `link`, el proyecto aparece como "Sin demo pública".
4. Guarda las capturas en `src/assets/projects/` y enlázalas en `shots`. La tarjeta usa la primera. Si el proyecto no tiene pantalla pública, describe su flujo en `pipeline`.
5. Añade `tradeoffs` cuando puedas.

El proyecto aparece en `/es/work/mi-proyecto/` y en la lista de trabajo. El inicio muestra los tres primeros según `order`.

## Cómo añadir un idioma

1. Añade el código en `locales` de `src/i18n/paths.ts` y en `i18n.locales` de `astro.config.mjs`.
2. Añade la entrada en `labels` de `LanguageSwitcher.astro`.
3. Añade todas las claves en `src/i18n/ui.ts`. `en` está tipado contra `es`, así que el compilador marca las que falten.
4. Crea la carpeta de casos y actualiza `z.enum` en `src/content.config.ts`.

## Decisiones

Lo que el sitio deja fuera a propósito, y cómo añadirlo sin romper la base:

- **GSAP y ScrollTrigger.** Van en `<script>` nativos, no en islas. Inicialízalos en `astro:page-load` y destrúyelos en `astro:before-swap` para que el scroll quede limpio entre navegaciones.
- **Three.js.** Una sola isla con carga diferida (`client:visible`) y tres niveles de calidad según GPU, memoria y `prefers-reduced-motion`: 3D completo, 3D reducido y un fallback 2D.
- **Adaptador de despliegue.** Si hace falta renderizado en servidor, añade el adaptador del proveedor.

## Documentación

- [Salida estática e islas (ADR 0001)](docs/adr/0001-static-output-and-islands.md)
- [Sistema de diseño](docs/design-system.md)

## Licencia

© David Vargas. Todos los derechos reservados. El código se publica para consulta; los textos, imágenes y videos son contenido personal y no se pueden reutilizar sin permiso.
