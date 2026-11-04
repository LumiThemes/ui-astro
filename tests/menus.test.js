import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menuStep } from '../src/runtime/menu.js';
import { isCurrent } from '../src/runtime/mobile-menu.js';
import { parseColor, formatColor, inkFor } from '../src/runtime/color.js';

test('menuStep: the arrow keys wrap round, Home and End go to the ends', () => {
	assert.equal(menuStep(0, 'ArrowDown', 3), 1);
	assert.equal(menuStep(2, 'ArrowDown', 3), 0);
	assert.equal(menuStep(0, 'ArrowUp', 3), 2);
	assert.equal(menuStep(-1, 'ArrowDown', 3), 0);
	assert.equal(menuStep(-1, 'ArrowUp', 3), 2);
	assert.equal(menuStep(1, 'Home', 3), 0);
	assert.equal(menuStep(1, 'End', 3), 2);
	assert.equal(menuStep(1, 'Enter', 3), 1);
	assert.equal(menuStep(-1, 'ArrowDown', 0), -1);
});

test('isCurrent: the home page matches itself only; a section matches its pages', () => {
	assert.equal(isCurrent('/', '/'), true);
	assert.equal(isCurrent('/', '/about'), false);
	assert.equal(isCurrent('/blog', '/blog/'), true);
	assert.equal(isCurrent('/blog/', '/blog/a-post'), true);
	assert.equal(isCurrent('/blog', '/blogroll'), false);
	assert.equal(isCurrent('/pricing#custom', '/pricing'), true);
	assert.equal(isCurrent('https://example.com/docs?x=1', '/docs/start'), true);
	assert.equal(isCurrent('https://example.com', '/'), true);
	assert.equal(isCurrent('#releases', '/'), false);
	assert.equal(isCurrent('#releases', '#releases'), true);
});

test('parseColor reads hex and rgb(), and nothing else', () => {
	assert.deepEqual(parseColor('#D4FF3A'), { r: 212, g: 255, b: 58, a: 1 });
	assert.deepEqual(parseColor('#fff'), { r: 255, g: 255, b: 255, a: 1 });
	assert.deepEqual(parseColor('#00000080'), { r: 0, g: 0, b: 0, a: 0.502 });
	assert.deepEqual(parseColor('rgb(10, 20, 30)'), { r: 10, g: 20, b: 30, a: 1 });
	assert.deepEqual(parseColor('rgb(10 20 30 / 50%)'), { r: 10, g: 20, b: 30, a: 0.5 });
	assert.deepEqual(parseColor('rgba(100%, 0%, 0%, 0.25)'), { r: 255, g: 0, b: 0, a: 0.25 });
	assert.equal(parseColor('rebeccapurple'), null);
	assert.equal(parseColor('oklch(70% 0.1 200)'), null);
	assert.equal(parseColor('#12345'), null);
	assert.equal(parseColor('rgb(1 2)'), null);
});

test('formatColor writes hex, rgb() and hsl(), and leaves what it cannot read', () => {
	assert.equal(formatColor('#d4ff3a'), '#d4ff3a');
	assert.equal(formatColor('#d4ff3a', 'hex'), '#D4FF3A');
	assert.equal(formatColor('rgb(11, 11, 11)', 'hex'), '#0B0B0B');
	assert.equal(formatColor('#D4FF3A', 'rgb'), 'rgb(212 255 58)');
	assert.equal(formatColor('#D4FF3A', 'hsl'), 'hsl(73 100% 61%)');
	assert.equal(formatColor('#808080', 'hsl'), 'hsl(0 0% 50%)');
	assert.equal(formatColor('#ff0000', 'hsl'), 'hsl(0 100% 50%)');
	assert.equal(formatColor('#0000ff', 'hsl'), 'hsl(240 100% 50%)');
	assert.equal(formatColor('#ff000080', 'rgb'), 'rgb(255 0 0 / 0.5)');
	assert.equal(formatColor('#ff000080', 'hex'), '#FF000080');
	assert.equal(formatColor('var(--brand)', 'rgb'), 'var(--brand)');
});

test('inkFor picks the ink that reads best on a colour', () => {
	assert.equal(inkFor('#D4FF3A'), '#0b0b0b');
	assert.equal(inkFor('#0B0B0B'), '#ffffff');
	assert.equal(inkFor('#F4F3EF'), '#0b0b0b');
	assert.equal(inkFor('#2563eb'), '#ffffff');
	assert.equal(inkFor('#2563eb', '#000', '#eee'), '#eee');
	assert.equal(inkFor('teal'), null);
});

test('the main entry exports the new runtime, and loads outside a browser', async () => {
	const ui = await import('../src/index.js');
	for (const name of ['installCommand', 'mobileMenu', 'isCurrent', 'splitButton', 'copySwatch', 'popupMenu', 'menuStep', 'copyText', 'flash', 'parseColor', 'formatColor', 'inkFor']) {
		assert.equal(typeof ui[name], 'function', name);
	}
});
