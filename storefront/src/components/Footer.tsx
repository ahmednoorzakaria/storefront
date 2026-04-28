import Link from "next/link";
import Logo from "@/components/Logo";

const quickLinks = ["Home", "Shop", "Collections", "Checkout"];
const careLinks = ["Shipping Info", "Returns Policy", "Track Order", "Size Guide"];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "#fffaf2" }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 28 }}>
        <div style={{ marginBottom: "48px" }}>
          <style>{`
            .footer-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 40px;
            }
            @media (min-width: 768px) {
              .footer-grid {
                grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: 48px;
              }
            }
          `}</style>
          <div className="footer-grid">
            <div>
              <Logo compact />
              <p className="body-copy" style={{ maxWidth: 320, marginTop: 18 }}>
                Premium fashion for the modern Nairobi woman. Confident silhouettes, rich textures, and an easy guest
                checkout flow built for mobile-first shopping.
              </p>
            </div>

            <FooterColumn title="Quick links" items={quickLinks} />
            <FooterColumn title="Customer care" items={careLinks} />

            <div>
              <p className="section-label" style={{ marginBottom: 16 }}>
                Follow us
              </p>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {[InstagramIcon, FacebookIcon, TikTokIcon].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    style={{
                      width: 40,
                      height: 40,
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid var(--border)",
                      color: "var(--gold-dim)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.8} />
                  </a>
                ))}
              </div>
              <p className="body-copy" style={{ margin: 0 }}>
                Nairobi, Kenya
              </p>
            </div>
          </div>
        </div>

        <div className="divider" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            paddingTop: 18,
            color: "var(--muted)",
            fontSize: 12,
            flexWrap: "wrap",
          }}
        >
          <span>© 2026 Naistyles. All rights reserved.</span>
          <span>Built for fast, elegant shopping.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="section-label" style={{ marginBottom: 16 }}>
        {title}
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <Link key={item} href={item === "Home" ? "/" : item === "Shop" ? "/shop" : "#"} className="gold-link">
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}

type SocialIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  strokeWidth?: number;
};

function InstagramIcon({ size = 18, strokeWidth = 1.7, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width={size} height={size} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="3.5" strokeWidth={strokeWidth} />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ size = 18, strokeWidth = 1.7, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width={size} height={size} {...props}>
      <path
        d="M13.5 20v-6h2.4l.6-3h-3V9.3c0-.9.4-1.8 1.8-1.8H17V5.1c-.3 0-1.3-.1-2.5-.1-2.4 0-4 1.5-4 4.2V11H8v3h2.5v6"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

function TikTokIcon({ size = 18, strokeWidth = 1.7, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width={size} height={size} {...props}>
      <path d="M14 3v10.2a3.7 3.7 0 1 1-3-3.63" strokeWidth={strokeWidth} />
      <path d="M14 3c1 2.3 2.84 4 5 4.5" strokeWidth={strokeWidth} />
    </svg>
  );
}
