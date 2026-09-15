/**
 * Mintlayer docs MCP service (read-only).
 *
 * Remote MCP server (Streamable HTTP, JSON-RPC 2.0) that serves the published
 * Mintlayer documentation to AI agents. Tools are read-only and backed by the
 * llmstxt.org files generated at build time by docusaurus-plugin-llms:
 *
 *   list_docs()                  -> index of pages (from /llms.txt)
 *   search_docs(query, limit)    -> full-text search over all pages (/llms-full.txt)
 *   get_doc_page(path)           -> one page as markdown (/docs/<path>.md)
 *
 * Statelessly serves one JSON-RPC request per POST; no session affinity.
 */

const PROTOCOL_VERSION = '2025-03-26';
const CACHE_TTL = 3600;

const TOOLS = [
  {
    name: 'list_docs',
    description:
      'List all Mintlayer documentation pages with titles, URLs and descriptions.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'search_docs',
    description:
      'Full-text search over the entire Mintlayer documentation. All query terms must match a page (case-insensitive). Returns the best pages with matching snippets.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Space-separated search terms' },
        limit: { type: 'number', description: 'Max results (default 5, max 20)' },
      },
      required: ['query'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_doc_page',
    description:
      'Fetch one Mintlayer documentation page as markdown. Path is the URL path without origin, e.g. "/docs/node/node-rpc" or "docs/install/install-web-gui".',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Page path, e.g. /docs/wallet/rpc/overview' },
      },
      required: ['path'],
      additionalProperties: false,
    },
  },
];

// ---------- origin data access ------------------------------------------------

async function fetchCached(url) {
  const cache = caches.default;
  const cacheKey = new Request(url);
  const hit = await cache.match(cacheKey);
  if (hit) return hit.text();
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`origin returned ${res.status} for ${url}`);
  const text = await res.text();
  const cachedRes = new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': `public, max-age=${CACHE_TTL}` },
  });
  await cache.put(cacheKey, cachedRes.clone());
  return text;
}

/** Parse /llms.txt "## Section" groups of `- [title](url): description`. */
async function listDocs(env) {
  const text = await fetchCached(`${env.DOCS_ORIGIN}/llms.txt`);
  const docs = [];
  let section = '';
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) section = line.slice(3).trim();
    const m = line.match(/^- \[([^\]]+)\]\(([^)]+)\)(?:\s*:?\s*(.*))?$/);
    if (m) docs.push({ title: m[1].trim(), url: m[2].trim(), description: (m[3] || '').trim(), section });
  }
  return docs;
}

/** Split /llms-full.txt into pages on "---" separators, keyed by first "# " heading. */
async function searchIndex(env) {
  const raw = await fetchCached(`${env.DOCS_ORIGIN}/search-index.json`);
  return JSON.parse(raw); // [{ path, title, text }]
}

function snippet(content, terms, width = 240) {
  const lower = content.toLowerCase();
  let idx = -1;
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i !== -1 && (idx === -1 || i < idx)) idx = i;
  }
  if (idx === -1) idx = 0;
  const start = Math.max(0, idx - width / 3);
  return (
    (start > 0 ? '...' : '') +
    content.slice(start, start + width).replace(/\s+/g, ' ').trim() +
    '...'
  );
}

// ---------- tool implementations ---------------------------------------------

async function runTool(name, args, env) {
  switch (name) {
    case 'list_docs': {
      const docs = await listDocs(env);
      return { content: [{ type: 'text', text: JSON.stringify(docs, null, 2) }] };
    }
    case 'search_docs': {
      const query = String(args.query || '').trim().toLowerCase();
      const terms = query.split(/\s+/).filter(Boolean);
      if (!terms.length) throw new Error('query must not be empty');
      const limit = Math.min(Math.max(Number(args.limit) || 5, 1), 20);
      const pages = await searchIndex(env);
      const results = [];
      for (const page of pages) {
        const lower = page.text.toLowerCase();
        if (!terms.every((t) => lower.includes(t))) continue;
        const score =
          (page.title.toLowerCase().includes(query) ? 100 : 0) +
          (page.title.toLowerCase().includes(terms[0]) ? 20 : 0) +
          terms.reduce((acc, t) => acc + (lower.split(t).length - 1), 0);
        results.push({
          title: page.title,
          url: `${env.DOCS_ORIGIN}${page.path.replace(/\.md$/, '')}`,
          snippet: snippet(page.text, terms),
          score,
        });
      }
      results.sort((a, b) => b.score - a.score);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { total_matches: results.length, results: results.slice(0, limit) },
              null,
              2,
            ),
          },
        ],
      };
    }
    case 'get_doc_page': {
      let path = String(args.path || '').trim();
      if (!path.startsWith('/')) path = '/' + path;
      if (path.includes('..')) throw new Error('invalid path');
      if (path.endsWith('.md')) path = path.slice(0, -3);
      if (!path.startsWith('/docs')) throw new Error('path must start with /docs');
      const md = await fetchCached(`${env.DOCS_ORIGIN}${path}.md`);
      return {
        content: [{ type: 'text', text: `# ${path}\n\n${md}` }],
      };
    }
    default:
      throw new Error(`unknown tool: ${name}`);
  }
}

// ---------- JSON-RPC / MCP plumbing -------------------------------------------

const json = (obj, status = 200, headers = {}) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result });
const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/health') {
      return json({
        service: 'mintlayer-docs-mcp',
        transport: 'streamable-http',
        endpoint: `${url.origin}/mcp`,
        tools: TOOLS.map((t) => t.name),
        docs_origin: env.DOCS_ORIGIN,
      });
    }

    if (url.pathname !== '/mcp') return new Response('not found', { status: 404 });

    if (request.method === 'GET') {
      return json({
        service: 'mintlayer-docs-mcp',
        transport: 'streamable-http (POST JSON-RPC 2.0 to this endpoint)',
        protocol: PROTOCOL_VERSION,
        tools: TOOLS.map((t) => t.name),
      });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, MCP-Protocol-Version, Mcp-Session-Id, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return json(rpcError(null, -32000, 'method not allowed; POST JSON-RPC to /mcp'), 405, {
        Allow: 'POST, GET, OPTIONS',
      });
    }

    let rpc;
    try {
      rpc = await request.json();
    } catch {
      return json(rpcError(null, -32700, 'parse error'), 400);
    }
    const { id, method, params } = rpc;
    const cors = { 'Access-Control-Allow-Origin': '*' };

    try {
      switch (method) {
        case 'initialize':
          return json(
            rpcResult(id, {
              protocolVersion: PROTOCOL_VERSION,
              capabilities: { tools: {} },
              serverInfo: { name: 'mintlayer-docs-mcp', version: '1.0.0' },
            }),
            200,
            cors,
          );
        case 'notifications/initialized':
          return new Response(null, { status: 202, headers: cors });
        case 'ping':
          return json(rpcResult(id, {}), 200, cors);
        case 'tools/list':
          return json(rpcResult(id, { tools: TOOLS }), 200, cors);
        case 'tools/call': {
          const result = await runTool(params.name, params.arguments || {}, env);
          return json(rpcResult(id, { ...result, isError: false }), 200, cors);
        }
        default:
          return json(rpcError(id, -32601, `method not found: ${method}`), 200, cors);
      }
    } catch (err) {
      if (method === 'tools/call') {
        return json(
          rpcResult(id, { content: [{ type: 'text', text: String(err) }], isError: true }),
          200,
          cors,
        );
      }
      return json(rpcError(id, -32603, String(err)), 200, cors);
    }
  },
};
