import Link from "next/link";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
      <svg width={compact ? 26 : 30} height={compact ? 40 : 46} viewBox="0 0 32 48" fill="none">
        <circle cx="16" cy="5" r="4" fill="var(--gold)" />
        <path
          d="M10 12C8 14 6 18 7 24H9L7 44L16 40L25 44L23 24H25C26 18 24 14 22 12C20 10 12 10 10 12Z"
          fill="var(--gold)"
        />
      </svg>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            color: "var(--gold)",
            fontFamily: "var(--font-display)",
            fontSize: compact ? 20 : 24,
            fontWeight: 700,
            letterSpacing: "0.2em",
          }}
        >
          NAISTYLES
        </span>
        <span
          style={{
            marginTop: 4,
            color: "var(--gold)",
            fontSize: compact ? 8 : 9,
            fontWeight: 300,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          Nairobi Fashion
        </span>
      </span>
    </Link>
  );
}
