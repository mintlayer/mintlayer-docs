// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://docs.mintlayer.org',
	integrations: [
		mermaid({
			autoTheme: true,
			enableLog: false,
			mermaidConfig: {
				theme: 'dark',
				flowchart: { curve: 'basis', nodeSpacing: 32, rankSpacing: 48 },
				themeVariables: {
					fontFamily: 'DM Sans, Inter, ui-sans-serif, system-ui, sans-serif',
					fontSize: '13px',
					primaryColor: '#18181b',
					primaryTextColor: '#e4e4e7',
					primaryBorderColor: '#3f3f46',
					lineColor: '#52525b',
					secondaryColor: '#27272a',
					tertiaryColor: '#1c1c1e',
				},
			},
		}),
		starlight({
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
			},
			title: 'Mintlayer Docs',
			description: 'Official documentation for the Mintlayer blockchain platform.',
			logo: {
				src: './src/assets/mintlayer-logo.svg',
				alt: 'Mintlayer',
				replacesTitle: true,
			},
			titleDelimiter: '|',
			defaultLocale: 'root',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/mintlayer' },
				{ icon: 'x.com', label: 'X', href: 'https://twitter.com/mintlayer' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/gkZ4h8McBT' },
				{ icon: 'external', label: 'mintlayer.org', href: 'https://www.mintlayer.org' },
			],
			customCss: ['./src/styles/mintlayer.css'],
			head: [
				{ tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap',
					},
				},
				{ tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Mintlayer Docs' } },
				{ tag: 'meta', attrs: { property: 'og:title', content: 'Mintlayer Docs' } },
				{
					tag: 'meta',
					attrs: {
						property: 'og:description',
						content:
							'Official documentation for Mintlayer — whitepaper, SDKs, Mojito, bridge, and developer guides.',
					},
				},
				{ tag: 'meta', attrs: { property: 'og:url', content: 'https://docs.mintlayer.org' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:site', content: '@mintlayer' } },
				{ tag: 'meta', attrs: { name: 'twitter:title', content: 'Mintlayer Docs' } },
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:description',
						content:
							'Official documentation for Mintlayer — whitepaper, SDKs, Mojito, bridge, and developer guides.',
					},
				},
			],
			sidebar: [
				{
					label: 'Start Here',
					collapsed: false,
					items: [
						{ label: 'Home', slug: '' },
						{ label: 'Introduction', slug: 'intro' },
					],
				},
				{
					label: 'Build',
					collapsed: false,
					items: [
						{ label: 'Mojito Inject', slug: 'mojito-inject/getting-started' },
						{ label: 'JavaScript SDK', slug: 'javascript-sdk/getting-started' },
						{ label: 'MCP', slug: 'mcp/getting-started' },
					],
				},
				{
					label: 'Guides',
					collapsed: false,
					items: [
						{ label: 'Issue a New Token', slug: 'guides/issue-new-token' },
						{ label: 'Bridge API', slug: 'bridge' },
						{ label: 'Trezor Firmware', slug: 'trezor/1-build-firmware' },
					],
				},
				{
					label: 'Whitepaper',
					collapsed: false,
					items: [
						{ label: 'Blockchain Architecture', slug: 'whitepaper/1-blockchain-architecture' },
						{ label: 'Mintlayer Wallet', slug: 'whitepaper/2-mintlayer-wallet' },
						{ label: 'Tokenization Standard', slug: 'whitepaper/3-tokenization-standard' },
						{ label: 'Decentralized Finance', slug: 'whitepaper/4-decentralized-finance-defi' },
						{ label: 'Decentralized Exchange', slug: 'whitepaper/5-decentralized-exchange-dex' },
						{ label: 'Token and Public Sale', slug: 'whitepaper/6-token-and-public-sale' },
					],
				},
			],
		}),
	],
});
