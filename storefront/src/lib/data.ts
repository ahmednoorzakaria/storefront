export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  color: string;
  sizes: string[];
  image: string;
  images: string[];
  description: string;
  isNew?: boolean;
  stockLeft?: null | number;
};

export const categories = [
  {
    name: "Dresses",
    tag: "After dark",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Casual Wear",
    tag: "Off duty",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Luxury Fits",
    tag: "Statement",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Accessories",
    tag: "Finish strong",
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
  },
];

export const products: Product[] = [
  {
    slug: "midnight-column-dress",
    name: "Midnight Column Dress",
    category: "Dresses",
    price: 9800,
    color: "Black",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "A clean evening silhouette with a sculpted neckline and smooth drape that lands with just enough drama.",
    isNew: true,
    stockLeft: 3,
  },
  {
    slug: "champagne-slip-set",
    name: "Champagne Slip Set",
    category: "Luxury Fits",
    price: 12400,
    color: "Champagne",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "A polished two-piece set with soft shine, fluid movement, and a made-for-evening attitude.",
    isNew: true,
    stockLeft: null,
  },
  {
    slug: "olive-city-coord",
    name: "Olive City Coord",
    category: "Casual Wear",
    price: 7600,
    color: "Olive",
    sizes: ["XS", "S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Relaxed tailoring and a comfortable fit for errands, brunch, and those long city days that still deserve style.",
    isNew: false,
    stockLeft: 5,
  },
  {
    slug: "cocoa-structured-blazer",
    name: "Cocoa Structured Blazer",
    category: "Luxury Fits",
    price: 13800,
    color: "Cocoa",
    sizes: ["S", "M", "L", "XL"],
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Sharp shoulder line, fitted waist, and rich neutral tone for a tailored look that holds presence.",
    isNew: true,
    stockLeft: null,
  },
  {
    slug: "ivory-day-drape",
    name: "Ivory Day Drape",
    category: "Dresses",
    price: 8400,
    color: "Ivory",
    sizes: ["S", "M", "L"],
    image:
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "An airy dress with fluid movement and an easy line that feels elevated even when worn simply.",
    isNew: false,
    stockLeft: null,
    originalPrice: 9200,
  },
  {
    slug: "gold-clasp-mini-bag",
    name: "Gold Clasp Mini Bag",
    category: "Accessories",
    price: 6200,
    color: "Black",
    sizes: ["One Size"],
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    ],
    description:
      "Compact, polished, and finished with gold hardware that ties the whole outfit together.",
    isNew: false,
    stockLeft: 2,
    originalPrice: 7500,
  },
];
