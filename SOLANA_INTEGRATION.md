# Solana Integration Guide

This document outlines the Solana blockchain integration in ChainVault.

## Architecture

### Wallet Integration
```
User → Wallet Adapter (UI) → @solana/web3.js → RPC Endpoint → Solana Network
        ↓
   Phantom/Solflare/Torus/Ledger
```

### State Flow
```
Wallet Connected → Get Balances → Subscribe to Events → Update UI
                ↓
           Check USDC Balance
           Check SOL Balance (for gas)
```

## Receiving Address

If you want to receive funds directly, use the following public address:

`0x311935Cd80B76769bF2ecC9D8Ab7635b2139cf82`

> Note: This address is for receiving only and does not need to be stored in code unless you are hard-coding a wallet destination for a deployment or testing flow.

## Key Integration Points

### 1. Wallet Connection (`src/components/solana-provider.tsx`)
```typescript
export function SolanaProvider({ children, network = "devnet" }: SolanaProviderProps)
```

Wraps the entire application with:
- `ConnectionProvider` - Solana network connection
- `WalletProvider` - Multi-wallet support
- `WalletModalProvider` - Wallet selection UI

### 2. Balance Management (`src/hooks/use-solana-wallet.ts`)
```typescript
export function useSolanaWallet() {
  const { connection } = useConnection();
  const wallet = useWallet();
  
  // Returns: {
  //   ...wallet (from @solana/wallet-adapter-react),
  //   balances: { sol, usdc, loading },
  //   refreshBalances: () => Promise<void>
  // }
}
```

### 3. Solana Client Utilities (`src/lib/solana-client.ts`)
```typescript
// Network configuration
getConnection(network: Network): Connection
NETWORKS = { mainnet, devnet, localnet }

// Token operations
getUsdcMint(network: Network): PublicKey
getUsdcBalance(connection, walletAddress, network): Promise<number>
getSolBalance(connection, walletAddress): Promise<number>

// Utilities
validatePublicKey(address: string): PublicKey | null
confirmTransaction(connection, signature): Promise<boolean>
```

## USDC Token Integration

### Token Mints
```typescript
// Mainnet
const USDC_MINT = "EPjFWaLb3odccxFSrv3C6MrT3AxYqP1Vm2KaMtWvcs"

// Devnet
const USDC_MINT_DEVNET = "4zMMC9srt5Ri5X14GAgIYY3W6YvV3BJKBjAPtVooS6T"
```

### Associated Token Account (ATA)
```typescript
import { getAssociatedTokenAddress } from "@solana/spl-token";

const ataAddress = await getAssociatedTokenAddress(
  USDC_MINT,
  walletAddress
);
```

## Transaction Handling

### Creating Transactions
```typescript
import { Transaction, SystemProgram } from "@solana/web3.js";

const transaction = new Transaction()
  .add(
    SystemProgram.transfer({
      fromPubkey: fromAddress,
      toPubkey: toAddress,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
```

### Signing Transactions
```typescript
import { useWallet } from "@solana/wallet-adapter-react";

const { signTransaction } = useWallet();
const signedTx = await signTransaction(transaction);
```

### Sending Transactions
```typescript
import { sendAndConfirmTransaction } from "@solana/web3.js";

const signature = await connection.sendTransaction(signedTx, []);
const confirmed = await confirmTransaction(connection, signature);
```

## Environment Configuration

### Network Selection
```typescript
// In env:
NEXT_PUBLIC_SOLANA_NETWORK=devnet  // or mainnet-beta

// In code:
const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
const connection = getConnection(network);
```

### RPC Endpoint
```typescript
// Default: Solana official RPC
// Custom endpoint via:
NEXT_PUBLIC_SOLANA_RPC_ENDPOINT=https://your-rpc.com

// Used in:
const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 
                 clusterApiUrl(network);
```

## Data Flow Examples

### Example 1: Fetching Wallet Balances

```
1. useWallet() → wallet.publicKey
2. useSolanaWallet() → call refreshBalances()
3. getSolBalance(connection, publicKey)
   → connection.getBalance(publicKey)
   → return balance / LAMPORTS_PER_SOL
4. getUsdcBalance(connection, publicKey, network)
   → getAssociatedTokenAddress(USDC_MINT, publicKey)
   → connection.getTokenAccountBalance(ata)
   → return balance.value.uiAmount
5. Update balances state
6. Render in UI
```

### Example 2: Calculating ChainScore

```
1. User fills out wallet activity form
2. Frontend calls POST /api/score
3. API calls computeChainScore(inputs)
4. Returns score, tier, and lending terms
5. Frontend displays approval/rejection
6. If approved, show loan amount options
```

## Supported Wallets

| Wallet | Support | Notes |
|--------|---------|-------|
| Phantom | ✅ Full | Most popular |
| Solflare | ✅ Full | Multi-chain |
| Torus | ✅ Full | Social login |
| Ledger | ✅ Full | Hardware |

## Error Handling

### Common Errors

```typescript
// Connection errors
try {
  const balance = await connection.getBalance(publicKey);
} catch (error) {
  console.error("RPC Connection failed", error);
  // Fallback to cached value
}

// Wallet not found
if (!wallet.publicKey) {
  // Show wallet connection modal
}

// Transaction rejected
try {
  const signature = await connection.sendTransaction(tx, []);
} catch (error) {
  if (error.message.includes("User rejected")) {
    // User cancelled transaction
  }
}
```

## Testing

### Devnet Testing
```bash
# 1. Switch to devnet in wallet
# 2. Request SOL airdrop:
solana airdrop 5 <wallet_address> --url devnet

# 3. Get USDC on devnet:
# Use: https://spl-token-faucet.com/?token-name=usdc-dev
```

### Local Testing with Anchor
```bash
# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Start local validator
solana-test-validator

# Build and deploy programs
anchor build
anchor deploy
```

## Performance Optimization

### Balance Caching
```typescript
// Auto-refresh every 30 seconds
const interval = setInterval(refreshBalances, 30000);

// Manual refresh on demand
const { refreshBalances } = useSolanaWallet();
await refreshBalances();
```

### Network Optimization
- Use `confirmed` commitment for faster confirmation
- Implement exponential backoff for retries
- Cache RPC calls with appropriate TTL

## Security Checklist

- ✅ Never store private keys in localStorage
- ✅ Use wallet adapter for all signing
- ✅ Validate addresses before transactions
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on API endpoints
- ✅ Validate all inputs server-side

## Roadmap

### Current
- ✅ Wallet connection
- ✅ Balance display
- ✅ Score calculation API

### Near Term
- [ ] SPL token transfers
- [ ] Associated token account creation
- [ ] Transaction history
- [ ] Gas estimation

### Medium Term
- [ ] Anchor program integration
- [ ] Lending contract interaction
- [ ] Pool management smart contracts
- [ ] Liquidation logic

### Long Term
- [ ] NFT collateral
- [ ] DAO governance
- [ ] Multi-sig wallets
- [ ] Yield farming

## Resources

- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [Wallet Adapter Docs](https://github.com/solana-labs/wallet-adapter)
- [Anchor Framework](https://www.anchor-lang.com/)
- [SPL Token Program](https://spl.solana.com/token)
- [Solana Cookbook](https://solanacookbook.com/)

## Troubleshooting

### Wallet not connecting
1. Check if wallet extension is installed
2. Verify network matches (devnet in wallet vs app)
3. Check browser console for errors
4. Try different wallet (Phantom vs Solflare)

### Balances not updating
1. Verify RPC endpoint is responsive
2. Check if account has correct token mint
3. Wait for 30-second auto-refresh
4. Try manual refresh button

### Transactions failing
1. Check SOL balance (need for gas)
2. Verify USDC balance
3. Check transaction size limit (1232 bytes)
4. Try on devnet first
