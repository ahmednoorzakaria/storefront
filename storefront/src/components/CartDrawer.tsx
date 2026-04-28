"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <>
      {isOpen ? (
        <div
          onClick={closeCart}
          style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(10, 10, 10, 0.7)" }}
        />
      ) : null}

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 80,
          width: "min(100vw, 430px)",
          height: "100dvh",
          background: "var(--charcoal)",
          borderLeft: "1px solid var(--border)",
          transform: isOpen ? "translateX(0)" : "translateX(110%)",
          transition: "transform var(--transition-base)",
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div
          style={{
            padding: "18px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: 6 }}>
              Your cart
            </p>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>{items.length} item(s)</p>
          </div>
          <button type="button" onClick={closeCart} style={iconButtonStyle}>
            <X size={18} />
          </button>
        </div>

        <div style={{ overflow: "auto", padding: 16, display: "grid", gap: 14 }}>
          {items.length === 0 ? (
            <div className="panel" style={{ padding: 18 }}>
              <p style={{ marginTop: 0, marginBottom: 10 }}>Your cart is still empty.</p>
              <p className="body-copy" style={{ margin: 0 }}>
                Add a few pieces from the shop and they&apos;ll appear here instantly.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.key}
                className="panel"
                style={{ padding: 12, display: "grid", gridTemplateColumns: "76px minmax(0, 1fr)", gap: 10 }}
              >
                <div style={{ position: "relative", aspectRatio: "4 / 5" }}>
                  <Image src={item.image} alt={item.name} fill sizes="88px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontWeight: 500 }}>{item.name}</p>
                    <p className="eyebrow" style={{ margin: 0 }}>
                      Size {item.size}
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "inline-flex", border: "1px solid var(--border)" }}>
                      <button
                        type="button"
                        style={qtyButtonStyle}
                        onClick={() => updateQuantity(item.key, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={14} />
                      </button>
                      <div style={{ width: 34, display: "grid", placeItems: "center", fontSize: 14 }}>{item.quantity}</div>
                      <button
                        type="button"
                        style={qtyButtonStyle}
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span style={{ color: "var(--gold)" }}>KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    style={{ justifySelf: "start", border: "none", padding: 0, background: "transparent", color: "var(--muted)" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ borderTop: "1px solid var(--border)", padding: 16, display: "grid", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
            <span>Subtotal</span>
            <strong style={{ color: "var(--gold)" }}>KSh {subtotal.toLocaleString()}</strong>
          </div>
          <Link href="/checkout" className="btn-primary" onClick={closeCart}>
            Proceed to Checkout
          </Link>
          <button type="button" className="btn-ghost" onClick={closeCart}>
            Continue Shopping
          </button>
        </div>
      </aside>
    </>
  );
}

const iconButtonStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  display: "grid",
  placeItems: "center",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--off-white)",
};

const qtyButtonStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  display: "grid",
  placeItems: "center",
  border: "none",
  background: "transparent",
  color: "var(--off-white)",
};
