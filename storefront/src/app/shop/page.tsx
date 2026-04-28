import Footer from "@/components/Footer";
import ShopClient from "@/components/ShopClient";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <ShopClient
        initialCategory={resolvedSearchParams.category}
        initialSort={resolvedSearchParams.sort}
      />
      <Footer />
    </>
  );
}
