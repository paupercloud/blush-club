"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { saveCategory, deleteCategory, saveSubcategory, deleteSubcategory, reorderSubcategories } from "@/actions/catalog";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import type { Category } from "@/lib/types";

type Subcategory = { id: string; category_id: string; name: string; sort_order: number };

export default function CategoriesClient({ categories, subcategories }: { categories: Category[]; subcategories: Subcategory[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [img, setImg] = useState<UploadedImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [newSubcat, setNewSubcat] = useState("");

  const startNew = () => { setEditing({ name: "", active: true, sort_order: categories.length }); setImg([]); };
  const startEdit = (c: Category) => { setEditing(c); setImg(c.image_url ? [{ url: c.image_url, sort_order: 0, is_primary: true }] : []); };

  const save = async () => {
    if (!editing?.name?.trim()) return alert("El nombre es obligatorio.");
    setSaving(true);
    try {
      await saveCategory({
        id: editing.id,
        name: editing.name!,
        slug: editing.slug,
        image_url: img[0]?.url || null,
        description: editing.description || null,
        active: editing.active ?? true,
        sort_order: editing.sort_order ?? 0,
      });
      setEditing(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const catSubcats = editing?.id
    ? subcategories.filter((s) => s.category_id === editing.id).sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const addSubcategory = async () => {
    if (!newSubcat.trim() || !editing?.id) return;
    await saveSubcategory({ category_id: editing.id, name: newSubcat.trim(), sort_order: catSubcats.length });
    setNewSubcat("");
    router.refresh();
  };

  const removeSubcategory = async (id: string) => {
    if (!confirm("¿Eliminar esta subcategoría?")) return;
    await deleteSubcategory(id);
    router.refresh();
  };

  const moveSubcategory = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= catSubcats.length) return;
    const a = catSubcats[index];
    const b = catSubcats[target];
    await reorderSubcategories([
      { id: a.id, sort_order: b.sort_order },
      { id: b.id, sort_order: a.sort_order },
    ]);
    router.refresh();
  };

  return (
    <div>
      {!editing && (
        <button onClick={startNew} className="flex items-center gap-1.5 text-white rounded-full px-4 py-2 text-xs font-semibold mb-4" style={{ background: "var(--color-primary)" }}>
          <Plus size={14} /> Agregar categoría
        </button>
      )}

      {editing && (
        <div className="bg-white border border-[#F0E4E1] rounded-2xl p-4 mb-5 max-w-[420px]">
          <div className="flex justify-between mb-3">
            <p className="text-sm font-semibold">{editing.id ? "Editar categoría" : "Nueva categoría"}</p>
            <button onClick={() => setEditing(null)}><X size={16} /></button>
          </div>
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Nombre</label>
          <input className="input mb-2.5" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Orden (número, menor aparece primero)</label>
          <input type="number" className="input mb-2.5" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Imagen</label>
          <ImageUploader bucket="branding" folder="categories" images={img} onChange={(imgs) => setImg(imgs.slice(-1))} />

          {editing.id && (
            <div className="mt-4 pt-4 border-t border-[#F0E4E1]">
              <p className="text-[10.5px] text-[#8A6A6F] mb-2">Subcategorías de "{editing.name}"</p>
              <div className="flex flex-col gap-1.5 mb-2">
                {catSubcats.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-1.5 bg-[#FBF6F4] rounded-lg px-2 py-1.5">
                    <span className="flex-1 text-[12px]">{s.name}</span>
                    <button type="button" onClick={() => moveSubcategory(i, -1)} disabled={i === 0} className="text-[11px] disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveSubcategory(i, 1)} disabled={i === catSubcats.length - 1} className="text-[11px] disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => removeSubcategory(s.id)}><X size={12} color="var(--color-accent)" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input className="input" placeholder="Nueva subcategoría" value={newSubcat} onChange={(e) => setNewSubcat(e.target.value)} />
                <button type="button" onClick={addSubcategory} className="text-white rounded-lg px-3 text-[12px] font-semibold" style={{ background: "var(--color-primary)" }}>
                  +
                </button>
              </div>
            </div>
          )}

          <button onClick={save} disabled={saving} className="w-full text-white rounded-full py-2.5 text-[13px] font-semibold mt-4" style={{ background: "var(--color-primary)" }}>
            {saving ? "Guardando..." : "Guardar categoría"}
          </button>
          <style jsx>{`.input{width:100%;font-size:12.5px;border:1px solid #EADFDA;border-radius:8px;padding:7px 10px;outline:none;}`}</style>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-white border border-[#F0E4E1] rounded-xl p-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F1DFDE] flex-none overflow-hidden">{c.image_url && <img src={c.image_url} className="w-full h-full object-cover" />}</div>
            <p className="flex-1 text-[13px] font-medium">{c.name}{!c.active && <span className="text-[10px] text-[#8A6A6F]"> · oculta</span>}</p>
            <button onClick={() => startEdit(c)} className="bg-[#F1E7E2] rounded-lg p-2"><Pencil size={14} color="var(--color-primary)" /></button>
            <button
              onClick={async () => { if (confirm(`¿Eliminar ${c.name}?`)) { await deleteCategory(c.id); router.refresh(); } }}
              className="bg-[#F1E7E2] rounded-lg p-2"
            >
              <Trash2 size={14} color="var(--color-accent)" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
