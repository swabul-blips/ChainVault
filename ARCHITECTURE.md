# ChainVault Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Frontend Layer                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Next.js 16 with App Router                                  │  │
│  │ ├─ Pages: /, /borrow, /lend, /save, /score, /bridge       │  │
│  │ ├─ Components: UI, Wizards, Cards                           │  │
│  │ └─ Hooks: useChainVaultState, useSolanaWallet             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Wallet Integration Layer                                    │  │
│  │ ├─ SolanaProvider (ConnectionProvider, WalletProvider)      │  │
│  │ ├─ WalletConnect Button                                     │  │
│  │ └─ Multi-wallet Support (Phantom, Solflare, etc.)          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        Business Logic Layer                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Credit Scoring Engine (src/lib/scoring.ts)                  │  │
│  │ ├─ ChainScoreInputs: 7 on-chain metrics                     │  │
│  │ ├─ computeChainScore(): 300-850 range                       │  │
│  │ ├─ 4 Tier System (Platinum/Gold/Silver/Bronze)             │  │
│  │ └─ Loan eligibility & APY determination                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Vault Management (src/lib/vaults.ts)                        │  │
│  │ ├─ Goal-based savings                                       │  │
│  │ ├─ Interest accrual (8% APY)                                │  │
│  │ ├─ Contribution tracking                                    │  │
│  │ └─ Completion forecasting                                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Solana Client (src/lib/solana-client.ts)                    │  │
│  │ ├─ Network management (devnet/mainnet)                      │  │
│  │ ├─ Token operations (USDC, SPL tokens)                      │  │
│  │ ├─ Balance queries                                          │  │
│  │ └─ Transaction utilities                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                           API Layer                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Next.js API Routes (src/app/api/)                           │  │
│  │ ├─ POST /api/score - Credit scoring endpoint               │  │
│  │ ├─ GET /api/health - Health check                          │  │
│  │ └─ [Future] /api/transactions, /api/loans                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       Data Persistence Layer                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Browser Storage                                             │  │
│  │ ├─ localStorage: Persistent app state                       │  │
│  │ └─ Custom Events: State subscription & updates              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Solana Blockchain                                           │  │
│  │ ├─ Account queries (SOL, USDC balances)                     │  │
│  │ ├─ Transaction sending & confirmation                       │  │
│  │ └─ On-chain program interaction [Future]                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     External Services                               │
│  ├─ Solana RPC (devnet.solana.com or mainnet)                      │
│  ├─ SPL Token Program                                              │
│  └─ [Future] Anchor lending programs                               │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### State Management Flow

```
Global State (localStorage)
    ↓
useChainVaultState Hook
    ├→ Home Page (Stats)
    ├→ Borrow Page (LoanWizard, ChainScoreCard)
    ├→ Lend Page (PoolSelector, Pool Overview)
    ├→ Save Page (Vault Management)
    ├→ Score Page (Score Card, Simulator)
    └→ Bridge Page (Bridge Simulator)
```

### Data Model

```typescript
ChainVaultState {
  walletAddress: string
  chainScore: number
  totalDeposits: number
  totalLoansIssued: number
  totalRepaid: number
  
  deposits: Deposit[]          // Lending pool deposits
  loans: Loan[]                // Active/repaid/defaulted loans
  bridgeEvents: BridgeEvent[]  // Cross-chain history
  vaults: SavingsVault[]       // Savings goals
  notifications: AppNotification[]
  
  onboardingStep: 1 | 2 | 3 | 4
  preferences: UserPreferences
}

ChainScoreInputs {
  walletAgeMonths: number
  transactionFrequency: number
  transactionVolumeUsd: number
  defiInteractions: number
  tokenDiversity: number
  repaymentHistory: number
  communityVouching: number
}
```

## Key Algorithms

### ChainScore Calculation

```
Score = 300 + (weighted_metrics × 550)

Where weighted_metrics = 
  0.1  × normalize(walletAgeMonths, 60) +
  0.15 × normalize(transactionFrequency, 150) +
  0.15 × normalize(transactionVolumeUsd, 6000) +
  0.2  × normalize(defiInteractions, 100) +
  0.1  × normalize(tokenDiversity, 100) +
  0.25 × normalize(repaymentHistory, 100) +
  0.05 × normalize(communityVouching, 100)

Result: 0-850 score
Tiers: Platinum (750-850), Gold (650-749), Silver (500-649), 
       Bronze (300-499), No Loan (<300)
```

### Vault Interest Accrual

```
dailyRate = APY / 365
accrued = principal × (1 + dailyRate)^daysElapsed - principal

With 8% APY:
- After 1 day: principal × 0.000219
- After 30 days: principal × 0.00657
- After 365 days: principal × 0.08
```

### Loan Tier System

```
Tier       Score Range  Max Loan  Interest
---------  -----------  --------  --------
Platinum   750-850      $500      8%
Gold       650-749      $250      12%
Silver     500-649      $100      18%
Bronze     300-499      $50       24%
No Loan    <300         $0        0%
```

## Integration Points

### 1. Wallet Connection
- User clicks "Connect Wallet"
- WalletMultiButton modal opens
- User selects wallet (Phantom, Solflare, etc.)
- Connection established
- Balances fetched and cached

### 2. Credit Scoring
- User inputs activity metrics
- Frontend calculates score immediately
- POST /api/score for server validation
- Returns tier, max loan, APY
- UI updates loan options

### 3. Lending
- Lender selects tier and amount
- LocalStorage updated
- Notification sent
- Voice alert played

### 4. Borrowing
- Borrower applies for loan
- Score checked against tier
- Approval/rejection determined
- Loan added to history if approved

## Security Architecture

### Client-Side Security
```
✅ No private keys stored
✅ Wallet adapter handles signing
✅ Input validation before API calls
✅ Type-safe Solana interactions
```

### Server-Side Security
```
✅ Input validation on all endpoints
✅ Type checking for scoring inputs
✅ Rate limiting (future)
✅ HTTPS-only in production
```

### Blockchain Security
```
✅ No custom signing logic
✅ Use wallet adapter for all transactions
✅ Validate addresses before use
✅ Check account ownership
```

## Scalability Considerations

### Current (MVP)
- LocalStorage: ~5MB limit per domain
- API responses: No caching layer
- Balance updates: 30-second polling

### Phase 2 (Growth)
- Add Redis for session management
- Implement GraphQL for efficient queries
- Use WebSocket for real-time updates
- Add transaction batching

### Phase 3 (Scale)
- Database for persistent storage
- Queue system for async operations
- CDN for static assets
- Load balancing for API tier

## Development Workflow

```
1. Feature Development
   ├─ Create feature branch
   ├─ Update components/hooks
   ├─ Test locally on devnet
   └─ Create pull request

2. Testing Strategy
   ├─ Unit tests for scoring algorithm
   ├─ Integration tests for API endpoints
   ├─ E2E tests for wallet flows
   └─ Manual testing on devnet

3. Deployment
   ├─ Merge to main
   ├─ Run builds & lint checks
   ├─ Deploy to staging
   ├─ Deploy to production
   └─ Monitor error rates
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── score/route.ts      # Score calculation endpoint
│   │   └── health/route.ts     # Health check
│   ├── layout.tsx              # Root layout with providers
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Home page
│   ├── borrow/page.tsx         # Borrowing flow
│   ├── lend/page.tsx           # Lending dashboard
│   ├── save/page.tsx           # Savings vaults
│   ├── score/page.tsx          # Score display
│   └── bridge/page.tsx         # Bridge simulator
│
├── components/
│   ├── solana-provider.tsx     # Wallet adapter wrapper
│   ├── root-layout-client.tsx  # Client layout wrapper
│   ├── wallet-connect.tsx      # Wallet UI
│   ├── nav-bar.tsx             # Navigation
│   ├── loan-wizard.tsx         # Borrowing flow
│   ├── pool-selector.tsx       # Lending interface
│   └── [other-components]
│
├── hooks/
│   ├── use-chainvault-state.ts # Main state hook
│   └── use-solana-wallet.ts    # Solana wallet hook
│
└── lib/
    ├── scoring.ts             # Credit scoring engine
    ├── storage.ts             # State management
    ├── vaults.ts              # Vault calculations
    └── solana-client.ts        # Solana utilities
```

## Future Architecture

### Phase 2: Smart Contracts
```
Anchor Programs:
├── lending_pool
│   ├── create_pool()
│   ├── deposit()
│   ├── withdraw()
│   └── borrow()
├── credit_oracle
│   ├── update_score()
│   ├── get_score()
│   └── tier_from_score()
└── vault_manager
    ├── create_vault()
    ├── contribute()
    └── claim_interest()
```

### Phase 3: Indexing
```
Services:
├── Helius Indexer
│   ├── Monitor deposits
│   ├── Track transactions
│   └── Alert on events
└── The Graph
    ├── Query historical data
    ├── Aggregate statistics
    └── Build dashboards
```

## Performance Metrics

### Current Targets
- Page load: <2s
- API response: <200ms
- Score calculation: <50ms
- Balance refresh: <1s

### Future Targets
- P95 response time: <100ms
- 99.9% uptime
- Support 10k+ concurrent users
- <100ms balance updates

## Monitoring & Analytics

### Key Metrics
```
├── User Metrics
│   ├── Active users
│   ├── Loan applications
│   ├── Deposit volume
│   └── Repayment rate
├── Technical Metrics
│   ├── API latency
│   ├── Error rates
│   ├── RPC availability
│   └── Balance cache hits
└── Business Metrics
    ├── Total value locked (TVL)
    ├── Average loan size
    ├── Tier distribution
    └── Interest accrual
```

## Documentation Index

- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SOLANA_INTEGRATION.md](./SOLANA_INTEGRATION.md) - Solana details
- [ARCHITECTURE.md](./ARCHITECTURE.md) - This file
