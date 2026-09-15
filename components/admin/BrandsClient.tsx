"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { saveBrand, deleteBrand } from "@/actions/catalog";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import type { Brand } from "@/lib/types";

export default function BrandsClient({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);
  const [logo, setLogo] = useState<UploadedImage[]>([]);
  const [saving, setSaving] = useState(false);

  const startNew = () => { setEditing({ name: "", active: true }); setLogo([]); };
  const startEdit = (b: Brand) => { setEditing(b); setLogo(b.logo_url ? [{ url: b.logo_url, sort_order: 0, is_primary: true }] : []); };

  const save = async () => {
    if (!editing?.name?.trim()) return alert("El nombre es obligatorio.");
    setSaving(true);
    try {
      await saveBrand({
        id: editing.id,
        name: editing.name!,
        slug: editing.slug,
        logo_url: logo[0]?.url || null,
        image_url: editing.image_url || null,
        description: editing.description || null,
        active: editing.active ?? true,
      });
      setEditing(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {!editing && (
        <button onClick={startNew} className="flex items-center gap-1.5 text-white rounded-full px-4 py-2 text-xs font-semibold mb-4" style={{ background: "var(--color-primary)" }}>
          <Plus size={14} /> Agregar marca
        </button>
      )}

      {editing && (
        <div className="bg-white border border-[#F0E4E1] rounded-2xl p-4 mb-5 max-w-[420px]">
          <div className="flex justify-between mb-3">
            <p className="text-sm font-semibold">{editing.id ? "Editar marca" : "Nueva marca"}</p>
            <button onClick={() => setEditing(null)}><X size={16} /></button>
          </div>
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Nombre</label>
          <input className="input mb-2.5" value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Descripción</label>
          <textarea rows={2} className="input mb-2.5" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
          <label className="text-[10.5px] text-[#8A6A6F] block mb-1">Logo</label>
          <ImageUploader bucket="branding" folder="brands" images={logo} onChange={(imgs) => setLogo(imgs.slice(-1))} />
          <button onClick={save} disabled={saving} className="w-full text-white rounded-full py-2.5 text-[13px] font-semibold mt-4" style={{ background: "var(--color-primary)" }}>
            {saving ? "Guardando..." : "Guardar marca"}
          </button>
          <style jsx>{`.input{width:100%;font-size:12.5px;border:1px solid #EADFDA;border-radius:8px;padding:7px 10px;outline:none;}`}</style>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center gap-3 bg-white border border-[#F0E4E1] rounded-xl p-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F1DFDE] flex-none overflow-hidden">{b.logo_url && <img src={b.logo_url} className="w-full h-full object-cover" />}</div>
            <p className="flex-1 text-[13px] font-medium">{b.name}{!b.active && <span className="text-[10px] text-[#8A6A6F]"> · oculta</span>}</p>
            <button onClick={() => startEdit(b)} className="bg-[#F1E7E2] rounded-lg p-2"><Pencil size={14} color="var(--color-primary)" /></button>
            <button
              onClick={async () => { if (confirm(`¿Eliminar ${b.name}?`)) { await deleteBrand(b.id); router.refresh(); } }}
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
