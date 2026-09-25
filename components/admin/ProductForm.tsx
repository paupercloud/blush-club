"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { saveProduct } from "@/actions/products";
import ImageUploader, { UploadedImage } from "./ImageUploader";
import { slugify } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { Brand, Category } from "@/lib/types";

const COLLECTION_OPTIONS = [
  ["new", "Nuevo"], ["viral", "Viral"], ["bestseller", "Bestseller"],
  ["trending", "Trending"], ["destacado", "Destacado"], ["oferta", "Oferta"],
] as const;

type Tone = { id?: string; name: string; code: string; swatch_color: string; swatch_type: "color" | "image"; image_url: string; images: UploadedImage[]; available: boolean };
export default function ProductForm({
  brands,
  categories,
  initial,
}: {
  brands: Brand[];
  categories: Category[];
  initial?: any;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
    const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [brandId, setBrandId] = useState(initial?.brand_id || brands[0]?.id || "");
  const [categoryId, setCategoryId] = useState(initial?.category_id || categories[0]?.id || "");
  const [subcategory, setSubcategory] = useState(initial?.subcategory || "");
  const [subcatOptions, setSubcatOptions] = useState<string[]>([]);

    useEffect(() => {
    if (!categoryId) return;
    const supabase = createClient();
    supabase
      .from("subcategories")
      .select("name")
      .eq("category_id", categoryId)
      .order("sort_order")
      .then(({ data }) => {
        setSubcatOptions((data || []).map((r: any) => r.name));
      });
  }, [categoryId]);
  const [sku, setSku] = useState(initial?.sku || "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [prevPrice, setPrevPrice] = useState(initial?.prev_price ?? "");
  const [description, setDescription] = useState(initial?.description || "");
  const [benefits, setBenefits] = useState(initial?.benefits || "");
  const [ingredients, setIngredients] = useState(initial?.ingredients || "");
  const [content, setContent] = useState(initial?.content || "");
  const [available, setAvailable] = useState(initial?.available ?? true);
  const [immediate, setImmediate] = useState(initial?.immediate_delivery ?? false);
  const [collections, setCollections] = useState<string[]>(
    (initial?.product_collections || []).map((pc: any) => pc.collections?.key).filter(Boolean)
  );
    const [images, setImages] = useState<UploadedImage[]>(
    (initial?.product_images || [])
      .filter((img: any) => !img.variant_id)
      .map((img: any) => ({ url: img.url, sort_order: img.sort_order, is_primary: img.is_primary }))
  );
  const [tones, setTones] = useState<Tone[]>(
    (initial?.product_variants || []).map((v: any) => ({
      id: v.id,
      name: v.name,
      code: v.code || "",
      swatch_color: v.swatch_color,
      swatch_type: v.swatch_type || "color",
      image_url: v.image_url || "",
      images: (initial?.product_images || [])
        .filter((img: any) => img.variant_id === v.id)
        .map((img: any) => ({ url: img.url, sort_order: img.sort_order, is_primary: img.is_primary })),
      available: v.available,
    }))
  );

  const toggleCollection = (key: string) =>
    setCollections((c) => (c.includes(key) ? c.filter((x) => x !== key) : [...c, key]));

    const addTone = () => setTones((t) => [...t, { name: "", code: "", swatch_color: "#D8B7BD", swatch_type: "color", image_url: "", images: [], available: true }]);
  const updateTone = (i: number, field: keyof Tone, val: any) =>
    setTones((t) => t.map((tone, idx) => (idx === i ? { ...tone, [field]: val } : tone)));
  const removeTone = (i: number) => setTones((t) => t.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!name.trim()) return alert("El nombre del producto es obligatorio.");
                                setSaving(true);
    try {
      const { slug: newSlug } = await saveProduct({
        id: initial?.id,
        brand_id: brandId || null,
        category_id: categoryId || null,
        subcategory: subcategory || null,
        name,
        slug: slug || slugify(name),
        sku: sku || null,
        description: description || null,
        benefits: benefits || null,
        ingredients: ingredients || null,
        content: content || null,
        price: Number(price) || 0,
        prev_price: prevPrice ? Number(prevPrice) : null,
        available,
        immediate_delivery: immediate,
        collection_keys: collections,
                variants: tones.map((t, i) => ({
                    id: t.id,
                    name: t.name,
          code: t.code || null,
          swatch_color: t.swatch_color,
          swatch_type: t.swatch_type,
          image_url: t.swatch_type === "image" ? (t.image_url || null) : null,
          available: t.available,
          sort_order: i,
          images: t.images.map((img, j) => ({ url: img.url, sort_order: j })),
        })),
        images,
      });
      router.push("/admin/products");
      router.refresh();
    } catch (e: any) {
      alert("No se pudo guardar: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#F0E4E1] rounded-2xl p-4.5 max-w-[560px]">
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <Field label="Marca">
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="input">
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </Field>
        <Field label="Categoría">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Nombre del producto"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-2.5 my-2.5">
                       <Field label="Subcategoría (opcional)">
          <select className="input" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>
            <option value="">Sin subcategoría</option>
            {subcatOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="SKU (opcional)"><input className="input" value={sku} onChange={(e) => setSku(e.target.value)} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <Field label="Precio"><input type="number" className="input" value={price} onChange={(e) => setPrice(e.target.value)} /></Field>
        <Field label="Precio anterior (si hay oferta)"><input type="number" className="input" value={prevPrice} onChange={(e) => setPrevPrice(e.target.value)} /></Field>
      </div>
      <Field label="Descripción"><textarea rows={3} className="input" value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="h-2.5" />
      <Field label="Beneficios"><input className="input" value={benefits} onChange={(e) => setBenefits(e.target.value)} /></Field>
      <div className="h-2.5" />
      <Field label="Ingredientes"><input className="input" value={ingredients} onChange={(e) => setIngredients(e.target.value)} /></Field>
      <div className="h-2.5" />
      <Field label="Contenido (ej. 10 g)"><input className="input" value={content} onChange={(e) => setContent(e.target.value)} /></Field>

      <p className="text-xs font-semibold mt-4 mb-1.5">Etiquetas</p>
      <div className="flex gap-2 flex-wrap mb-1">
        {COLLECTION_OPTIONS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => toggleCollection(key)}
            className="text-[11px] px-3 py-1.5 rounded-full border"
            style={{
              borderColor: "var(--color-primary)",
              background: collections.includes(key) ? "var(--color-primary)" : "transparent",
              color: collections.includes(key) ? "#fff" : "var(--color-primary)",
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => setImmediate((v: boolean) => !v)}
          className="text-[11px] px-3 py-1.5 rounded-full border"
          style={{
            borderColor: "var(--color-accent)",
            background: immediate ? "var(--color-accent)" : "transparent",
            color: immediate ? "#fff" : "var(--color-accent)",
          }}
        >
          entrega inmediata
        </button>
        <button
         onClick={() => setAvailable((v: boolean) => !v)}
          className="text-[11px] px-3 py-1.5 rounded-full border"
          style={{ borderColor: "#8A6A6F", background: available ? "#8A6A6F" : "transparent", color: available ? "#fff" : "#8A6A6F" }}
        >
          {available ? "visible en la tienda" : "oculto"}
        </button>
      </div>

      <p className="text-xs font-semibold mt-4 mb-1.5">Fotografías</p>
      <ImageUploader folder={slug || slugify(name) || "producto"} images={images} onChange={setImages} />

            <p className="text-xs font-semibold mt-4 mb-1.5">Tonos ({tones.length})</p>
      <div className="flex flex-col gap-3 mb-2">
        {tones.map((t, i) => (
          <div key={i} className="border border-[#F0E4E1] rounded-xl p-2.5">
            <div className="flex items-center gap-2 mb-2">
              {t.swatch_type === "color" ? (
                <input
                  type="color"
                  value={t.swatch_color}
                  onChange={(e) => updateTone(i, "swatch_color", e.target.value)}
                  className="w-7 h-7 rounded-full border-none p-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#eadfda] bg-[#f7f1ef] flex-shrink-0">
                  {t.image_url && <img src={t.image_url} className="w-full h-full object-cover" />}
                </div>
              )}
                                                                      <input
                className="input"
                placeholder="Código"
                value={t.code}
                onChange={(e) => updateTone(i, "code", e.target.value)}
                style={{ width: "64px", flexShrink: 0 }}
              />
              <input
                className="input"
                placeholder="Nombre del tono"
                value={t.name}
                onChange={(e) => updateTone(i, "name", e.target.value)}
                style={{ width: "auto", flex: "1 1 auto", minWidth: "120px" }}
              />
              <label className="text-[10px] flex items-center gap-1 whitespace-nowrap">
                <input type="checkbox" checked={t.available} onChange={(e) => updateTone(i, "available", e.target.checked)} /> disp.
              </label>
              <button onClick={() => removeTone(i)}><X size={14} color="var(--color-accent)" /></button>
            </div>

            <div className="flex gap-2 mb-2">
              <button
                onClick={() => updateTone(i, "swatch_type", "color")}
                className="text-[10.5px] px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "var(--color-primary)",
                  background: t.swatch_type === "color" ? "var(--color-primary)" : "transparent",
                  color: t.swatch_type === "color" ? "#fff" : "var(--color-primary)",
                }}
              >
                ícono: color
              </button>
              <button
                onClick={() => updateTone(i, "swatch_type", "image")}
                className="text-[10.5px] px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: "var(--color-primary)",
                  background: t.swatch_type === "image" ? "var(--color-primary)" : "transparent",
                  color: t.swatch_type === "image" ? "#fff" : "var(--color-primary)",
                }}
              >
                ícono: imagen
              </button>
            </div>

            {t.swatch_type === "image" && (
              <div className="mb-2">
                <p className="text-[10.5px] text-[#8A6A6F] mb-1">Imagen del ícono del tono</p>
                <ImageUploader
                  folder={`${slug || slugify(name) || "producto"}-tono-${i}-icono`}
                  images={t.image_url ? [{ url: t.image_url, sort_order: 0, is_primary: true }] : []}
                  onChange={(imgs) => updateTone(i, "image_url", imgs[0]?.url || "")}
                />
              </div>
            )}

            <p className="text-[10.5px] text-[#8A6A6F] mb-1">Fotos de este tono (galería)</p>
            <ImageUploader
              folder={`${slug || slugify(name) || "producto"}-tono-${i}`}
              images={t.images}
              onChange={(imgs) => updateTone(i, "images", imgs)}
            />
          </div>
        ))}
      </div>
      <button onClick={addTone} className="text-[11.5px] flex items-center gap-1 border border-dashed border-[#D8B7BD] rounded-lg px-2.5 py-1.5 mb-5">
        <Plus size={12} /> Agregar tono
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full text-white rounded-full py-3 text-[13px] font-semibold disabled:opacity-60"
        style={{ background: "var(--color-primary)" }}
      >
        {saving ? "Guardando..." : "Guardar producto"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          font-size: 12.5px;
          border: 1px solid #eadfda;
          border-radius: 8px;
          padding: 7px 10px;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10.5px] text-[#8A6A6F] block mb-1">{label}</label>
      {children}
    </div>
  );
}
  
