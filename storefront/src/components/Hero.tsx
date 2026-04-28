"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

const HERO_SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80",
    alt: "Naistyles editorial look in black satin",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
    alt: "Naistyles elegant fitted dress",
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ position: "relative", height: "92svh", overflow: "hidden", minHeight: "520px", maxHeight: "760px" }}>
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: "opacity 1000ms ease",
          }}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,10,10,0.90) 30%, rgba(10,10,10,0.45) 70%, rgba(10,10,10,0.2) 100%)",
            }}
          />
        </div>
      ))}

      <div
        className="hide-mobile"
        style={{
          position: "absolute",
          left: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ width: "1px", height: "60px", background: "#C9A84C" }} />
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#C9A84C",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          New Collection
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          padding: "0 16px 72px",
        }}
        className="hero-content-wrapper"
      >
        <style>{`
          @media (max-width: 767px) {
            .hero-content-wrapper {
              align-items: flex-end !important;
            }
            .hero-h1 {
              font-size: clamp(42px, 15vw, 64px) !important;
              line-height: 0.94 !important;
              letter-spacing: 0.03em !important;
            }
            .hero-subtitle {
              font-size: 13px !important;
              letter-spacing: 0.18em !important;
              margin-bottom: 14px !important;
            }
            .hero-tagline {
              font-size: 14px !important;
              margin-bottom: 20px !important;
              max-width: 280px;
            }
          }
          @media (min-width: 768px) {
            .hero-content-wrapper {
              align-items: center !important;
              padding: 0 0 0 100px !important;
            }
            .hero-h1 { font-size: clamp(64px, 10vw, 120px) !important; }
            .hero-subtitle { font-size: clamp(16px, 2vw, 26px) !important; }
            .hero-tagline { font-size: 17px !important; }
            .hero-cta { width: auto !important; }
          }
        `}</style>

        <div style={{ width: "100%", maxWidth: "560px" }}>
          <h1
            className="hero-h1"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "52px",
              letterSpacing: "0.05em",
              color: "#FFFFFF",
              lineHeight: 0.9,
              marginBottom: "10px",
            }}
          >
            NAISTYLES
          </h1>
          <p
            className="hero-subtitle"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "15px",
              letterSpacing: "0.25em",
              color: "#C9A84C",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Nairobi Fashion
          </p>
          <p
            className="hero-tagline"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: "15px",
              letterSpacing: "0.05em",
              color: "#E8E8E8",
              marginBottom: "28px",
            }}
          >
            Style. Confidence. You.
          </p>
          <Link
            href="/shop"
            className="btn-primary hero-cta"
            style={{
              fontSize: "12px",
              width: "100%",
              justifyContent: "center",
              display: "flex",
              minHeight: 50,
            }}
          >
            Shop Now &nbsp;→
          </Link>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
        }}
      >
        {HERO_SLIDES.map((slide, i) => (
          <button
            key={slide.image}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? "28px" : "8px",
              height: "2px",
              background: i === active ? "#C9A84C" : "#555",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 400ms ease",
              borderRadius: "0",
            }}
          />
        ))}
      </div>

      <div
        className="hide-mobile"
        style={{
          position: "absolute",
          right: "24px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#C9A84C",
            writingMode: "vertical-rl",
          }}
        >
          Follow Us
        </span>
        <div style={{ width: "1px", height: "40px", background: "#C9A84C" }} />
        {[InstagramIcon, TikTokIcon, FacebookIcon].map((Icon, i) => (
          <a
            key={i}
            href="#"
            style={{ color: "#FFFFFF", transition: "color 150ms ease" }}
            onMouseEnter={(event) => (event.currentTarget.style.color = "#C9A84C")}
            onMouseLeave={(event) => (event.currentTarget.style.color = "#FFFFFF")}
          >
            <Icon size={18} strokeWidth={1.5} />
          </a>
        ))}
      </div>
    </section>
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
