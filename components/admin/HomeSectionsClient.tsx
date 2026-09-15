"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { saveHomepageSection, deleteHomepageSection } from "@/actions/catalog";
import type { Collection, HomepageSection } from "@/lib/types";

const TYPE_LABELS: Record<string, string> = {
  hero: "Banner principal (hero)",
  products: "Fila de productos",
  categories: "Categorías",
  brands: "Marcas",
  banner: "Banner con imagen",
  text: "Texto informativo",
};

export default function HomeSectionsClient({ sections, collections }: { sections: HomepageSection[]; collections: Collection[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<HomepageSection[]>(sections);
  const [adding, setAdding] = useState(false);

  const persist = async (section: HomepageSection) => {
    await saveHomepageSection(section as any);
    router.refresh();
  };

  const update = (i: number, patch: Partial<HomepageSection>) => {
    const copy = [...rows];
    copy[i] = { ...copy[i], ...patch };
    setRows(copy);
  };

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const copy = [...rows];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setRows(copy);
    await Promise.all(copy.map((s, idx) => saveHomepageSection({ ...s, sort_order: idx } as any)));
    router.refresh();
  };

  const addSection = async (type: HomepageSection["type"]) => {
    const base: any = { type, title: "Nueva sección", subtitle: null, config: {}, visible: true, sort_order: rows.length };
    if (type === "products") base.config = { collection_key: collections[0]?.key || "viral" };
    if (type === "hero") base.config = { button_text: "Explorar catálogo", button_link: "/shop" };
    await saveHomepageSection(base);
    setAdding(false);
    router.refresh();
  };

  return (
    <div className="max-w-[560px]">
      <div className="flex flex-col gap-3 mb-4">
        {rows.map((s, i) => (
          <div key={s.id} className="bg-white border border-[#F0E4E1] rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-bold text-[#8A6A6F] uppercase tracking-wide">{TYPE_LABELS[s.type] || s.type}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => move(i, -1)}><ChevronUp size={15} /></button>
                <button onClick={() => move(i, 1)}><ChevronDown size={15} /></button>
                <button onClick={() => persist({ ...s, visible: !s.visible })}>
                  {s.visible ? <Eye size={15} color="var(--color-primary)" /> : <EyeOff size={15} color="#8A6A6F" />}
                </button>
                <button
                  onClick={async () => { if (confirm("¿Eliminar esta sección?")) { await deleteHomepageSection(s.id); router.refresh(); } }}
                >
                  <Trash2 size={14} color="var(--color-accent)" />
                </button>
              </div>
            </div>
            <input
              className="input mb-1.5"
              placeholder="Título"
              defaultValue={s.title || ""}
              onBlur={(e) => persist({ ...s, title: e.target.value })}
            />
            <input
              className="input mb-1.5"
              placeholder="Subtítulo (opcional)"
              defaultValue={s.subtitle || ""}
              onBlur={(e) => persist({ ...s, subtitle: e.target.value })}
            />
            {s.type === "products" && (
              <select
                className="input"
                defaultValue={s.config?.collection_key || collections[0]?.key}
                onChange={(e) => persist({ ...s, config: { ...s.config, collection_key: e.target.value } })}
              >
                {collections.map((c) => <option key={c.id} value={c.key}>{c.label}</option>)}
              </select>
            )}
            {s.type === "hero" && (
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  className="input"
                  placeholder="Texto del botón"
                  defaultValue={s.config?.button_text || ""}
                  onBlur={(e) => persist({ ...s, config: { ...s.config, button_text: e.target.value } })}
                />
                <input
                  className="input"
                  placeholder="Enlace del botón"
                  defaultValue={s.config?.button_link || "/shop"}
                  onBlur={(e) => persist({ ...s, config: { ...s.config, button_link: e.target.value } })}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {!adding ? (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-white rounded-full px-4 py-2 text-xs font-semibold" style={{ background: "var(--color-primary)" }}>
          <Plus size={14} /> Agregar sección
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_LABELS).map(([type, label]) => (
            <button key={type} onClick={() => addSection(type as any)} className="text-[11.5px] border rounded-full px-3 py-1.5" style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}>
              {label}
            </button>
          ))}
        </div>
      )}
      <style jsx>{`.input{width:100%;font-size:12.5px;border:1px solid #EADFDA;border-radius:8px;padding:7px 10px;outline:none;}`}</style>
    </div>
  );
}
