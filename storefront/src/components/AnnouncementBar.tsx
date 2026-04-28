export default function AnnouncementBar() {
  return (
    <div
      className="announcement-bar"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "#fff7e4",
        padding: "10px 16px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "var(--gold)",
          fontWeight: 400,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Free delivery in Nairobi for orders above KSh 3,000 →
      </p>
    </div>
  );
}
