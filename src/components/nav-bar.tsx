"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationCenter } from "@/components/notification-center";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/borrow", label: "Borrow" },
  { href: "/lend", label: "Lend" },
  { href: "/save", label: "Save" },
  { href: "/score", label: "Score" },
  { href: "/bridge", label: "Bridge" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="animate-glow text-lg font-semibold text-cyan-300">
          ChainVault
        </Link>
        <nav className="hidden gap-4 text-sm md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-full bg-cyan-400/15 px-3 py-1 text-cyan-200"
                    : "rounded-full px-3 py-1 text-slate-300 transition hover:bg-white/5 hover:text-cyan-200"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <NotificationCenter />
        </div>
      </div>
      <nav className="mobile-dock md:hidden">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={active ? "mobile-dock-item active" : "mobile-dock-item"}>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
