"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
  {
    src: "/letras volumetricas iluminadas.webp",
    alt: "Fachada comercial con iluminación LED instalada por Gráfica LT",
    label: "Iluminación LED de alto impacto",
    dot: "bg-cyan",
    position: "object-top",
  },
  {
    src: "/letras volumetricas.webp",
    alt: "Letrero retroiluminado en local retail instalado por Gráfica LT",
    label: "Terminación limpia para retail",
    dot: "bg-magenta",
    position: "object-top",
  },
  {
    src: "/rotulados.webp",
    alt: "Exhibición comercial en mall desarrollada por Gráfica LT",
    label: "Presencia en malls y tiendas",
    dot: "bg-yellow",
    position: "object-center",
  },
] as const;

export function HeroShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const active = slides[index];

  return (
    <>
      {/* Fondo con 3 fotos rotativas debajo del header fijo (top-16) para no recortar la parte superior */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 top-16 overflow-hidden lg:left-[34%]"
        aria-hidden="true"
      >
        {slides.map((slide, i) => {
          const isCurrent = i === index;
          return (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isCurrent ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className={`object-cover ${slide.position}`}
              />
            </div>
          );
        })}

        {/* Degradado horizontal suave entre el fondo oscuro izquierdo y la foto derecha */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #0a0a0f 0%, rgba(10,10,15,0.82) 18%, rgba(10,10,15,0.28) 40%, rgba(10,10,15,0) 62%)",
          }}
        />
      </div>

      {/* Indicadores discretos en la esquina inferior derecha */}
      <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 rounded-full border border-white/15 bg-ink/60 px-4 py-2 backdrop-blur-md sm:flex">
        <span className="text-xs font-medium text-white/85">{active.label}</span>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Fotos de proyectos">
          {slides.map((slide, i) => {
            const isCurrent = i === index;
            return (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Ver foto ${i + 1}: ${slide.label}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCurrent ? `w-6 ${slide.dot}` : "w-2 bg-white/40 hover:bg-white/75"
                }`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
