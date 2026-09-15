# Mintlayer docs MCP service

A read-only [Model Context Protocol](https://modelcontextprotocol.io) server that serves the
published Mintlayer documentation to AI agents. Deployed as a Cloudflare Worker; stateless
Streamable HTTP (POST JSON-RPC 2.0 to `/mcp`), no authentication, no write access.

Data sources are the llmstxt.org files generated at build time by `docusaurus-plugin-llms`:
`/llms.txt` (index), `/llms-full.txt` (full corpus), and per-page `/docs/*.md` mirrors. The
worker fetches them from `DOCS_ORIGIN` (default `https://docs.mintlayer.org`) and caches for
one hour at the edge, so it always reflects the latest deploy.

## Tools

| Tool | Input | Description |
| ---- | ----- | ----------- |
| `list_docs` | — | All documentation pages: title, URL, description, section |
| `search_docs` | `query` (space-separated terms), `limit?` | Full-text search over all pages, best matches with snippets |
| `get_doc_page` | `path` | One page as markdown, e.g. `/docs/node/node-rpc` |

## Endpoint

`https://docs.mintlayer.org/mcp` (after deployment)

Any MCP-compatible client that supports Streamable HTTP can connect directly. For clients
without remote-MCP support, bridge it locally with `mcp-remote`:

```json
{
  "mcpServers": {
    "mintlayer-docs": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://docs.mintlayer.org/mcp"]
    }
  }
}
```

## Quick test

```bash
curl -s https://docs.mintlayer.org/mcp -X POST \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Deploy

```bash
cd mcp-worker
npx wrangler deploy
```

Then attach the route `docs.mintlayer.org/mcp` to the worker (or add a custom domain).
`DOCS_ORIGIN` in `wrangler.toml` must point at the deployment serving the Docusaurus build.
