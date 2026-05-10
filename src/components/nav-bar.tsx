"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationCenter } from "@/components/notification-center";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletConnect } from "@/components/wallet-connect";

const links = [
  { href: "/", label: "Home" },
  { href: "/borrow", label: "Borrow" },
  { href: "/lend", label: "Lend" },
  { href: "/save", label: "Save" },
  { href: "/score", label: "Score" },
  { href: "/bridge", label: "Bridge" },
];

export function NavBar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 animate-glow text-base font-semibold text-cyan-300">
          <Image
            src="/chainvault-logo.png"
            alt="ChainVault logo"
            width={32}
            height={32}
            className="rounded-full border border-white/10 bg-slate-900/80 p-0.5"
            priority
          />
          <span className="hidden sm:inline">ChainVault</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-1 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-full bg-cyan-400/15 px-3 py-1.5 text-cyan-200 font-medium"
                    : "rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-cyan-200"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: theme, notifications, wallet */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <NotificationCenter />
          </div>
          {/* Wallet button – always visible (mounted guard handles SSR) */}
          {mounted && <WalletConnect />}
        </div>
      </div>

      {/* Mobile bottom dock – links only, wallet is in the top bar */}
      <nav className="mobile-dock md:hidden">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "mobile-dock-item active" : "mobile-dock-item"}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
