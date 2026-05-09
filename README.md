# ChainVault - Trustless Microfinance for the Underbanked on Solana

ChainVault is a production-ready MVP for a decentralized microfinance protocol built on Solana. It enables borrowers without traditional credit histories to access affordable credit through on-chain activity scoring, while allowing lenders to earn yield across multiple risk tiers.

## 🚀 Features

### ✅ ChainScore Credit Scoring Algorithm
- On-chain reputation scoring (0-850 range)
- Factors: wallet age, transaction frequency, DeFi interactions, repayment history, community vouching
- Four tier system: Platinum ($500, 8% APY), Gold ($250, 12% APY), Silver ($100, 18% APY), Bronze ($50, 24% APY)
- Real-time score calculation via `/api/score` endpoint

### ✅ Borrowing Flow
- Loan wizard with dynamic score calculation
- Tier-based loan limits and APY rates
- Repayment impact simulation
- Multi-currency support (USDC on Solana)

### ✅ Lending Pools
- Three risk tiers: Safe (8% APY), Balanced (14% APY), Bold (22% APY)
- Real-time pool health metrics
- Portfolio overview dashboard
- Risk-adjusted returns

### ✅ Savings Vaults
- Goal-based savings with interest accrual
- Multiple contribution schedules (weekly, bi-weekly, flexible)
- Community vouching system
- 8% baseline APY with compounding

### ✅ Solana Wallet Integration
- Multi-wallet support: Phantom, Solflare, Torus, Ledger
- Real-time SOL/USDC balance display
- Transaction confirmation tracking
- Devnet and Mainnet support

### ✅ Cross-Chain Bridge Simulator
- LI.FI-style bridge UX
- Route event tracking
- Multi-chain support preparation

### ✅ Voice Notifications
- Browser speech synthesis fallback
- Smart alerts for loan approvals, repayments, pool events
- User-configurable preferences

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + PostCSS
- **Blockchain**: Solana Web3.js + Wallet Adapter
- **State**: Client-side LocalStorage with custom events
- **API**: Next.js API Routes

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- A Solana wallet (Phantom, Solflare, Torus, or Ledger)

## 🚀 Quick Start

### 1. Install & Setup
```bash
git clone <repository>
cd chainvault
npm install
cp .env.example .env.local
```

### 2. Configure Environment
```bash
# .env.local
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_FEATURE_LENDING=true
NEXT_PUBLIC_FEATURE_BORROWING=true
NEXT_PUBLIC_FEATURE_SAVING=true
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Routes

| Route | Purpose | Status |
|-------|---------|--------|
| `/` | Landing page with stats | ✅ Complete |
| `/borrow` | Loan application wizard | ✅ Complete |
| `/lend` | Lending pool dashboard | ✅ Complete |
| `/save` | Savings vault creation | ✅ Complete |
| `/save/[vaultId]` | Vault detail & contributions | ✅ Complete |
| `/score` | Score card & simulator | ✅ Complete |
| `/bridge` | Cross-chain bridge | ✅ Complete |

## 🔌 API Endpoints

### POST /api/score
Calculate credit score for a wallet based on on-chain activity.

**Request:**
```json
{
  "walletAgeMonths": 12,
  "transactionFrequency": 30,
  "transactionVolumeUsd": 500,
  "defiInteractions": 60,
  "tokenDiversity": 40,
  "repaymentHistory": 55,
  "communityVouching": 70
}
```

**Response:**
```json
{
  "score": 580,
  "tier": {
    "name": "Silver",
    "minScore": 500,
    "maxScore": 649,
    "maxLoanUsd": 100,
    "interestPercent": 18
  },
  "advice": "Good start. More DeFi consistency can unlock larger loans."
}
```

### GET /api/health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-06T12:34:56.789Z",
  "version": "1.0.0"
}
```

## 💡 Key Components

### ChainScore Engine (`src/lib/scoring.ts`)
```typescript
computeChainScore(inputs: ChainScoreInputs): number
getScoreTier(score: number): ScoreTier
applyScoreDelta(currentScore: number, delta: number): number
scoreAdvice(score: number): string
```

### Solana Integration (`src/lib/solana-client.ts`)
```typescript
getConnection(network: Network): Connection
getUsdcBalance(connection, walletAddress, network): Promise<number>
getSolBalance(connection, walletAddress): Promise<number>
validatePublicKey(address: string): PublicKey | null
```

### State Management (`src/lib/storage.ts`)
- Persistent state with localStorage
- Event-based state subscription
- Type-safe state updates
- Notification system

## 🎮 Components

- `SolanaProvider` - Wallet adapter wrapper
- `WalletConnect` - Wallet connection UI
- `LoanWizard` - Borrowing flow
- `PoolSelector` - Lending interface
- `ChainScoreCard` - Score visualization
- `OnboardingWizard` - First-time user guide
- `NotificationCenter` - Alert management

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deployment to Vercel
```bash
git push origin main
# Vercel auto-deploys from main branch
# Set NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta in production
```

### Docker
```bash
docker build -t chainvault .
docker run -p 3000:3000 chainvault
```

## 🔐 Security

- ✅ No private keys stored client-side
- ✅ Wallet adapter handles signing
- ✅ Server-side input validation
- ✅ Type-safe Solana interactions
- ✅ HTTPS-only in production

## 🔄 Next Steps & Roadmap

### Phase 1 (MVP - Current)
- ✅ ChainScore calculation
- ✅ Loan/lending UI
- ✅ Savings vaults
- ✅ Solana wallet integration

### Phase 2 (Smart Contracts)
- [ ] Anchor lending program
- [ ] On-chain scoring oracle
- [ ] Pool management smart contracts
- [ ] Vault automation

### Phase 3 (Enhanced Features)
- [ ] NFT collateral support
- [ ] DAO governance
- [ ] Multi-asset support
- [ ] Liquidation engine

### Phase 4 (Production)
- [ ] Audit & security review
- [ ] Mainnet deployment
- [ ] Insurance pool
- [ ] Partnership integrations

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Production setup & deployment
- [Architecture Overview](./ARCHITECTURE.md) - System design (coming soon)
- [Contributing Guide](./CONTRIBUTING.md) - Development guidelines (coming soon)

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📝 License

MIT License - See LICENSE file

## 🙋 Support

- 📖 [Solana Documentation](https://docs.solana.com)
- 🔗 [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- 💬 [Discord Community](https://discord.gg/solana)
- 🐛 [GitHub Issues](https://github.com/yourusername/chainvault/issues)

## 🏆 Hackathon Info

Built for the [Dev3Pack Solana Hackathon](https://hack.dev3pack.xyz/).

**Team**: ChainVault Contributors  
**Network**: Devnet (testable), Mainnet-ready  
**Status**: MVP Ready for Integration

---

**Start borrowing, lending, and saving on Solana today!** 🚀
