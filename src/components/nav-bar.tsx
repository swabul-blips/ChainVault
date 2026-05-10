"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(2, 6, 23, 0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 1.25rem",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              color: "#67e8f9",
              fontWeight: 700,
              fontSize: "1.1rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <Image
              src="/chainvault-logo.png"
              alt="ChainVault"
              width={32}
              height={32}
              priority
              style={{
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(15,23,42,0.8)",
                padding: "2px",
              }}
            />
            <span>ChainVault</span>
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                background: "rgba(34,211,238,0.15)",
                border: "1px solid rgba(34,211,238,0.3)",
                color: "#67e8f9",
                borderRadius: "999px",
                padding: "0.1rem 0.45rem",
                letterSpacing: "0.04em",
                marginLeft: "0.15rem",
              }}
            >
              DEVNET
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              flexShrink: 1,
              overflow: "hidden",
            }}
            className="desktop-nav"
          >
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.85rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#a5f3fc" : "#94a3b8",
                    background: active ? "rgba(34,211,238,0.12)" : "transparent",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all 150ms ease",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Wallet + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            {/* Wallet button — always shown */}
            {mounted && (
              <WalletMultiButton
                style={{
                  height: "36px",
                  fontSize: "0.78rem",
                  padding: "0 1rem",
                  borderRadius: "999px",
                  background: "linear-gradient(120deg, #0891b2, #2563eb)",
                  border: "none",
                  fontFamily: "inherit",
                  fontWeight: 600,
                  color: "#fff",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              />
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="hamburger-btn"
              style={{
                display: "none",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "0.4rem 0.5rem",
                fontSize: "1.1rem",
                lineHeight: 1,
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {menuOpen && (
          <div
            style={{
              background: "rgba(2, 6, 23, 0.97)",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              padding: "0.75rem 1.25rem 1rem",
            }}
            className="mobile-menu"
          >
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "block",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#a5f3fc" : "#cbd5e1",
                    background: active ? "rgba(34,211,238,0.10)" : "transparent",
                    textDecoration: "none",
                    marginBottom: "0.25rem",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Inline responsive styles */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .hamburger-btn { display: none !important; }
        .mobile-menu { display: block; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
