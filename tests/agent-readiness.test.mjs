import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');

test('sitemap is valid enough for the single-page site', async () => {
  const sitemap = await read('sitemap.xml');
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(sitemap, /<loc>https:\/\/cripplecreekkoa\.com\/<\/loc>/);
  assert.match(sitemap, /<lastmod>2026-09-18<\/lastmod>/);
});

test('llms guide includes agent use cases and recovery links', async () => {
  const llms = await read('llms.txt');
  assert.match(llms, /^# Cripple Creek KOA Holiday/m);
  assert.match(llms, /^## When to use this site/m);
  assert.match(llms, /sitemap\.xml/);
  assert.match(llms, /official KOA listing/);
  assert.match(llms, /Do not infer availability or pricing/);
});

test('404 page gives agents and people useful next links', async () => {
  const page = await read('404.html');
  assert.match(page, /Page not found/);
  assert.match(page, /href="\/sitemap\.xml"/);
  assert.match(page, /href="\/llms\.txt"/);
  assert.match(page, /href="\/"/);
});

test('homepage exposes brand and agent-resource metadata without changing the visual shell', async () => {
  const page = await read('index.html');
  assert.match(page, /rel="sitemap"/);
  assert.match(page, /rel="alternate" type="text\/plain" href="\/llms\.txt"/);
  assert.match(page, /"@type": "WebSite"/);
  assert.match(page, /"alternateName": \["Cripple Creek KOA", "Cripple Creek campground"\]/);
});
