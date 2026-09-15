import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type IconProps = {className?: string};

const IconSvg = ({path, className}: {path: ReactNode; className?: string}) => (
  <svg
    className={clsx(styles.icon, className)}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    {path}
  </svg>
);

const Icons = {
  node: (
    <IconSvg
      path={
        <>
          <rect x="2" y="3" width="20" height="8" rx="2" />
          <rect x="2" y="13" width="20" height="8" rx="2" />
          <circle cx="6" cy="7" r="0.5" fill="currentColor" />
          <circle cx="6" cy="17" r="0.5" fill="currentColor" />
        </>
      }
    />
  ),
  terminal: (
    <IconSvg
      path={
        <>
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="m6 8 3 3-3 3" />
          <path d="M13 14h5" />
        </>
      }
    />
  ),
  rpc: (
    <IconSvg
      path={
        <>
          <circle cx="12" cy="5" r="2.2" />
          <circle cx="5" cy="19" r="2.2" />
          <circle cx="19" cy="19" r="2.2" />
          <path d="M12 7.5V12m0 0-5.5 5M12 12l5.5 5" />
        </>
      }
    />
  ),
  api: (
    <IconSvg
      path={
        <>
          <ellipse cx="12" cy="5" rx="8" ry="2.6" />
          <path d="M4 5v7c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6V5" />
          <path d="M4 12v7c0 1.4 3.6 2.6 8 2.6s8-1.2 8-2.6v-7" />
        </>
      }
    />
  ),
  guides: (
    <IconSvg
      path={
        <>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </>
      }
    />
  ),
  bridge: (
    <IconSvg
      path={
        <>
          <path d="M8 3 4 7l4 4" />
          <path d="M4 7h16" />
          <path d="m16 21 4-4-4-4" />
          <path d="M20 17H4" />
        </>
      }
    />
  ),
  js: (
    <IconSvg
      path={
        <>
          <path d="m8 7-5 5 5 5" />
          <path d="m16 7 5 5-5 5" />
        </>
      }
    />
  ),
  go: (
    <IconSvg
      path={
        <>
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </>
      }
    />
  ),
  inject: (
    <IconSvg
      path={
        <>
          <path d="M12 22V12" />
          <path d="M12 12 4.5 7.5a4 4 0 0 1 0-5" />
          <path d="M12 12l7.5-4.5a4 4 0 0 0 0-5" />
          <circle cx="12" cy="18" r="4" />
        </>
      }
    />
  ),
};

type SectionCard = {
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  accent?: 'mint' | 'purple';
};

const SectionList: SectionCard[] = [
  {
    title: 'Node',
    description: 'Install, run, and upgrade a Mintlayer node. Daemon options, firewall setup, and node CLI commands.',
    to: '/docs/node',
    icon: Icons.node,
  },
  {
    title: 'Wallet CLI',
    description: 'Full command reference for wallet-cli: accounts, addresses, tokens, staking, orders, and HTLCs.',
    to: '/docs/wallet/cli',
    icon: Icons.terminal,
  },
  {
    title: 'Wallet RPC',
    description: 'Automate the wallet over JSON-RPC: wallet management, transactions, staking, and token APIs.',
    to: '/docs/wallet/rpc',
    icon: Icons.rpc,
  },
  {
    title: 'API',
    description: 'Query blockchain data through the API web server and the PostgreSQL-backed blockchain scanner.',
    to: '/docs/api',
    icon: Icons.api,
    accent: 'purple',
  },
  {
    title: 'Guides',
    description: 'Step-by-step tutorials: issue tokens and NFTs, run a staking pool, trade with orders, atomic swaps.',
    to: '/docs/guides/issue-new-token',
    icon: Icons.guides,
  },
  {
    title: 'Bridge',
    description: 'Move assets between Mintlayer and Ethereum with the bridge API.',
    to: '/docs/build/bridge',
    icon: Icons.bridge,
  },
  {
    title: 'JavaScript SDK',
    description: 'Build dApps on Mintlayer with the official JavaScript SDK.',
    to: '/docs/build/sdks/javascript/getting-started',
    icon: Icons.js,
  },
  {
    title: 'Go SDK',
    description: 'Full API coverage in Go: node, indexer, wallet, and embedded WASM crypto.',
    to: '/docs/build/sdks/go',
    icon: Icons.go,
    accent: 'purple',
  },
  {
    title: 'Mojito Inject',
    description: 'Connect your dApp to the user’s Mojito wallet through the browser extension provider.',
    to: '/docs/build/mojito-inject',
    icon: Icons.inject,
  },
];

function Section({title, description, to, icon, accent = 'mint'}: SectionCard) {
  return (
    <div className={clsx('col col--4', styles.cardCol)}>
      <Link to={to} className={clsx(styles.card, accent === 'purple' && styles.cardPurple)}>
        <div className={clsx(styles.cardIconWrap, accent === 'purple' && styles.cardIconWrapPurple)}>
          {icon}
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
        <span className={styles.cardCta}>Read more →</span>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <p className={styles.eyebrow}>Start building</p>
        <Heading as="h2" className={styles.sectionTitle}>
          Explore the documentation
        </Heading>
        <div className="row">
          {SectionList.map((props) => (
            <Section key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
