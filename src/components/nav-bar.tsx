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
      {/* 3-column grid: logo | nav links | actions — nothing can overlap */}
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3">

        {/* LEFT — Logo (always shrinks last) */}
        <Link
          href="/"
          className="flex items-center gap-2 animate-glow text-base font-semibold text-cyan-300 whitespace-nowrap"
        >
          <Image
            src="/chainvault-logo.png"
            alt="ChainVault logo"
            width={30}
            height={30}
            className="rounded-full border border-white/10 bg-slate-900/80 p-0.5"
            priority
          />
          <span>ChainVault</span>
        </Link>

        {/* CENTER — Nav links, hidden on mobile (mobile uses bottom dock) */}
        <nav className="hidden md:flex items-center justify-center gap-1 text-sm overflow-hidden">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-full bg-cyan-400/15 px-3 py-1.5 text-cyan-200 font-medium whitespace-nowrap"
                    : "rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-white/5 hover:text-cyan-200 whitespace-nowrap"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* On mobile the center column is empty — wallet sits in RIGHT column */}
        <div className="md:hidden" />

        {/* RIGHT — Theme toggle, notifications, wallet button */}
        <div className="flex items-center gap-2 justify-end whitespace-nowrap">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <NotificationCenter />
          </div>
          {mounted && <WalletConnect />}
        </div>
      </div>

      {/* Mobile bottom dock */}
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
