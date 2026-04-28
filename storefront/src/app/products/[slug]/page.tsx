import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { products } from "@/lib/data";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductDetail product={product} />
      <Footer />
    </>
  );
}
