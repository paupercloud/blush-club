"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  image_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_link?: string;
};

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const list = slides && slides.length > 0 ? slides : [{}];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);

  const slide = list[idx];

  return (
    <section
      className="relative px-[18px] py-14 text-white overflow-hidden"
      style={{
        background: slide.image_url
          ? `linear-gradient(135deg,rgba(110,42,58,0.55),rgba(110,42,58,0.55)), url(${slide.image_url}) center/cover`
          : "linear-gradient(135deg,var(--color-primary),#8A4655)",
        transition: "background 0.4s ease",
      }}
    >
      <div className="max-w-[1100px] mx-auto relative z-10">
        {slide.subtitle && <p className="serif text-[15px] tracking-wide opacity-85 mb-1.5">{slide.subtitle}</p>}
        {slide.title && <h1 className="serif text-[40px] leading-[1.1] mb-3.5 max-w-[480px]">{slide.title}</h1>}
        {slide.button_text && (
          <Link
            href={slide.button_link || "/shop"}
            className="inline-block bg-white text-[13px] font-semibold px-5 py-3 rounded-full"
            style={{ color: "var(--color-primary)" }}
          >
            {slide.button_text}
          </Link>
        )}
      </div>

      {list.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + list.length) % list.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 rounded-full w-9 h-9 flex items-center justify-center z-10"
          >
            <ChevronLeft size={18} color="#fff" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % list.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/25 hover:bg-white/40 rounded-full w-9 h-9 flex items-center justify-center z-10"
          >
            <ChevronRight size={18} color="#fff" />
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === idx ? "#fff" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
