"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        await deleteProduct(id);
        router.refresh();
      }}
      className="bg-[#F1E7E2] rounded-lg p-2"
    >
      <Trash2 size={14} color="var(--color-accent)" />
    </button>
  );
}
