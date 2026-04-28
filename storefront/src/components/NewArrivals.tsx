import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

export default function NewArrivals() {
  return (
    <section className="section-pad" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 22,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="section-label">New arrivals</p>
            <h2 className="page-heading">Fresh pieces worth the scroll.</h2>
          </div>
          <Link href="/shop" className="btn-ghost" style={{ width: "100%", maxWidth: 220 }}>
            Explore the shop
          </Link>
        </div>

        <div className="grid-responsive-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
