import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rangeShare } from '../src/runtime/range.js';
import { nextFiles } from '../src/runtime/dropzone.js';
import { menuStep } from '../src/runtime/menu.js';
import { countState, hexValue, checkFiles, fileSize, fileTag, opensUp, typeAhead } from '../src/runtime/forms.js';

/**
 * A file, just enough of one for the checks: its name, type and size.
 *
 * @param {string} name Its name.
 * @param {string} type Its MIME type.
 * @param {number} [size=1000] Its size in bytes.
 * @returns {{ name: string, type: string, size: number }} The file.
 */
const file = (name, type, size = 1000) => ({ name, type, size });

test('rangeShare: how far along a slider is, with the browser defaults for a missing min or max', () => {
	assert.equal(rangeShare({ value: '96', min: '16', max: '256' }), 80 / 240);
	assert.equal(rangeShare({ value: '50', min: '', max: '' }), 0.5);
	assert.equal(rangeShare({ value: '0', min: '0', max: '5' }), 0);
	assert.equal(rangeShare({ value: '5', min: '0', max: '5' }), 1);
	assert.equal(rangeShare({ value: '3', min: '3', max: '3' }), 0, 'an empty range');
});

test('nextFiles: a single input takes the first; a multiple one adds or replaces', () => {
	assert.deepEqual(nextFiles(['a'], ['b', 'c'], { multiple: false, add: true }), ['b']);
	assert.deepEqual(nextFiles(['a'], ['b', 'c'], { multiple: true, add: true }), ['a', 'b', 'c']);
	assert.deepEqual(nextFiles(['a'], ['b', 'c'], { multiple: true }), ['b', 'c']);
	assert.deepEqual(nextFiles(['a', 'b'], [], { multiple: true }), [], 'removing the last');
});

test('menuStep without wrapping stops at the ends, as a listbox does', () => {
	assert.equal(menuStep(2, 'ArrowDown', 3, false), 2);
	assert.equal(menuStep(0, 'ArrowUp', 3, false), 0);
	assert.equal(menuStep(-1, 'ArrowDown', 3, false), 0);
	assert.equal(menuStep(-1, 'ArrowUp', 3, false), 2);
	assert.equal(menuStep(1, 'End', 3, false), 2);
	assert.equal(menuStep(1, 'Home', 3, false), 0);
	assert.equal(menuStep(-1, 'ArrowDown', 0, false), -1);
	assert.equal(menuStep(2, 'ArrowDown', 3), 0, 'wrapping is still the default');
});

test('countState: "n / max", near from 90% of the limit, over past it', () => {
	assert.deepEqual(countState(12, 60), { text: '12 / 60', near: false, over: false });
	assert.deepEqual(countState(54, 60), { text: '54 / 60', near: true, over: false });
	assert.deepEqual(countState(60, 60), { text: '60 / 60', near: true, over: false });
	assert.deepEqual(countState(61, 60), { text: '61 / 60', near: false, over: true });
	assert.deepEqual(countState(7, 0), { text: '7', near: false, over: false }, 'no limit');
});

test('hexValue reads a six-digit hex, with or without its #', () => {
	assert.equal(hexValue('#D4FF3A'), '#d4ff3a');
	assert.equal(hexValue(' 2e4bff '), '#2e4bff');
	assert.equal(hexValue('#fff'), null);
	assert.equal(hexValue('#d4ff3'), null);
	assert.equal(hexValue('blue'), null);
});

test('checkFiles: the type, the size and the count, too many first', () => {
	const files = [file('logo.png', 'image/png'), file('clip.mov', 'video/quicktime'), file('huge.jpg', 'image/jpeg', 11 * 1024 ** 2)];
	assert.deepEqual(checkFiles(files, { accept: 'image/*', maxMb: 10 }), {
		problems: ['', 'Not a file type this takes', 'Over 10 MB'],
		message: 'Not a file type this takes',
	});
	assert.equal(checkFiles(files, { accept: 'image/*', maxFiles: 2 }).message, 'Up to 2 files');
	assert.equal(checkFiles(files.slice(0, 2), { maxFiles: 1 }).message, 'Up to 1 file');
	assert.deepEqual(checkFiles(files), { problems: ['', '', ''], message: '' }, 'no rules, no problems');
	assert.deepEqual(checkFiles([]), { problems: [], message: '' });
});

test('fileSize and fileTag: a size in words, and the tag for a file without a preview', () => {
	assert.equal(fileSize(1536), '1.5 KB');
	assert.equal(fileSize(10 * 1024 ** 2), '10 MB');
	assert.equal(fileTag('trademark-registration.pdf'), 'pdf');
	assert.equal(fileTag('notes.markdown'), 'mark');
	assert.equal(fileTag('README'), 'READ');
});

test('opensUp: up only when it will not fit below and there is more room above', () => {
	assert.equal(opensUp(500, 100, 280), false);
	assert.equal(opensUp(200, 600, 280), true);
	assert.equal(opensUp(200, 600, 120), false, 'a short list fits');
	assert.equal(opensUp(100, 80, 280), false, 'less room above');
	assert.equal(opensUp(305, 600, 900), true, 'only 300px of a long list counts');
});

test('typeAhead: keys in quick succession build a word; a pause starts again', () => {
	assert.equal(typeAhead('', 'S', 0), 's');
	assert.equal(typeAhead('s', 'p', 120), 'sp');
	assert.equal(typeAhead('sp', 'G', 900), 'g');
});

test('the main entry exports the form kit, and it loads outside a browser', async () => {
	const ui = await import('../src/index.js');
	for (const name of ['forms', 'formRange', 'fieldCount', 'revealPassword', 'colorPair', 'fileDrop', 'dropdown', 'rangeFill', 'rangeShare', 'nextFiles', 'putFiles']) {
		assert.equal(typeof ui[name], 'function', name);
	}
	assert.doesNotThrow(() => ui.forms(), 'nothing to start without a document');
});
