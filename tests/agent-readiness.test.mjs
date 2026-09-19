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
  const description = page.match(/<meta name="description" content="([^"]+)"/)[1];
  assert.ok(description.length >= 120 && description.length <= 160, `description length was ${description.length}`);
});

test('homepage organization schema includes address and contact point', async () => {
  const page = await read('index.html');
  assert.match(page, /"@type": "Organization"/);
  assert.match(page, /"contactPoint":/);
  assert.match(page, /"contactType": "campground guest support"/);
  assert.match(page, /"@type": "PostalAddress"/);
  assert.match(page, /cripplecreekkoa@gmail\.com/);
});

test('trust anchor pages contain substantial public information', async () => {
  for (const pageName of ['about.html', 'contact.html', 'privacy.html']) {
    const page = await read(pageName);
    assert.ok(page.length >= 500, `${pageName} should contain at least 500 characters`);
    assert.match(page, /rel="canonical"/);
    assert.match(page, /href="\/contact"|href="\/privacy"|href="\/about"/);
  }
});

test('robots and sitemap expose the canonical discovery path', async () => {
  const robots = await read('robots.txt');
  const sitemap = await read('sitemap.xml');
  assert.match(robots, /Sitemap: https:\/\/cripplecreekkoa\.com\/sitemap\.xml/);
  for (const path of ['/', '/about', '/contact', '/privacy']) {
    assert.match(sitemap, new RegExp(`<loc>https:\\/\\/cripplecreekkoa\\.com${path.replace('/', '\\/')}<\\/loc>`));
  }
});

test('worker negotiates Markdown and returns Markdown 404s', async () => {
  const worker = (await import('../worker.js')).default;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.match(String(url), /raw\.githubusercontent\.com/);
    return new Response('# Cripple Creek KOA Holiday\n', { status: 200 });
  };
  try {
    const markdownResponse = await worker.fetch(new Request('https://cripplecreekkoa.com/', {
      headers: { Accept: 'text/markdown' },
    }));
    assert.equal(markdownResponse.status, 200);
    assert.match(markdownResponse.headers.get('content-type'), /text\/markdown/);
    assert.equal(markdownResponse.headers.get('vary'), 'Accept');
    assert.ok((await markdownResponse.text()).length > 20);

    const notFoundResponse = await worker.fetch(new Request('https://cripplecreekkoa.com/__ora-404-probe-nx2rpf2m', {
      headers: { Accept: 'text/markdown' },
    }));
    assert.equal(notFoundResponse.status, 404);
    assert.match(notFoundResponse.headers.get('content-type'), /text\/markdown/);
    assert.match(await notFoundResponse.text(), /sitemap/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
