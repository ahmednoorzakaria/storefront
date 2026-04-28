import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";

export default function ShopByCategory() {
  return (
    <section className="section-pad">
      <div className="container">
        <p className="section-label">Shop by category</p>
        <h2 className="page-heading" style={{ marginBottom: 28 }}>
          Build the wardrobe around your mood.
        </h2>
        <div className="grid-responsive-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              style={{
                position: "relative",
                minHeight: 260,
                overflow: "hidden",
                border: "1px solid var(--border)",
                borderRadius: 20,
              }}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(10,10,10,0.1), rgba(10,10,10,0.76))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  insetInline: 0,
                  bottom: 0,
                  padding: 18,
                  display: "grid",
                  gap: 6,
                }}
              >
                <span className="eyebrow">{category.tag}</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 7vw, 2.5rem)" }}>
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
