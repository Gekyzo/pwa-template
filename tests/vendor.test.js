import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

// The copy of pwa-design-system in vendor/design-system/, written by `npm run ds` (DSV-1 to DSV-3).
const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const VENDOR = 'vendor/design-system/';
const vendored = existsSync(new URL(VENDOR, root));
const source = vendored ? JSON.parse(read(`${VENDOR}SOURCE.json`)) : { files: {} };
const sheets = vendored ? readdirSync(new URL(VENDOR, root)).filter((file) => file.endsWith('.css')) : [];

test('vendor/design-system/ has SOURCE.json with the version, the commit and the files', () => {
  assert.ok(vendored, 'run npm run ds');
  assert.match(source.version ?? '', /^\d+\.\d+\.\d+$/);
  assert.match(source.commit ?? '', /^[0-9a-f]{40}$/);
  assert.deepEqual(Object.keys(source.files).sort(), ['catalog.js', 'design-system.css', 'rules.js']);
});

test('each vendored file has the sha256 of SOURCE.json', () => {
  for (const [file, hash] of Object.entries(source.files)) {
    const actual = createHash('sha256').update(readFileSync(new URL(`${VENDOR}${file}`, root))).digest('hex');
    assert.equal(actual, hash, `${VENDOR}${file} changed after npm run ds`);
  }
});

test('SHELL of sw.js has each vendored stylesheet', () => {
  const sw = read('sw.js');
  assert.ok(sheets.length > 0);
  for (const file of sheets) assert.ok(sw.includes(`'./${VENDOR}${file}'`), file);
});

test('index.html links the shared stylesheet before styles.css', () => {
  const links = [...read('index.html').matchAll(/<link rel="stylesheet" href="\.\/([^"]+)">/g)].map(([, href]) => href);
  assert.deepEqual(links, [`${VENDOR}design-system.css`, 'styles.css']);
});

// The comments of `css` that open a part: `@component name` or `Overrides name of the design system.`
const markersOf = (css) =>
  [...css.matchAll(/\/\*[\s\S]*?\*\//g)]
    .map(({ 0: text, index }) => ({ text, line: css.slice(0, index).split('\n').length }))
    .filter(({ text }) => /@component\s|Overrides [\w-]+ of the design system/.test(text));

test('a rule of styles.css with a shared selector follows an Overrides comment', async () => {
  const { rulesOf } = await import(`../${VENDOR}catalog.js`);
  const app = read('styles.css');
  const own = (rule) => ['components', 'layouts'].includes(rule.layer) && !rule.keyframe;
  const shared = new Set(rulesOf(read(`${VENDOR}design-system.css`)).filter(own).map((rule) => rule.selector));
  const markers = markersOf(app);
  const copies = rulesOf(app)
    .filter((rule) => own(rule) && shared.has(rule.selector))
    .filter((rule) => !/Overrides/.test(markers.filter((marker) => marker.line < rule.line).at(-1)?.text ?? ''))
    .map((rule) => `${rule.line}: ${rule.selector}`);
  assert.deepEqual(copies, []);
});
