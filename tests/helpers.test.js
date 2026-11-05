import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accepts } from '../src/runtime/dropzone.js';
import { numberFormat } from '../src/runtime/number-format.js';

test('accepts matches extensions, MIME types and wildcards', () => {
	const csv = /** @type {File} */ ({ name: 'Statement.CSV', type: 'text/csv' });
	const png = /** @type {File} */ ({ name: 'logo.png', type: 'image/png' });
	assert.ok(accepts(csv, ''));
	assert.ok(accepts(csv, '.pdf, .csv'));
	assert.ok(accepts(csv, 'text/csv'));
	assert.ok(accepts(png, 'image/*'));
	assert.ok(!accepts(png, '.csv,application/pdf'));
});

test('numberFormat writes numbers in the given style', () => {
	assert.equal(numberFormat({ locale: 'en-GB' })(12840), '12,840');
	assert.equal(numberFormat({ locale: 'en-GB', currency: 'GBP', decimals: 0 })(4800), '£4,800');
	assert.equal(numberFormat({ locale: 'en-GB', currency: 'GBP', compact: true })(2400000), '£2.4m');
	assert.equal(numberFormat({ locale: 'de-DE', decimals: 2 })(99.5), '99,50');
});

test('stableId is the same on every build: a hash of what it shows, counted per page', async () => {
	const { stableId, shortHash } = await import('../src/components/uid.js');
	assert.equal(shortHash('npm i my-lib'), shortHash('npm i my-lib'));
	assert.notEqual(shortHash('npm i my-lib'), shortHash('pnpm add my-lib'));
	assert.match(shortHash(''), /^[a-z\d]{1,7}$/);
	const page = {};
	const groups = [{ options: [{ label: 'npm', command: 'npm i my-lib' }] }];
	const first = stableId('ui-install', page, groups);
	assert.equal(first, `ui-install-${shortHash(JSON.stringify(groups))}`);
	assert.equal(stableId('ui-install', page, groups), `${first}-2`, 'a second alike on the page');
	assert.notEqual(stableId('ui-install', page, [{ options: [] }]), first, 'different options, a different id');
	assert.equal(stableId('ui-install', {}, groups), first, 'a new page counts afresh');
	assert.equal(stableId('ui-faq', {}, undefined), `ui-faq-${shortHash('')}`);
});
