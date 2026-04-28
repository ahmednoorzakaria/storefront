"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Logo from "@/components/Logo";
import { useCartStore } from "@/store/cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Luxury+Fits", label: "Collections" },
  { href: "/checkout", label: "Checkout" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const openCart = useCartStore((state) => state.openCart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        style={{
          zIndex: 40,
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          background: scrolled ? "rgba(255, 253, 248, 0.98)" : "rgba(255, 253, 248, 0.86)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            gap: 12,
            minHeight: 72,
          }}
        >
          <Logo compact />

          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 28,
            }}
            className="max-md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: "var(--off-white)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
                className="gold-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, alignItems: "center" }}>
            {[Search, User, Heart].map((Icon, index) => (
              <button
                key={index}
                aria-label="Utility action"
                style={{ ...iconButtonStyle, display: "none" }}
                className="hide-mobile"
                type="button"
              >
                <Icon size={18} strokeWidth={1.75} />
              </button>
            ))}

            <button aria-label="Open cart" onClick={openCart} style={iconButtonStyle} type="button">
              <span style={{ position: "relative", display: "inline-flex" }}>
                <ShoppingBag size={18} strokeWidth={1.75} />
                {itemCount > 0 ? (
                  <span
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -10,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: "var(--gold)",
                      color: "var(--obsidian)",
                      fontSize: 10,
                      fontWeight: 700,
                    }}
                  >
                    {itemCount}
                  </span>
                ) : null}
              </span>
            </button>

            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              style={iconButtonStyle}
              className="max-md:grid"
              type="button"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(17, 17, 17, 0.28)",
          }}
        >
          <div
            style={{
              marginLeft: "auto",
              width: "min(92vw, 360px)",
              height: "100%",
              background: "var(--charcoal)",
              borderLeft: "1px solid var(--border)",
              padding: 18,
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <Logo compact />
              <button type="button" onClick={() => setMobileOpen(false)} style={iconButtonStyle}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: "grid", gap: 18 }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    padding: "0 0 14px",
                    fontSize: 13,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const iconButtonStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  display: "grid",
  placeItems: "center",
  border: "1px solid var(--border)",
  background: "rgba(255,255,255,0.72)",
  color: "var(--off-white)",
};
