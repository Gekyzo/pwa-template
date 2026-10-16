import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { RULES } from '../vendor/design-system/rules.js';

// The rules of the design system (docs/spec/04-design-system.md) over the files of the app.
const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const optional = (path) => (existsSync(new URL(path, root)) ? read(path) : '');

const files = {
  css: [read('vendor/design-system/design-system.css'), read('styles.css')],
  html: read('index.html'),
  scripts: readdirSync(new URL('src/ui/', root)).map((file) => [file, read(`src/ui/${file}`)]),
  sprite: optional('icons.svg'),
  page: optional('designs/page.js'),
  pageHtml: optional('designs/index.html'),
};

test('the rules read the shared stylesheet and styles.css', () => {
  // LAY-4 reads the body rule of the app only when there are two sheets.
  assert.equal(files.css.length, 2);
});

for (const rule of RULES) test(rule.title, () => assert.deepEqual(rule.check(files), []));
