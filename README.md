# ChainVault MVP

ChainVault is a Next.js MVP that turns the hackathon concept into a working app with:

- Borrower flow with ChainScore calculation and loan approval simulation
- Lender dashboard with risk-tier deposits
- Score dashboard with repayment impact simulation
- Cross-chain bridge event simulation (LI.FI-style UX)
- Voice notifications (browser speech synthesis fallback)

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- LocalStorage-backed demo persistence

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` - landing page
- `/borrow` - borrower loan wizard + ChainScore
- `/lend` - lender deposit + pool overview
- `/score` - score card + repayment simulator + voice alerts
- `/bridge` - bridge simulator + route event history

## Notes

- This version is a complete functional MVP with simulated blockchain integrations.
- It is structured so real Solana programs, Helius indexing, LI.FI SDK, and ElevenLabs APIs can replace current simulation hooks incrementally.
