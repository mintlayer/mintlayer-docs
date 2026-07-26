# Mintlayer Docs

Official documentation for [Mintlayer](https://www.mintlayer.org), built with [Astro Starlight](https://starlight.astro.build).

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/
npm run build      # production build to ./dist
npm run preview    # preview production build
```

## Project structure

```
src/
├── assets/          # logo and images
├── components/      # custom Astro components (hero, cards)
├── content/docs/    # documentation pages (.md / .mdx)
└── styles/          # design system CSS
astro.config.mjs     # Starlight config and sidebar
public/              # static assets
```

## Contents

- **Build** — Mojito Inject, JavaScript SDK, MCP
- **Guides** — token issuance, bridge API, Trezor firmware
- **Whitepaper** — architecture, wallet, tokenization, DeFi, DEX, tokenomics

> If you deploy to GitHub Pages under a project path, set `base: '/mintlayer-docs/'` in `astro.config.mjs`.
