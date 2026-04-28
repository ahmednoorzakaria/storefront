import { BadgeCheck, ShieldCheck, Truck, Undo2 } from "lucide-react";

const TRUST = [
  { icon: Truck, title: "Nairobi Delivery", copy: "Same-day dispatch on stocked pieces." },
  { icon: BadgeCheck, title: "Curated Quality", copy: "Premium fabrics and tailored finishing." },
  { icon: ShieldCheck, title: "Guest Checkout", copy: "Fast ordering with no account required." },
  { icon: Undo2, title: "Easy Exchanges", copy: "Flexible support for size and fit swaps." },
];

export default function TrustBar() {
  return (
    <section style={{ borderBottom: "1px solid var(--border)", background: "#fffbf2" }}>
      <div className="grid-responsive-trust container">
        {TRUST.map(({ icon: Icon, title, copy }, i) => (
          <div
            key={i}
            className="trust-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "20px 16px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <Icon size={20} color="var(--gold)" strokeWidth={1.8} />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                {title}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
