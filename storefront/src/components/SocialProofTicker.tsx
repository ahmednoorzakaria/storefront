const SIGNALS = [
  '⭐⭐⭐⭐⭐  "The Golden Drape arrived in 2 days — stunning quality" — Amira N.',
  "🛍️  47 orders placed today",
  '⭐⭐⭐⭐⭐  "Exactly as pictured, fast delivery to Mombasa" — Zawadi K.',
  "🔥  The Power Blazer is trending this week",
  '⭐⭐⭐⭐⭐  "I got so many compliments at the event" — Fatuma A.',
  "📦  Free delivery in Nairobi for orders above KSH 3,000",
];

export default function SocialProofTicker() {
  return (
    <div
      style={{
        background: "#fffaf0",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        padding: "10px 0",
      }}
    >
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner {
          display: flex;
          width: max-content;
          animation: ticker 30s linear infinite;
          gap: 64px;
        }
        .ticker-inner:hover { animation-play-state: paused; }
      `}</style>
      <div className="ticker-inner">
        {[...SIGNALS, ...SIGNALS].map((signal, index) => (
          <span
            key={index}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.05em",
              color: "#C9A84C",
              whiteSpace: "nowrap",
            }}
          >
            {signal}
          </span>
        ))}
      </div>
    </div>
  );
}
