/**
 * Post-build: generate build/search-index.json for the docs MCP worker.
 * Walks the per-page markdown mirrors emitted by docusaurus-plugin-llms and
 * produces [{ path, title, text }] used by the search_docs tool.
 */
import {readFileSync, writeFileSync, readdirSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';

const root = new URL('../build/', import.meta.url).pathname;

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, {withFileTypes: true})) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

const index = walk(root)
  .map((file) => {
    let md = readFileSync(file, 'utf8');
    let title = '';
    const fm = md.match(/^---\n([\s\S]*?)\n---/);
    if (fm) {
      const tm = fm[1].match(/^title:\s*(.+)$/m);
      if (tm) title = tm[1].trim().replace(/^["']|["']$/g, '');
      md = md.replace(/^---\n[\s\S]*?\n---\n*/, '');
    }
    if (!title) {
      // H1 only counts within the first lines of the body (a leading "# " may
      // otherwise be a shell comment inside a code block)
      const h1 = md.split('\n').slice(0, 5).find((l) => /^#\s+/.test(l));
      if (h1) title = h1.replace(/^#\s+/, '').trim();
    }
    if (!title) title = relative(root, file).replace(/\.md$/, '');
    const path = '/' + relative(root, file).replace(/\\/g, '/');
    return {path, title, text: `${title}\n${md}`.slice(0, 20000)};
  })
  .filter((d) => d.text.trim().length > 40);

writeFileSync(join(root, 'search-index.json'), JSON.stringify(index));
console.log(`search-index.json: ${index.length} pages`);
