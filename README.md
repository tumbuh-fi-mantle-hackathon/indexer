# Tumbuh Indexer

A high-performance blockchain indexer for the Tumbuh protocol, built on [Ponder](https://ponder.sh/). This indexer tracks vaults, deposits, withdrawals, rewards, and protocol APYs on the Mantle network.

## 🚀 Overview

Tumbuh Indexer monitors on-chain events from Tumbuh's core contracts and underlying yield protocols (Beefy, Compound, Dolomite, Init Capital) to provide a unified data layer for the frontend.

## ✨ Key Features

- **Vault Tracking**: Indexes deposits and withdrawals across all Tumbuh vaults.
- **User Positions**: Maintains real-time balances and historical activity for users.
- **Reward Monitoring**: Tracks reward harvesting and distribution events.
- **APY Aggregation**: Synchronizes APY data from multiple yield protocols.
- **Real-time API**: Provides GraphQL and SQL endpoints for efficient data retrieval.

## 🌐 Network Support

| Network        | Chain ID | Status |
| :------------- | :------- | :----- |
| Mantle Sepolia | 5003     | Live   |

## 🏗️ Architecture

- **Ponder**: Framework for indexing Ethereum events.
- **Hono**: Lightweight web framework for custom API routes.
- **Viem**: Ethereum library for contract interactions and type-safe ABI handling.
- **Schema**: Defined in `ponder.schema.ts`, using a relational model for optimized queries.

## 🛠️ Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 18.14)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository and navigate to the indexer directory.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment variables:
   Copy `.env.local.example` (if available) to `.env.local` and add your RPC URLs:
   ```bash
   PONDER_RPC_URL_5003=your_rpc_url
   ```

## ⌨️ Development Scripts

| Command          | Description                                      |
| :--------------- | :----------------------------------------------- |
| `pnpm dev`       | Start the development server with hot reloading. |
| `pnpm start`     | Start the indexer in production mode.            |
| `pnpm codegen`   | Generate type-safe code from ABIs and schema.    |
| `pnpm typecheck` | Run TypeScript type checking.                    |
| `pnpm lint`      | Lint the codebase.                               |
| `pnpm format`    | Format code using Prettier.                      |

## 📡 API Endpoints

Once running, the indexer exposes the following endpoints:

- **GraphQL**: `http://localhost:42069/` (or `/graphql`)
- **SQL (Hono)**: `http://localhost:42069/sql/*`

## 📄 License

Private / Internal.
