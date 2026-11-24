"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import { StorefrontScene } from "./hero/StorefrontScene";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        progressRef.current = 1;
        return;
      }

      const proxy = { p: 0 };
      progressRef.current = 0;

      const tl = gsap.timeline({
        delay: 0.25,
        onUpdate: () => {
          progressRef.current = proxy.p;
        },
      });

      // Acto 1: Fachada limpia + guía de montaje
      tl.to(proxy, { p: 0.16, duration: 1.0, ease: "power1.out" })
        // Acto 2: Extrusión 2D -> 3D del corpóreo Gráfica LT + encendido LED
        .to(proxy, { p: 0.5, duration: 2.9, ease: "power2.inOut" })
        .to(proxy, { p: 0.51, duration: 0.5, ease: "none" })
        // Acto 3: Retiro diagonal 3D del transfer revelando el vinil
        .to(proxy, { p: 0.8, duration: 2.8, ease: "power1.inOut" })
        .to(proxy, { p: 0.81, duration: 0.35, ease: "none" })
        // Acto 4: Subida e iluminación del tótem + plano final completo
        .to(proxy, { p: 1, duration: 2.1, ease: "power2.out" });

      return () => {
        tl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-ink text-white"
    >
      {/* Escena arquitectónica 3D (Three.js) con animación automática */}
      <StorefrontScene progressRef={progressRef} />

      {/* Viñeta sutil inferior para legibilidad del texto */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/30"
        aria-hidden="true"
      />

      {/* Contenido limpio del Hero: solo H1, texto y CTAs con fondo traslúcido */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl items-end px-6 pb-10 pt-24 md:pb-14">
        <div className="pointer-events-auto max-w-xl rounded-2xl border border-white/10 bg-ink/60 p-6 shadow-2xl backdrop-blur-md md:p-7">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Transformamos espacios en{" "}
            <span className="text-brand-gradient">marcas memorables</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-white/80 md:text-lg">
            Diseño, producción e instalación de letras volumétricas 3D, vinilos,
            cajas de luz, tótems publicitarios y señalética en todo Chile.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Cotizar proyecto
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full border border-cyan/80 bg-ink/40 px-6 py-3 text-sm font-semibold text-cyan backdrop-blur-sm transition hover:bg-cyan hover:text-ink"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
