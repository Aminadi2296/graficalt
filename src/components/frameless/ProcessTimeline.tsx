"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { framelessProcess } from "@/data/frameless";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Proceso en 4 pasos: cada círculo magenta se "carga" (anillo SVG) y al
 * completarse se rellena y empieza a llenarse la línea hacia el siguiente,
 * hasta llegar al último paso. Se dispara una sola vez al entrar al viewport.
 */
export function ProcessTimeline() {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, el);

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" },
        (ctx) => {
          const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };
          const steps = q("[data-step]");

          // Sin animación: estado final directo.
          if (reduce) {
            gsap.set(q("[data-ring]"), { strokeDashoffset: 0 });
            gsap.set([...q("[data-text]"), ...q("[data-fill]"), ...q("[data-disc]")], {
              autoAlpha: 1,
              scale: 1,
            });
            gsap.set(q("[data-num]"), { color: "#ffffff" });
            return;
          }

          gsap.set(q("[data-text]"), { y: 16 });
          gsap.set(q("[data-disc]"), { scale: 0.6 });
          gsap.set(
            q("[data-fill]"),
            desktop
              ? { scaleX: 0, scaleY: 1, transformOrigin: "left center" }
              : { scaleY: 0, scaleX: 1, transformOrigin: "center top" },
          );

          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          });

          steps.forEach((step) => {
            const ring = step.querySelector("[data-ring]");
            const disc = step.querySelector("[data-disc]");
            const num = step.querySelector("[data-num]");
            const text = step.querySelector("[data-text]");
            const fill = step.querySelector("[data-fill]");

            tl.to(ring, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" })
              .to(text, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "<0.35")
              .to(disc, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, ">-0.15")
              .to(num, { color: "#ffffff", duration: 0.25 }, "<");

            if (fill) {
              tl.to(
                fill,
                desktop
                  ? { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: "none" }
                  : { autoAlpha: 1, scaleY: 1, duration: 0.6, ease: "none" },
              );
            } else {
              // Último paso: pequeño pulso al llegar al final del proceso.
              tl.to(step.querySelector("[data-circle]"), {
                scale: 1.15,
                duration: 0.25,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
              });
            }
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="mt-14 grid gap-0 lg:grid-cols-4">
      {framelessProcess.map(({ title, text }, i) => {
        const isLast = i === framelessProcess.length - 1;
        return (
          <li
            key={title}
            data-step
            className="relative flex gap-5 pb-12 last:pb-0 lg:flex-col lg:items-center lg:pb-0 lg:text-center"
          >
            <div data-circle className="relative size-[76px] shrink-0">
              <svg viewBox="0 0 76 76" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle
                  cx="38"
                  cy="38"
                  r="34"
                  fill="none"
                  strokeWidth="5"
                  className="stroke-magenta/15"
                />
                <circle
                  data-ring
                  cx="38"
                  cy="38"
                  r="34"
                  fill="none"
                  strokeWidth="5"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1}
                  className="stroke-magenta"
                />
              </svg>
              <span data-disc className="absolute inset-[9px] rounded-full bg-magenta opacity-0" />
              <span
                data-num
                className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold text-magenta"
              >
                {i + 1}
              </span>
            </div>

            {!isLast && (
              <span
                aria-hidden
                className="absolute bottom-[6px] left-[36px] top-[84px] w-[3px] rounded-full bg-magenta/15 lg:bottom-auto lg:left-[calc(50%+44px)] lg:top-[36px] lg:h-[3px] lg:w-[calc(100%-88px)]"
              >
                <span data-fill className="absolute inset-0 rounded-full bg-magenta opacity-0" />
              </span>
            )}

            <div data-text className="pt-1 opacity-0 lg:mt-6 lg:pt-0">
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-ink/70 lg:px-4">{text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
