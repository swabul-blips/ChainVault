"use client";

import { LiFiBridgeWidget } from "@/components/lifi-bridge-widget";
import { NavBar } from "@/components/nav-bar";
import { useChainVaultState } from "@/hooks/use-chainvault-state";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function BridgePage() {
  const state = useChainVaultState();
  const events = state.bridgeEvents;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="animate-fade-scale mx-auto grid max-w-6xl gap-6 px-6 py-10 pb-24 md:grid-cols-[1fr_360px] md:pb-10">
        <LiFiBridgeWidget />
        <section className="glass-card animate-rise p-6">
          <h2 className="text-xl font-semibold">Bridge Events</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {events.slice(0, 8).map((event, idx) => (
              <li key={`${event.routeId}-${idx}`} className="rounded-md border border-white/10 p-2">
                {event.amount} {event.token}: {event.fromChain} to {event.toChain} ({event.routeId})
              </li>
            ))}
            {events.length === 0 && <li className="text-slate-500">No bridge events yet.</li>}
          </ul>
        </section>
      </main>
    </div>
  );
}
