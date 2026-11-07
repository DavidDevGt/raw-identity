import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultLang, getLangFromPath, isLang, swapLangInPath } from '../src/i18n/paths.ts';

test('English is the default language', () => {
	assert.equal(defaultLang, 'en');
});

test('isLang accepts only configured locales', () => {
	assert.equal(isLang('es'), true);
	assert.equal(isLang('en'), true);
	assert.equal(isLang('fr'), false);
	assert.equal(isLang(undefined), false);
});

test('getLangFromPath reads the locale prefix', () => {
	assert.equal(getLangFromPath('/es/work/a'), 'es');
	assert.equal(getLangFromPath('/en'), 'en');
	assert.equal(getLangFromPath('/work'), undefined);
	assert.equal(getLangFromPath('/'), undefined);
});

test('swapLangInPath keeps the rest of the route', () => {
	assert.equal(swapLangInPath('/es/work/a', 'en'), '/en/work/a');
	assert.equal(swapLangInPath('/en/', 'es'), '/es/');
	assert.equal(swapLangInPath('/es', 'en'), '/en');
});

test('swapLangInPath adds a prefix when the path has none', () => {
	assert.equal(swapLangInPath('/', 'en'), '/en/');
	assert.equal(swapLangInPath('/work', 'es'), '/es/work');
});
