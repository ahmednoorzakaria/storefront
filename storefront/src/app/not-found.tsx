import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="container"
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <p className="section-label">Lost In The Collection</p>
        <h1 className="page-heading" style={{ color: "var(--gold)", marginBottom: 16 }}>
          404
        </h1>
        <p className="body-copy" style={{ marginBottom: 28, maxWidth: 420 }}>
          The page you were looking for slipped off the runway. Let&apos;s get you back to the storefront.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
