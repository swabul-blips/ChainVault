# ChainVault Solana Hackathon - Deployment & Setup Guide

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A Solana wallet (Phantom, Solflare, or Ledger)

### Local Development

1. **Install dependencies**:
```bash
npm install
```

2. **Create environment file**:
```bash
cp .env.example .env.local
```

3. **Start development server**:
```bash
npm run dev
```

4. **Open browser**:
```
http://localhost:3000
```

## Environment Configuration

### Key Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana cluster | `devnet` |
| `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` | Custom RPC endpoint | Optional |
| `NEXT_PUBLIC_FEATURE_LENDING` | Enable lending | `true` |
| `NEXT_PUBLIC_FEATURE_BORROWING` | Enable borrowing | `true` |
| `NEXT_PUBLIC_FEATURE_SAVING` | Enable savings vaults | `true` |
| `NEXT_PUBLIC_VOICE_ALERTS` | Enable voice notifications | `true` |

### Mainnet Deployment

For production deployment to mainnet:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta npm run build
```

## Features

### 1. ChainScore Credit Scoring
- Calculated based on on-chain wallet activity
- Factors: wallet age, transaction frequency, DeFi interactions, repayment history
- Score range: 0-850
- Determines loan eligibility and APY

### 2. Borrowing
- Apply for loans using ChainScore
- Multiple tier support (Platinum, Gold, Silver, Bronze)
- Different APY rates per tier
- Loan wizard UI for easy application

### 3. Lending
- Deposit USDC into liquidity pools
- Choose risk tier (Safe, Balanced, Bold)
- Earn yield based on pool performance
- Track portfolio health

### 4. Savings Vaults
- Set savings goals with target amount and date
- Track progress toward goals
- Earn interest on deposits
- Community vouching system

### 5. Cross-Chain Bridge
- LI.FI-style bridge simulation
- Event history tracking
- Multi-chain support

## API Endpoints

### Score Calculation
```bash
POST /api/score
Content-Type: application/json

{
  "walletAgeMonths": 12,
  "transactionFrequency": 30,
  "transactionVolumeUsd": 500,
  "defiInteractions": 60,
  "tokenDiversity": 40,
  "repaymentHistory": 55,
  "communityVouching": 70
}

Response:
{
  "score": 580,
  "tier": {
    "name": "Silver",
    "min": 500,
    "max": 649,
    "maxLoanUsd": 100,
    "interestPercent": 18,
    "color": "text-slate-300"
  },
  "advice": "Good start. More DeFi consistency can unlock larger loans."
}
```

### Health Check
```bash
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-12-06T12:34:56.789Z",
  "version": "1.0.0"
}
```

## Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## Solana Integration Details

### Wallet Support
- Phantom
- Solflare
- Torus
- Ledger

### USDC Integration
- **Mainnet**: EPjFWaLb3odccxFSrv3C6MrT3AxYqP1Vm2KaMtWvcs
- **Devnet**: 4zMMC9srt5Ri5X14GAgIYY3W6YvV3BJKBjAPtVooS6T

### Network Selection
```typescript
import { getConnection, NETWORKS } from "@/lib/solana-client";

const connection = getConnection("devnet");
const rpcUrl = NETWORKS.mainnet;
```

## Development Workflow

### Testing
```bash
npm run lint
```

### Build Verification
```bash
npm run build
```

## Troubleshooting

### Wallet Connection Issues
1. Ensure you have a supported wallet extension installed
2. Check network selection matches wallet configuration
3. Clear browser cache and try again

### Transaction Failures
1. Verify account has sufficient SOL for gas
2. Check network RPC is responsive
3. Try switching to devnet if on mainnet

### Balance Not Updating
1. Wait 30 seconds for automatic refresh
2. Click wallet address to manually refresh
3. Check RPC endpoint connectivity

## Deployment to Production

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Connect to Vercel and deploy
# Set NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta in production
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD npm start
```

## Security Considerations

1. **Never expose private keys** in environment variables
2. **Use wallet adapters** for transaction signing
3. **Validate inputs** server-side for scoring
4. **Rate limit** API endpoints in production
5. **HTTPS only** for production deployments

## Performance Optimization

- Static page generation for landing page
- Dynamic imports for wallet UI
- Balance caching with 30-second refresh
- LocalStorage for client state persistence

## Support & Resources

- [Solana Documentation](https://docs.solana.com)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project GitHub](https://github.com/yourusername/chainvault)

## License

MIT License - See LICENSE file for details
