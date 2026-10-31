import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const finalizeScript = resolve('scripts/finalize-seo.mjs');
const source = readFileSync('src/index.html', 'utf8');

const run = ({ url, context }) => {
  const root = mkdtempSync(join(tmpdir(), 'cs-seo-'));
  const target = join(root, 'dist/cruza-sabedorias/browser');
  mkdirSync(target, { recursive: true });
  writeFileSync(join(target, 'index.html'), source);
  const env = { ...process.env };
  delete env.PUBLIC_SITE_URL;
  delete env.CONTEXT;
  if (url !== undefined) env.PUBLIC_SITE_URL = url;
  if (context !== undefined) env.CONTEXT = context;
  const result = spawnSync(process.execPath, [finalizeScript], { cwd: root, env, encoding: 'utf8' });
  const read = filename => readFileSync(join(target, filename), 'utf8');
  return { root, result, read };
};

test('local index allows Lighthouse to assess indexing', () => {
  assert.match(source, /<meta name="robots" content="index,follow">/);
  assert.match(source, /<meta name="description" content="[^"]+">/);
  assert.match(source, /<title>[^<]+<\/title>/);
});

test('unconfigured deployment is non-indexable and has no canonical or sitemap', () => {
  const fixture = run({});
  try {
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    assert.match(fixture.read('index.html'), /name="robots" content="noindex,nofollow"/);
    assert.doesNotMatch(fixture.read('index.html'), /rel="canonical"/);
    assert.match(fixture.read('robots.txt'), /Disallow: \/\n/);
  } finally { rmSync(fixture.root, { recursive: true, force: true }); }
});

test('official HTTPS production deploy has canonical, sitemap, social previews and service schema', () => {
  const fixture = run({ url: 'https://www.example.org', context: 'production' });
  try {
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    const html = fixture.read('index.html');
    assert.match(html, /name="robots" content="index,follow"/);
    assert.match(html, /rel="canonical" href="https:\/\/www\.example\.org\/"/);
    assert.match(html, /property="og:image" content="https:\/\/www\.example\.org\/brand-social\.png"/);
    assert.match(html, /name="twitter:image" content="https:\/\/www\.example\.org\/brand-social\.png"/);
    assert.match(fixture.read('robots.txt'), /Sitemap: https:\/\/www\.example\.org\/sitemap\.xml/);
    assert.match(fixture.read('sitemap.xml'), /<loc>https:\/\/www\.example\.org\/<\/loc>/);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s)?.[1]);
    const organization = schema['@graph'].find(item => item['@type'] === 'AccountingService');
    assert.equal(organization.logo, 'https://www.example.org/cruza-sabedorias-symbol-footer.png');
    assert.equal(organization.hasOfferCatalog.itemListElement.length, 6);
  } finally { rmSync(fixture.root, { recursive: true, force: true }); }
});

test('preview remains noindex even with production domain variable configured', () => {
  const fixture = run({ url: 'https://www.example.org', context: 'deploy-preview' });
  try {
    assert.equal(fixture.result.status, 0, fixture.result.stderr);
    assert.match(fixture.read('index.html'), /name="robots" content="noindex,nofollow"/);
    assert.doesNotMatch(fixture.read('index.html'), /rel="canonical"/);
    assert.match(fixture.read('robots.txt'), /Disallow: \/\n/);
  } finally { rmSync(fixture.root, { recursive: true, force: true }); }
});

test('rejects URLs with paths, query parameters or unencrypted HTTP', () => {
  for (const url of ['http://www.example.org', 'https://www.example.org/subdir', 'https://www.example.org/?x=1']) {
    const fixture = run({ url, context: 'production' });
    try {
      assert.notEqual(fixture.result.status, 0, url);
      assert.match(fixture.result.stderr, /PUBLIC_SITE_URL/);
    } finally { rmSync(fixture.root, { recursive: true, force: true }); }
  }
});
