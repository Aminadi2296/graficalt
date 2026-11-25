"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const reveal = revealRef.current;
      const beam = beamRef.current;
      if (!section || !reveal || !beam) return;

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        gsap.set(reveal, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(beam, { autoAlpha: 0 });
        return;
      }

      const state = { pct: 0 };

      const applySweep = () => {
        const rightInset = 100 - state.pct;
        reveal.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
        beam.style.left = `${state.pct}%`;
      };

      applySweep();

      // Bucle continuo: Antes -> barrido izq-der -> pausa en Después -> barrido der-izq -> pausa en Antes
      const tl = gsap.timeline({
        repeat: -1,
        delay: 0.6,
      });

      tl.to(beam, { autoAlpha: 1, duration: 0.25, ease: "power1.out" })
        .to(
          state,
          {
            pct: 100,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: applySweep,
          },
          "<0.05",
        )
        .to(beam, { autoAlpha: 0, duration: 0.4, ease: "power2.out" }, "-=0.2")
        // Pausa para apreciar el local terminado
        .to({}, { duration: 3.6 })
        // Regreso suave de derecha a izquierda
        .to(beam, { autoAlpha: 1, duration: 0.25, ease: "power1.out" })
        .to(
          state,
          {
            pct: 0,
            duration: 1.9,
            ease: "power2.inOut",
            onUpdate: applySweep,
          },
          "<0.05",
        )
        .to(beam, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, "-=0.2")
        // Pausa breve en el local blanco antes de repetir
        .to({}, { duration: 1.1 });

      // Pausa el bucle automáticamente si el Hero sale del viewport o se cambia de pestaña
      let inView = true;
      const syncPlayback = () => {
        if (inView && !document.hidden) {
          tl.play();
        } else {
          tl.pause();
        }
      };

      const io = new IntersectionObserver(
        (entries) => {
          inView = Boolean(entries[0]?.isIntersecting);
          syncPlayback();
        },
        { threshold: 0.1 },
      );
      io.observe(section);

      document.addEventListener("visibilitychange", syncPlayback);

      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", syncPlayback);
        tl.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative flex w-full flex-col overflow-hidden pt-16 lg:h-screen lg:flex-row lg:items-center"
      style={{
        background: "linear-gradient(180deg, #f4f6f8 0%, #e7e9ed 56%, #d3d4d7 100%)",
      }}
    >
      {/* Escena Antes / Después: proporción 16:10 sin recortar el logo en móvil; abajo-derecha en escritorio */}
      <div className="hero-seamless-mask pointer-events-none relative order-2 -mt-2 aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9] lg:absolute lg:bottom-0 lg:left-[24%] lg:right-0 lg:top-[72px] lg:mt-0 lg:aspect-auto lg:h-auto lg:w-auto">
        {/* Imagen base: local blanco minimalista sin gráfica */}
        <Image
          src="/hero/before.jpg"
          alt="Fachada de local comercial antes de instalar gráfica"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 76vw"
          className="object-cover object-[42%_center] lg:object-[center_42%]"
        />

        {/* Imagen revelada de izquierda a derecha: letras 3D, caja frameless y vinilos CMYK */}
        <div
          ref={revealRef}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(0 100% 0 0)" }}
        >
          <Image
            src="/hero/after-v2.jpg"
            alt="Fachada comercial transformada por Gráfica LT con letras volumétricas 3D, caja de luz frameless y vinilos CMYK"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 76vw"
            className="object-cover object-[42%_center] lg:object-[center_42%]"
          />
        </div>

        {/* Haz luminoso CMY que barre durante la revelación */}
        <div
          ref={beamRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-10 w-[3px] -translate-x-1/2 opacity-0"
          style={{
            left: "0%",
            background: "linear-gradient(180deg, #1CA7E5 0%, #FB1988 52%, #EBE46E 100%)",
            boxShadow:
              "0 0 18px 2px rgba(28, 167, 229, 0.75), 0 0 36px 6px rgba(251, 25, 136, 0.45)",
          }}
        />
      </div>

      {/* Contenido limpio del Hero: centrado y compacto en móvil; izquierda arriba en escritorio */}
      <div className="relative z-20 order-1 mx-auto w-full max-w-7xl px-5 pb-4 pt-9 lg:flex lg:h-full lg:items-start lg:px-6 lg:py-0 lg:pt-14">
        <div className="mx-auto max-w-sm text-center sm:max-w-md lg:mx-0 lg:max-w-[430px] lg:text-left">
          <h1 className="font-display text-[32px] font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Transformamos espacios en{" "}
            <span className="bg-gradient-to-r from-[#1CA7E5] via-[#FB1988] to-[#b90b61] bg-clip-text text-transparent">
              marcas memorables
            </span>
          </h1>
          <p className="mt-3.5 text-sm font-medium leading-relaxed text-ink/75 sm:text-base">
            Diseño, producción e instalación de letras volumétricas 3D, cajas de luz frameless,
            vinilos y señalética en todo Chile.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 lg:mt-6 lg:justify-start">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-magenta/25 transition hover:brightness-110"
            >
              Cotizar proyecto
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/85 px-6 py-2.5 text-sm font-semibold text-ink shadow-sm backdrop-blur-sm transition hover:border-cyan hover:bg-cyan hover:text-white"
            >
              Ver servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
