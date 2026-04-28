"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/data";
import { useCartStore } from "@/store/cart";

export default function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product, product.sizes[0], 1);
    setAdding(true);
    setTimeout(() => {
      setAdding(false);
      setAdded(true);
    }, 600);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="quick-add-wrap"
      style={{
        background: "#ffffff",
        position: "relative",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 16px 36px rgba(24, 24, 24, 0.08)",
      }}
    >
      <style>{`
        .product-card-mobile-add {
          display: flex;
        }
        .product-card-desktop-overlay {
          display: none;
        }
        @media (min-width: 768px) {
          .product-card-mobile-add {
            display: none;
          }
          .product-card-desktop-overlay {
            display: block;
          }
          .quick-add-wrap .quick-add-btn {
            opacity: 0;
            transform: translateY(8px);
            transition: all 200ms ease;
          }
          .quick-add-wrap:hover .quick-add-btn {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
        <Link
          href={`/products/${product.slug}`}
          style={{ display: "block", width: "100%", height: "100%", position: "relative" }}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 479px) 44vw, (max-width: 768px) 32vw, (max-width: 1200px) 33vw, 16vw"
            style={{
              objectFit: "cover",
              transition: "transform 500ms ease",
            }}
          />
        </Link>

        {product.isNew ? (
          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "#C9A84C",
              color: "#0A0A0A",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 8px",
              textTransform: "uppercase",
            }}
          >
            New
          </span>
        ) : null}

        {product.stockLeft && product.stockLeft <= 5 ? (
          <span
            style={{
              position: "absolute",
              top: product.isNew ? "32px" : "10px",
              left: "10px",
              background: "rgba(180,40,40,0.9)",
              color: "#FFF",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              padding: "3px 8px",
            }}
          >
            Only {product.stockLeft} left
          </span>
        ) : null}

        <button
          onClick={() => setWished(!wished)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(255,255,255,0.92)",
            border: "none",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Heart
            size={15}
            strokeWidth={1.5}
            fill={wished ? "#C9A84C" : "none"}
            color={wished ? "#C9A84C" : "#444"}
          />
        </button>

        <div className="product-card-desktop-overlay" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <button
            onClick={handleAdd}
            className="quick-add-btn"
            style={{
              width: "100%",
              background: added ? "#e7f6ea" : adding ? "#f3ead0" : "rgba(255,255,255,0.94)",
              border: "none",
              color: added ? "#2f7a42" : "#8a6d2e",
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "12px",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            {added ? "✓ Added to Cart" : adding ? "Adding..." : "+ Quick Add"}
          </button>
        </div>
      </div>

      <div style={{ padding: "12px 10px 14px", display: "grid", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            color: "var(--muted)",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span>{product.category}</span>
          <span>{product.sizes.length} sizes</span>
        </div>
        <p
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 500,
            fontSize: "12px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#171717",
            margin: 0,
            minHeight: 34,
            lineHeight: 1.4,
          }}
        >
          {product.name}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              color: "#C9A84C",
              margin: 0,
            }}
          >
            KSh {product.price.toLocaleString()}
          </p>
          {product.originalPrice ? (
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: "11px",
                color: "#8a7f6d",
                textDecoration: "line-through",
                margin: 0,
              }}
            >
              KSh {product.originalPrice.toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="product-card-mobile-add" style={{ gap: 8, alignItems: "center" }}>
          <button
            type="button"
            onClick={handleAdd}
            style={{
              flex: 1,
              minHeight: 40,
              borderRadius: 999,
              border: "1px solid #ead7a3",
              background: added ? "#e7f6ea" : adding ? "#f3ead0" : "#fff7e4",
              color: added ? "#2f7a42" : "#8a6d2e",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0 12px",
            }}
          >
            {added ? "Added" : adding ? "Adding" : "Quick Add"}
          </button>
          <Link
            href={`/products/${product.slug}`}
            style={{
              minHeight: 40,
              minWidth: 72,
              padding: "0 12px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--off-white)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
