"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, Plus, Loader2 } from "lucide-react";

export type UploadedImage = { url: string; sort_order: number; is_primary: boolean };

export default function ImageUploader({
  bucket = "product-images",
  folder,
  images,
  onChange,
}: {
  bucket?: string;
  folder: string;
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newImages: UploadedImage[] = [...images];
    for (const file of Array.from(files)) {
      const path = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
      if (error) {
        alert(`No se pudo subir ${file.name}: ${error.message}`);
        continue;
      }
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      newImages.push({ url: data.publicUrl, sort_order: newImages.length, is_primary: newImages.length === 0 });
    }
    onChange(newImages);
    setUploading(false);
  };

  const remove = (idx: number) => {
    const copy = images.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sort_order: i, is_primary: i === 0 }));
    onChange(copy);
  };

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-2">
        {images.map((img, i) => (
          <div key={img.url + i} className="relative w-16 h-16">
            <img src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#F0E4E1]" />
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-black/50 text-white rounded-b-lg">
                principal
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute -top-1.5 -right-1.5 bg-[#2B2024] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <label className="w-16 h-16 rounded-lg border-2 border-dashed border-[#D8B7BD] flex items-center justify-center cursor-pointer">
          {uploading ? <Loader2 size={16} className="animate-spin text-[#8A6A6F]" /> : <Plus size={18} className="text-[#8A6A6F]" />}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>
      <p className="text-[10.5px] text-[#8A6A6F]">
        Toca el recuadro con + para subir fotos desde tu celular o computador. La primera foto de la lista es la que se usa como principal.
      </p>
    </div>
  );
}
