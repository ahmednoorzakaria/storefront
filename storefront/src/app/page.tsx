import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";
import ShopByCategory from "@/components/ShopByCategory";
import TrustBar from "@/components/TrustBar";
import { products } from "@/lib/data";

const BEST_SELLERS = products.slice(0, 4).map((product, index) => ({
  rank: String(index + 1).padStart(2, "0"),
  slug: product.slug,
  name: product.name,
  price: `KSh ${product.price.toLocaleString()}`,
  tag: product.stockLeft ? `Only ${product.stockLeft} left` : "Customer favorite",
  image: product.images[0],
}));

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ShopByCategory />
      <BestSellers />
      <NewArrivals />
      <Footer />
    </>
  );
}

function BestSellers() {
  return (
    <section style={{ background: "#fffaf2", padding: "56px 0", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "24px",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: "8px" }}>
              Best Sellers
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: "28px",
                color: "var(--muted)",
                margin: 0,
              }}
            >
              What everyone is buying
            </p>
          </div>
          <Link
            href="/shop?sort=best-selling"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#C9A84C",
              textDecoration: "none",
            }}
          >
            View All →
          </Link>
        </div>

        <div>
          <style>{`
            .bestseller-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 12px;
            }
            .bestseller-card img {
              transition: transform 500ms ease;
            }
            .bestseller-card:hover img {
              transform: scale(1.04);
            }
            @media (min-width: 480px) {
              .bestseller-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }
            @media (min-width: 768px) {
              .bestseller-grid {
                grid-template-columns: repeat(4, 1fr);
                gap: 16px;
              }
            }
          `}</style>
          <div className="bestseller-grid">
            {BEST_SELLERS.map((item) => (
              <div
                key={item.slug}
                className="bestseller-card"
                style={{
                  background: "#ffffff",
                  position: "relative",
                  cursor: "pointer",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    zIndex: 2,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "42px",
                    fontWeight: 700,
                    color: "rgba(201,168,76,0.18)",
                    lineHeight: 1,
                  }}
                >
                  {item.rank}
                </div>

                <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, 25vw"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ padding: "12px 10px 16px" }}>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "9px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#C9A84C",
                      marginBottom: "6px",
                    }}
                  >
                    {item.tag}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      color: "#171717",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "13px",
                      color: "#C9A84C",
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    {item.price}
                  </p>
                </div>

                <Link
                  href={`/products/${item.slug}`}
                  className="btn-primary"
                  style={{ display: "block", textAlign: "center", fontSize: "11px", margin: "0 10px 14px" }}
                >
                  Shop Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
