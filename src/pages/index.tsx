import type {ReactNode} from 'react';
import {useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

const MCP_ENDPOINT = 'https://docs.mintlayer.org/mcp';

function McpBanner() {
  const [copied, setCopied] = useState(false);
  return (
    <section className={styles.mcpBanner}>
      <div className="container">
        <div className="row">
          <div className="col col--5">
            <p className={styles.mcpEyebrow}>Built for AI agents</p>
            <Heading as="h2" className={styles.mcpTitle}>
              Connect your assistant to the docs
            </Heading>
            <p className={styles.mcpText}>
              The documentation runs a read-only{' '}
              <Link to="/docs/build/mcp#docs-server">Model Context Protocol</Link> server.
              Point any MCP client at the endpoint and your agent can search and read every page
              with three tools: <code>list_docs</code>, <code>search_docs</code>,{' '}
              <code>get_doc_page</code>.
            </p>
            <Link className={styles.mcpLink} to="/docs/build/mcp#docs-server">
              Setup guide →
            </Link>
          </div>
          <div className="col col--7">
            <div className={styles.mcpBox}>
              <div className={styles.mcpBoxHeader}>
                <span>Add to your MCP client</span>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={() => {
                    const config = JSON.stringify(
                      {mcpServers: {mintlayer_docs: {url: MCP_ENDPOINT}}},
                      null,
                      2,
                    );
                    navigator.clipboard.writeText(config).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    });
                  }}
                  aria-label="Copy MCP client configuration">
                  {copied ? 'Copied!' : 'Copy config'}
                </button>
              </div>
              <pre className={styles.mcpConfig}>
                {JSON.stringify({mcpServers: {mintlayer_docs: {url: MCP_ENDPOINT}}}, null, 2)}
              </pre>
              <div className={styles.mcpEndpoint}>
                <span className={styles.terminalPrompt}>endpoint</span>
                <code>{MCP_ENDPOINT}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title} Documentation
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started">
            Get Started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/getting-started/install">
            Install
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/build">
            Build
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Documentation`}
      description="Documentation for the Mintlayer blockchain platform: run a node, operate a wallet, issue tokens, and build dApps.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <McpBanner />
      </main>
    </Layout>
  );
}
