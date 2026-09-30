"use client";

import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { duplicateProduct } from "@/actions/products";

export default function DuplicateProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        if (!confirm(`¿Duplicar "${name}"? Se creará una copia que podrás editar.`)) return;
        await duplicateProduct(id);
        router.refresh();
      }}
      className="bg-[#F1E7E2] rounded-lg p-2"
    >
      <Copy size={14} color="var(--color-primary)" />
    </button>
  );
}
