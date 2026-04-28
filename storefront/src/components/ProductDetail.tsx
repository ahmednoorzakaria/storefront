"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { useCartStore } from "@/store/cart";

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] ?? null);
  const [descOpen, setDescOpen] = useState(false);
  const [delivOpen, setDelivOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const relatedProducts = useMemo(
    () => products.filter((item) => item.slug !== product.slug).slice(0, 4),
    [product.slug],
  );

  const handleAddToCart = () => {
    addItem(product, selectedSize ?? product.sizes[0], 1);
    openCart();
  };

  return (
    <>
      <section style={{ background: "#fffdf8" }}>
        <div>
          <style>{`
            .product-layout {
              display: grid;
              grid-template-columns: 1fr;
            }
            .product-info {
              padding: 20px 16px 96px;
            }
            .product-mobile-trust {
              grid-template-columns: 1fr;
            }
            @media (min-width: 768px) {
              .product-layout {
                grid-template-columns: 1fr 1fr;
                gap: 64px;
                max-width: 1280px;
                margin: 0 auto;
                padding: 48px 24px;
              }
              .product-info {
                padding: 24px 16px 100px;
              }
              .product-mobile-trust {
                grid-template-columns: repeat(3, 1fr);
              }
            }
          `}</style>
          <div className="product-layout">
            <ProductGallery product={product} activeImage={activeImage} setActiveImage={setActiveImage} />
            <ProductInfo
              product={product}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              descOpen={descOpen}
              setDescOpen={setDescOpen}
              delivOpen={delivOpen}
              setDelivOpen={setDelivOpen}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </section>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 50,
          background: "rgba(255, 253, 248, 0.98)",
          borderTop: "1px solid var(--border)",
          padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
          display: "flex",
          gap: "12px",
          backdropFilter: "blur(12px)",
        }}
      >
        <style>{`
          .mobile-sticky-cta { display: flex; }
          @media (min-width: 768px) { .mobile-sticky-cta { display: none !important; } }
        `}</style>
        <div className="mobile-sticky-cta" style={{ width: "100%", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid var(--border)",
              padding: "0 16px",
              minWidth: "100px",
            }}
          >
            <span
              style={{ color: "#C9A84C", fontSize: "14px", fontFamily: "Montserrat", fontWeight: 500 }}
            >
              KSh {product.price.toLocaleString()}
            </span>
          </div>
          <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <RelatedProducts products={relatedProducts} />
    </>
  );
}

function ProductGallery({
  product,
  activeImage,
  setActiveImage,
}: {
  product: Product;
  activeImage: string;
  setActiveImage: (value: string) => void;
}) {
  return (
    <div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", background: "#111" }}>
        <Image src={activeImage} alt={product.name} fill sizes="100vw" style={{ objectFit: "cover" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        {product.images.slice(0, 3).map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            style={{
              position: "relative",
              aspectRatio: "1 / 1.2",
              padding: 0,
              border: activeImage === image ? "1px solid #C9A84C" : "1px solid #1C1C1C",
              background: "#111",
            }}
          >
            <Image src={image} alt={product.name} fill sizes="33vw" style={{ objectFit: "cover" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductInfo({
  product,
  selectedSize,
  setSelectedSize,
  descOpen,
  setDescOpen,
  delivOpen,
  setDelivOpen,
  onAddToCart,
}: {
  product: Product;
  selectedSize: null | string;
  setSelectedSize: (value: string | null) => void;
  descOpen: boolean;
  setDescOpen: (value: boolean) => void;
  delivOpen: boolean;
  setDelivOpen: (value: boolean) => void;
  onAddToCart: () => void;
}) {
  const sizes = product.sizes.length ? product.sizes : ["XS", "S", "M", "L", "XL", "XXL"];
  const compareAt = product.originalPrice ?? Math.round(product.price * 1.2);
  const savePercent = Math.round(((compareAt - product.price) / compareAt) * 100);

  return (
    <div className="product-info">
      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "11px",
          color: "var(--muted)",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}
      >
        <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
          Home
        </Link>
        {" > "}
        <Link href="/shop" style={{ color: "var(--muted)", textDecoration: "none" }}>
          {product.category}
        </Link>
        {" > "}
        <span style={{ color: "var(--off-white)" }}>{product.name}</span>
      </p>

      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400,
          fontSize: "clamp(26px, 4vw, 38px)",
          color: "var(--off-white)",
          lineHeight: 1.15,
          marginBottom: "12px",
          letterSpacing: "0.02em",
        }}
      >
        {product.name}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ color: "#C9A84C", fontSize: "14px", letterSpacing: "2px" }}>★★★★★</span>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "var(--muted)" }}>47 reviews</span>
        <span style={{ color: "var(--border)" }}>|</span>
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "var(--muted)" }}>124 sold</span>
      </div>

      <div style={{ marginBottom: "6px" }}>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            fontSize: "24px",
            color: "#C9A84C",
          }}
        >
          KSh {product.price.toLocaleString()}
        </span>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "15px",
            color: "var(--muted)",
            textDecoration: "line-through",
            marginLeft: "12px",
          }}
        >
          KSh {compareAt.toLocaleString()}
        </span>
        <span
          style={{
            background: "#C9A84C",
            color: "#0A0A0A",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 8px",
            marginLeft: "10px",
            letterSpacing: "0.05em",
          }}
        >
          SAVE {savePercent}%
        </span>
      </div>

      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: "11px",
          color: "var(--muted)",
          fontStyle: "italic",
          marginBottom: "24px",
        }}
      >
        🔥 32 people are viewing this right now
      </p>

      <div style={{ height: "1px", background: "var(--border)", marginBottom: "24px" }} />

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--off-white)",
            }}
          >
            Select Size {selectedSize ? <span style={{ color: "#C9A84C" }}>- {selectedSize}</span> : null}
          </span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "11px",
              color: "#C9A84C",
            }}
          >
            True to size fit
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              style={{
                width: "48px",
                height: "48px",
                background: selectedSize === size ? "#fff7e4" : "#ffffff",
                border: selectedSize === size ? "2px solid #C9A84C" : "1px solid var(--border)",
                color: selectedSize === size ? "#8a6d2e" : "var(--off-white)",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "12px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "20px",
          padding: "10px 14px",
          background: "#fffaf2",
          border: "1px solid var(--border)",
        }}
      >
        <span
          style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4CAF50", display: "inline-block", flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "11px",
            color: "var(--off-white)",
            letterSpacing: "0.05em",
          }}
        >
          {product.stockLeft ? `In Stock - Only ${product.stockLeft} left` : "In Stock - Ships within 24 hours"}
        </span>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <style>{`
          .desktop-add-btn { display: flex; }
          @media (max-width: 767px) { .desktop-add-btn { display: none !important; } }
        `}</style>
        <button
          className="btn-primary desktop-add-btn"
          style={{ width: "100%", justifyContent: "center", padding: "18px", fontSize: "13px" }}
          onClick={onAddToCart}
        >
          Add to Cart
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "8px",
          marginBottom: "24px",
          padding: "12px",
          background: "#ffffff",
          border: "1px solid var(--border)",
        }}
        className="product-mobile-trust"
      >
        {[
          { icon: "🚚", label: "Free delivery in Nairobi" },
          { icon: "🔄", label: "7-day returns" },
          { icon: "🔒", label: "Secure checkout" },
        ].map((trust, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <span style={{ fontSize: "16px", display: "block", marginBottom: "4px" }}>{trust.icon}</span>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "9px",
                color: "var(--muted)",
                letterSpacing: "0.05em",
                display: "block",
              }}
            >
              {trust.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setDescOpen(!descOpen)}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--off-white)",
            }}
          >
            Product Details
          </span>
          <span style={{ color: "#C9A84C", fontSize: "18px" }}>{descOpen ? "−" : "+"}</span>
        </button>
        {descOpen ? (
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "13px",
              color: "var(--muted)",
              lineHeight: 1.8,
              paddingBottom: "16px",
            }}
          >
            {product.description} Designed for effortless styling in {product.color.toLowerCase()} with size options in{" "}
            {sizes.join(", ")}.
            <br />
            <br />
            Material and care details are shared after order confirmation. Handle gently and store away from direct heat.
          </p>
        ) : null}
      </div>

      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => setDelivOpen(!delivOpen)}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--off-white)",
            }}
          >
            Delivery & Returns
          </span>
          <span style={{ color: "#C9A84C", fontSize: "18px" }}>{delivOpen ? "−" : "+"}</span>
        </button>
        {delivOpen ? (
          <div style={{ paddingBottom: "16px" }}>
            {[
              { zone: "Nairobi CBD & Westlands", time: "Same day / next day", cost: "Free above KSh 3,000" },
              { zone: "Nairobi suburbs", time: "1–2 business days", cost: "KSh 200" },
              { zone: "Outside Nairobi", time: "2–4 business days", cost: "KSh 400" },
            ].map((delivery, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  gap: 12,
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "12px", color: "var(--muted)" }}>
                  {delivery.zone}
                </span>
                <div style={{ textAlign: "left" }}>
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: "12px",
                      color: "var(--off-white)",
                      display: "block",
                    }}
                  >
                    {delivery.time}
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "11px", color: "#C9A84C" }}>
                    {delivery.cost}
                  </span>
                </div>
              </div>
            ))}
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: "11px",
                color: "var(--muted)",
                marginTop: "12px",
                lineHeight: 1.7,
              }}
            >
              Returns accepted within 7 days of delivery. Item must be unworn, unwashed, with tags attached. Contact
              us via WhatsApp to initiate a return.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section style={{ padding: "48px 0", background: "#fffaf2", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <p className="section-label" style={{ marginBottom: "8px" }}>
          Complete the Look
        </p>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "22px",
            color: "var(--muted)",
            marginBottom: "28px",
          }}
        >
          Styled together by our team
        </p>
        <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2px" }}>
          <style>{`
            @media (min-width: 768px) {
              .related-grid { grid-template-columns: repeat(4, 1fr) !important; }
            }
          `}</style>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
