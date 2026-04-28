"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const categoryOptions = ["All", "Dresses", "Casual Wear", "Luxury Fits", "Accessories"];
const sortOptions = ["featured", "best-selling", "price-asc", "price-desc"] as const;

type ShopClientProps = {
  initialCategory?: string;
  initialSort?: string;
};

const normalizeCategory = (value?: string) =>
  categoryOptions.includes(value ?? "") ? value ?? "All" : "All";

const normalizeSort = (value?: string) =>
  sortOptions.includes((value ?? "featured") as (typeof sortOptions)[number]) ? value ?? "featured" : "featured";

export default function ShopClient({ initialCategory, initialSort }: ShopClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(normalizeCategory(initialCategory));
  const [sortBy, setSortBy] = useState(normalizeSort(initialSort));

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory === "All") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }

    if (sortBy === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", sortBy);
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams, selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    const next = products.filter((product) => {
      if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
      return true;
    });

    if (sortBy === "price-asc") next.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") next.sort((a, b) => b.price - a.price);
    if (sortBy === "best-selling") next.sort((a, b) => (a.stockLeft ?? 999) - (b.stockLeft ?? 999));
    return next;
  }, [selectedCategory, sortBy]);

  return (
    <section
      style={{
        background: "#fffdf8",
        color: "#0a0a0a",
        minHeight: "100vh",
        padding: "16px 0 56px",
      }}
    >
      <div className="container" style={{ maxWidth: 1080 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 18,
            display: "grid",
            gap: 8,
          }}
        >
          <p
            style={{
              margin: 0,
              color: "var(--gold-dim)",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Naistyles Product Feed
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 7vw, 4rem)",
              fontWeight: 400,
            }}
          >
            Shop the edit
          </h1>
          <p style={{ margin: 0, color: "#555", maxWidth: 520, justifySelf: "center", lineHeight: 1.6, fontSize: 14 }}>
            A cleaner, centered feed built for mobile browsing so the products do the selling.
          </p>
        </div>

        <div
          style={{
            position: "sticky",
            top: 80,
            zIndex: 10,
            background: "rgba(255,253,248,0.96)",
            backdropFilter: "blur(10px)",
            paddingBottom: 12,
            marginBottom: 18,
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            borderTop: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 8,
            }}
          >
            {categoryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedCategory(option)}
                style={{
                  flex: "0 0 auto",
                  minHeight: 40,
                  padding: "0 14px",
                  border: `1px solid ${selectedCategory === option ? "var(--gold)" : "#d7d1c3"}`,
                  background: selectedCategory === option ? "#fff4d2" : "#ffffff",
                  color: selectedCategory === option ? "#8a6d2e" : "#0a0a0a",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  borderRadius: 999,
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                color: "#666",
                fontSize: 12,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {filteredProducts.length} products
            </div>

            <label style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "#666", fontSize: 13 }}>
              Sort
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                style={{
                  minHeight: 38,
                  border: "1px solid #d7d1c3",
                  background: "#fff",
                  color: "#0a0a0a",
                  padding: "0 12px",
                  borderRadius: 999,
                }}
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best selling</option>
                <option value="price-asc">Lowest price</option>
                <option value="price-desc">Highest price</option>
              </select>
            </label>
          </div>
        </div>

        <div
          className="shop-product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
            alignItems: "start",
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        <style>{`
          @media (min-width: 768px) {
            .shop-product-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 16px !important;
            }
          }
          @media (min-width: 1100px) {
            .shop-product-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
