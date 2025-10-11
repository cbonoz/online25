# SentinelTx – Real-Time Blockchain Fraud Detection

**SentinelTx** is a live monitoring dashboard that tracks blockchain wallets, smart contracts, and token activity to detect potential fraud in real time. It leverages on-chain analytics, real-time price feeds, and off-chain signals to provide actionable alerts and visualizations.

---

## Features

- **Wallet & Token Subscription** – Monitor specific wallets or tokens in real time.
- **Rule-Based Alert Engine** – Detects suspicious transactions such as:
  - Large transfers from dormant wallets
  - Rapid splitting of funds into multiple addresses (mixing)
  - Liquidity withdrawals from token pools (rug pulls)
  - Flash price spikes or oracle manipulation
- **Real-Time Dashboard** – Live alerts with risk scores and timestamps.
- **Graph Visualization** – Trace the flow of funds between wallets with interactive charts.
- **Oracle & Price Monitoring** – Integrates Pyth Network feeds to detect price manipulation.
- **Access Control & Security** – Optional Lit Protocol integration for secure data access.
- **Case Export** – Export suspicious activity into JSON or PDF for investigation.

---

## Tech Stack

- **Backend**: Node.js / TypeScript, Fastify or Nest.js
- **Blockchain Data**: Alchemy / Infura / QuickNode for live transaction streams
- **Price Feeds**: Pyth Network or Chainlink
- **Database**: Postgres + Redis (for caching)
- **Frontend**: React + Tailwind CSS, D3.js / vis.js for transaction flow visualization
- **Access Control**: Lit Protocol (optional)
- **Explorer Integration**: Blockscout SDK for detailed transaction views

---

## How it Works

1. Users subscribe to wallets or tokens to monitor.
2. The backend listens to live blockchain transactions and price feeds.
3. Suspicious activity triggers alerts with risk scoring.
4. Alerts are visualized in the dashboard with detailed flow graphs.
5. Users can export cases for further investigation.

---

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/cbonoz/ethonline25.git
