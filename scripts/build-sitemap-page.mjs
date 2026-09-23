// Generates build/sitemap/index.html: a human-crawlable HTML sitemap
// (index of all documentation pages), grouped by docs section.
// Runs as part of `postbuild`, after the Docusaurus build has produced
// build/sitemap.xml.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BASE = 'https://docs.mintlayer.org';
const sitemapPath = join('build', 'sitemap.xml');
const outPath = join('build', 'sitemap', 'index.html');

const xml = readFileSync(sitemapPath, 'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  .filter((url) => url !== `${BASE}/`);

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ACRONYMS = new Set(['api', 'sdk', 'sdks', 'faq', 'nft', 'cli', 'rpc', 'htlc', 'utxo']);
const prettySegment = (s) =>
  ACRONYMS.has(s) ? s.toUpperCase() : s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Group pages by the first two path segments (e.g. /docs/wallet/cli),
// so large sections like the wallet CLI reference break into subgroups.
const groups = new Map();
for (const url of urls) {
  const path = new URL(url).pathname;
  const segs = path.replace(/\/+$/, '').split('/').filter(Boolean);
  const key = segs.length > 2 ? `/${segs.slice(0, 2).join('/')}/` : `/${segs.join('/')}/`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(url);
}

const groupEntries = [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]));
const total = urls.length;

const sectionsHtml = groupEntries
  .map(([key, groupUrls]) => {
    const title = key
      .split('/')
      .filter((s) => s && s.toLowerCase() !== 'docs')
      .map(prettySegment)
      .join(' › ');
    const items = groupUrls
      .sort((a, b) => a.localeCompare(b))
      .map((url) => {
        const label = decodeURIComponent(new URL(url).pathname)
          .replace(/\/+$/, '')
          .split('/')
          .pop();
        return `      <li><a href="${escape(url)}">${escape(label || '/')}</a></li>`;
      })
      .join('\n');
    return `    <section>\n      <h2>${escape(title || '/')} <span class="count">${groupUrls.length}</span></h2>\n      <ul>\n${items}\n      </ul>\n    </section>`;
  })
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sitemap | Mintlayer Documentation</title>
  <meta name="description" content="Index of all ${total} pages of the Mintlayer documentation." />
  <link rel="canonical" href="${BASE}/sitemap/" />
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; color: #1c1e21; }
    main { max-width: 60rem; margin: 0 auto; padding: 2rem 1rem 4rem; }
    h1 { font-size: 1.6rem; } h2 { font-size: 1.05rem; margin: 1.6rem 0 0.4rem; }
    .count { color: #888; font-weight: normal; font-size: 0.85rem; }
    ul { columns: 3 14rem; column-gap: 2rem; list-style: none; padding: 0; margin: 0; }
    li { break-inside: avoid; padding: 0.1rem 0; }
    a { color: #2e7d32; text-decoration: none; } a:hover { text-decoration: underline; }
    p.back a { color: #666; }
  </style>
</head>
<body>
  <main>
    <p class="back"><a href="${BASE}/">&larr; docs.mintlayer.org</a></p>
    <h1>Mintlayer documentation sitemap</h1>
    <p>Index of all ${total} documentation pages. The machine-readable sitemap is at <a href="${BASE}/sitemap.xml">sitemap.xml</a>.</p>
${sectionsHtml}
  </main>
</body>
</html>
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html);
console.log(`sitemap page: ${total} URLs in ${groupEntries.length} sections -> ${outPath}`);
