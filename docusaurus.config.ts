import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Mintlayer',
  tagline: 'Run a node, operate a wallet, issue tokens, and build dApps on the Mintlayer blockchain',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.mintlayer.org',
  // Set the /<baseUrl>/ pathname under which the site is served.
  // The site is served from the domain root (docs.mintlayer.org).
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'mintlayer', // Usually your GitHub org/user name.
  projectName: 'mintlayer-docs', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mintlayer/mintlayer-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/mintlayer/mintlayer-docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  markdown: {
    mermaid: true,
  },

    headTags: [
      {
        tagName: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          href: '/img/apple-touch-icon.png',
          sizes: '180x180',
        },
      },
    ],

  plugins: [
    [
      'docusaurus-plugin-llms',
      {
        // Agent-facing entrypoints at the site root: llms.txt (index),
        // llms-full.txt (full docs in one file) and a .md file per page.
        generateMarkdownFiles: true,
        excludeImports: true,
        removeDuplicateHeadings: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/social-card.png',
    headTags: [
      {
        tagName: 'link',
        attributes: {
          rel: 'apple-touch-icon',
          href: '/img/apple-touch-icon.png',
          sizes: '180x180',
        },
      },
    ],
    navbar: {
      title: 'Mintlayer',
      logo: {
        alt: 'Mintlayer logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          label: 'Installation',
          to: '/docs/getting-started/install',
          position: 'left',
        },
        {
          label: 'Guides',
          to: '/docs/guides/issue-new-token',
          position: 'left',
        },
        {
          label: 'Whitepaper',
          to: '/docs/whitepaper/blockchain-architecture',
          position: 'left',
        },
        {
          href: 'https://github.com/mintlayer/mintlayer-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Node',
              to: '/docs/node',
            },
            {
              label: 'Wallet CLI',
              to: '/docs/wallet/cli',
            },
            {
              label: 'Wallet RPC',
              to: '/docs/wallet/rpc',
            },
            {
              label: 'API',
              to: '/docs/api',
            },
            {
              label: 'Guides',
              to: '/docs/guides/issue-new-token',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/53488934/',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/mintlayer',
            },
            {
              label: 'X',
              href: 'https://twitter.com/mintlayer',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/MintlayerOfficial/',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@mintlayer',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: 'https://www.mintlayer.org/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/mintlayer',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mintlayer.`,
    },
    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css',
        type: 'text/css',
        crossorigin: 'anonymous',
      },
    ],
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
