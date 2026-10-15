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
