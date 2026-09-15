import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getSettings } from "@/lib/queries";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, settings] = await Promise.all([getProductBySlug(params.slug), getSettings()]);
  if (!product) notFound();

  const related = (await getProducts({ categorySlug: product.category?.slug })).filter((p: any) => p.id !== product.id);

  return <ProductDetailClient product={product} related={related} settings={settings} />;
}
