"use client";

import { useMemo, useState } from "react";
import { useCartStore } from "@/store/cart";

const deliveryOptions = [
  { id: "cbd", label: "Nairobi CBD", price: 0 },
  { id: "suburbs", label: "Nairobi Suburbs", price: 200 },
  { id: "outside", label: "Outside Nairobi", price: 400 },
];

export default function CheckoutClient() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const [delivery, setDelivery] = useState(deliveryOptions[0]);
  const [placed, setPlaced] = useState(false);
  const [orderReference, setOrderReference] = useState("");

  const total = useMemo(() => subtotal + delivery.price, [delivery.price, subtotal]);
  const hasItems = items.length > 0;

  if (placed) {
    return (
      <section className="section-pad">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="panel" style={{ padding: 28, textAlign: "center" }}>
            <p className="section-label">Order placed</p>
            <h1 className="page-heading" style={{ marginBottom: 12 }}>
              Thank you. Your Naistyles order is in.
            </h1>
            <p className="body-copy" style={{ marginBottom: 22 }}>
              We&apos;ve saved your details and the team will confirm delivery shortly. Reference: {orderReference}
            </p>
            <button type="button" className="btn-primary" onClick={() => setPlaced(false)}>
              Start Another Order
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pad">
      <div className="container">
        <div style={{ marginBottom: 26 }}>
          <p className="section-label">Guest checkout</p>
          <h1 className="page-heading" style={{ marginBottom: 12 }}>
            Fast checkout, no account required.
          </h1>
          <p className="body-copy" style={{ maxWidth: 620 }}>
            Add your contact details, delivery address, and we&apos;ll handle the rest. Your order summary stays visible
            all the way through.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!hasItems) return;
            setOrderReference(`NST-${Math.floor(Math.random() * 90000) + 10000}`);
            clearCart();
            setPlaced(true);
          }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <SectionCard title="Contact">
              <Input label="Full name" />
              <Input label="Email address" type="email" />
              <Input label="Phone number" />
            </SectionCard>

            <SectionCard title="Delivery address">
              <Input label="Street address" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                <Input label="City" />
                <Input label="County" />
              </div>
            </SectionCard>

            <SectionCard title="Delivery method">
              <div style={{ display: "grid", gap: 12 }}>
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      padding: 14,
                      border: `1px solid ${delivery.id === option.id ? "var(--gold)" : "var(--border)"}`,
                      background: delivery.id === option.id ? "rgba(201,168,76,0.08)" : "transparent",
                    }}
                  >
                    <span>
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery.id === option.id}
                        onChange={() => setDelivery(option)}
                        style={{ marginRight: 10 }}
                      />
                      {option.label}
                    </span>
                    <span>{option.price === 0 ? "Free" : `KSh ${option.price}`}</span>
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Order notes">
              <label style={{ display: "grid", gap: 8 }}>
                <span className="eyebrow">Special instructions</span>
                <textarea
                  rows={5}
                  placeholder="Anything we should know about delivery?"
                  style={inputStyle}
                />
              </label>
            </SectionCard>
          </div>

          <aside
            className="panel"
            style={{
              padding: 18,
              height: "fit-content",
              position: "sticky",
              top: 110,
              alignSelf: "start",
            }}
          >
            <p className="section-label">Order summary</p>
            <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
              {items.length === 0 ? (
                <p className="body-copy" style={{ margin: 0 }}>
                  Your cart is empty. Add a product from the shop to continue.
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.key} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontWeight: 500 }}>{item.name}</p>
                      <p className="eyebrow" style={{ margin: 0 }}>
                        {item.size} x {item.quantity}
                      </p>
                    </div>
                    <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
            <div className="divider" style={{ marginBottom: 14 }} />
            <SummaryRow label="Subtotal" value={`KSh ${subtotal.toLocaleString()}`} />
            <SummaryRow label="Delivery" value={delivery.price === 0 ? "Free" : `KSh ${delivery.price}`} />
            <SummaryRow label="Total" value={`KSh ${total.toLocaleString()}`} strong />
            <button
              type="submit"
              className="btn-primary"
              disabled={!hasItems}
              style={{
                width: "100%",
                marginTop: 18,
                opacity: hasItems ? 1 : 0.5,
                cursor: hasItems ? "pointer" : "not-allowed",
              }}
            >
              {hasItems ? "Place Order" : "Add items to continue"}
            </button>
          </aside>
        </form>
      </div>
    </section>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel" style={{ padding: 18, display: "grid", gap: 14 }}>
      <p className="section-label" style={{ margin: 0 }}>
        {title}
      </p>
      {children}
    </section>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span className="eyebrow">{label}</span>
      <input type={type} required style={inputStyle} />
    </label>
  );
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, color: strong ? "var(--gold)" : "var(--off-white)" }}>
      <span>{label}</span>
      <span style={{ fontWeight: strong ? 600 : 400 }}>{value}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  minHeight: 48,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--white)",
  padding: "12px 14px",
};
