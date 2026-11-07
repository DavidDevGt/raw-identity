// @ts-check
import { existsSync } from 'node:fs';
import { defineConfig, envField, fontProviders } from 'astro/config';

// The config is evaluated before Astro loads .env, so read it here (Node 22+ has loadEnvFile).
// Variables already set in the environment (CI, hosting) take precedence over the file.
if (existsSync('.env')) process.loadEnvFile('.env');

// https://astro.build/config
export default defineConfig({
	// Set SITE_URL in your hosting provider, CI, or .env (see .env.example).
	site: process.env.SITE_URL ?? 'https://davidwebgt.com',

	// Output is static by default. Add an adapter only when a page needs server rendering.
	output: 'static',

	i18n: {
		defaultLocale: 'en',
		locales: ['es', 'en'],
		routing: {
			prefixDefaultLocale: true,
		},
	},

	// Self-hosted font, preloaded and with a metric-matched fallback to limit CLS.
	fonts: [
		// Headings. A condensed face lets long Spanish words run huge, even on a phone.
		{
			provider: fontProviders.fontsource(),
			name: 'Anton',
			cssVariable: '--font-display',
			weights: [400],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['Impact', 'sans-serif'],
		},
		// Body and buttons.
		{
			provider: fontProviders.fontsource(),
			name: 'Bricolage Grotesque',
			cssVariable: '--font-sans',
			weights: [400, 500, 700, 800],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		// Metadata labels.
		{
			provider: fontProviders.fontsource(),
			name: 'Space Mono',
			cssVariable: '--font-mono',
			weights: [700],
			styles: ['normal'],
			subsets: ['latin'],
			fallbacks: ['monospace'],
		},
	],

	security: {
		csp: true,
	},

	// The client router keeps the CSP of the first page loaded, which only allows the inline code of that
	// page, so navigating to another one would lose its styles. External files are allowed on every page.
	build: {
		inlineStylesheets: 'never',
	},
	vite: {
		build: {
			assetsInlineLimit: 0,
		},
	},

	// Shiki emits inline styles, which the CSP above blocks. Prism is CSP-compatible.
	markdown: {
		syntaxHighlight: 'prism',
	},

	env: {
		schema: {
			// Optional: an endpoint that receives Core Web Vitals beacons from real users.
			PUBLIC_VITALS_ENDPOINT: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
			}),
		},
	},
});
