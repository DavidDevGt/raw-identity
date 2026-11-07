// Pure helpers for locale-aware paths. No Astro imports, so they can be unit tested with `node --test`.

export const locales = ['es', 'en'] as const;
export type Lang = (typeof locales)[number];
// Keep in sync with i18n.defaultLocale in astro.config.mjs.
export const defaultLang: Lang = 'en';

export function isLang(value: string | undefined): value is Lang {
	return value !== undefined && (locales as readonly string[]).includes(value);
}

/** Returns the language in a path such as `/en/work/slug`, or `undefined` when the path has none. */
export function getLangFromPath(pathname: string): Lang | undefined {
	const first = pathname.split('/')[1];
	return isLang(first) ? first : undefined;
}

/**
 * Returns the same route in another language.
 * `/es/work/a` → `/en/work/a`, `/work/a` → `/en/work/a`, `/` → `/en/`.
 */
export function swapLangInPath(pathname: string, target: Lang): string {
	const segments = pathname.split('/');
	if (isLang(segments[1])) {
		segments[1] = target;
	} else {
		segments.splice(1, 0, target);
	}
	return segments.join('/');
}
