"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import { saveNavigationItems, deleteNavigationItem } from "@/actions/catalog";
import type { NavigationItem } from "@/lib/types";

export default function NavigationClient({ items }: { items: NavigationItem[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<NavigationItem[]>(items);
  const [saving, setSaving] = useState(false);

  const update = (i: number, field: keyof NavigationItem, val: any) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const addRow = () =>
    setRows((r) => [...r, { id: undefined as any, label: "", href: "/", sort_order: r.length, visible: true }]);

    const removeRow = async (i: number) => {
    const row = rows[i];
    if (row.id) {
      if (!confirm(`¿Eliminar "${row.label}" del menú?`)) return;
      await deleteNavigationItem(row.id);
    }
    setRows((r) => r.filter((_, idx) => idx !== i));
    router.refresh();
  };

  const moveRow = (i: number, direction: -1 | 1) => {
    setRows((r) => {
      const target = i + direction;
      if (target < 0 || target >= r.length) return r;
      const copy = [...r];
      [copy[i], copy[target]] = [copy[target], copy[i]];
      return copy;
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      await saveNavigationItems(rows.map((r, i) => ({ ...r, sort_order: i })));
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-[520px]">
      <div className="flex flex-col gap-2 mb-3">
        {rows.map((row, i) => (
          <div key={row.id || `new-${i}`} className="flex items-center gap-2 bg-white border border-[#F0E4E1] rounded-xl p-2">
            <input className="input flex-1" placeholder="Texto (ej. Maquillaje)" value={row.label} onChange={(e) => update(i, "label", e.target.value)} />
            <input className="input flex-1" placeholder="Enlace (ej. /category/maquillaje)" value={row.href} onChange={(e) => update(i, "href", e.target.value)} />
                        <button onClick={() => moveRow(i, -1)} disabled={i === 0} className="text-[13px] disabled:opacity-30">↑</button>
            <button onClick={() => moveRow(i, 1)} disabled={i === rows.length - 1} className="text-[13px] disabled:opacity-30">↓</button>
            <button onClick={() => update(i, "visible", !row.visible)}>
              {row.visible ? <Eye size={16} color="var(--color-primary)" /> : <EyeOff size={16} color="#8A6A6F" />}
            </button>
            <button onClick={() => removeRow(i)}><Trash2 size={14} color="var(--color-accent)" /></button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={addRow} className="flex items-center gap-1 text-[11.5px] border border-dashed border-[#D8B7BD] rounded-lg px-2.5 py-1.5">
          <Plus size={12} /> Agregar enlace
        </button>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-1 text-white rounded-full px-4 py-2 text-xs font-semibold"
          style={{ background: "var(--color-primary)" }}
        >
          <Save size={13} /> {saving ? "Guardando..." : "Guardar menú"}
        </button>
      </div>
      <style jsx>{`.input{font-size:12.5px;border:1px solid #EADFDA;border-radius:8px;padding:7px 10px;outline:none;}`}</style>
    </div>
  );
}
