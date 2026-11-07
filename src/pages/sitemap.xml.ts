import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getRelativeLocaleUrl } from 'astro:i18n';
import { locales } from '../i18n/paths';

export const GET: APIRoute = async ({ site }) => {
	const origin = site ?? new URL('http://localhost:4321');
	const entries = await getCollection('caseStudies', (e) => !e.data.draft);

	// Same paths the pages are built at: home and work list per language, then each case study.
	const paths = [
		...locales.flatMap((lang) => [getRelativeLocaleUrl(lang), getRelativeLocaleUrl(lang, 'work')]),
		...entries.map((e) => getRelativeLocaleUrl(e.data.lang, `work/${e.id.split('/').at(-1)}`)),
	];

	const urls = paths.map((path) => `  <url><loc>${new URL(path, origin).href}</loc></url>`).join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
};
