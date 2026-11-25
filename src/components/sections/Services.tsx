import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services, type Service } from "@/data/services";

type AccentTheme = {
  /** Tinte traslúcido sobre la foto en reposo (se aclara al hacer hover) */
  tint: string;
  /** Degradado vertical que parte exactamente del color de la ola frontal (sin costura) */
  panel: string;
  /** Color exacto de la ola principal */
  waveFront: string;
  /** Color de la ola secundaria suave detrás */
  waveBack: string;
  /** Texto principal del panel */
  text: string;
  /** Texto secundario del panel */
  subtext: string;
  /** Botón de acción en hover */
  cta: string;
  /** Borde de acento en hover */
  ring: string;
};

const accentThemes: Record<Service["accent"], AccentTheme> = {
  cyan: {
    tint: "bg-[#1CA7E5]/55",
    panel: "bg-gradient-to-b from-[#1CA7E5] to-[#0d7eb5]",
    waveFront: "#1CA7E5",
    waveBack: "rgba(130, 219, 255, 0.65)",
    text: "text-white",
    subtext: "text-white/90",
    cta: "bg-white text-ink hover:bg-ink hover:text-white",
    ring: "hover:ring-cyan/60",
  },
  magenta: {
    tint: "bg-[#FB1988]/50",
    panel: "bg-gradient-to-b from-[#FB1988] to-[#b90b61]",
    waveFront: "#FB1988",
    waveBack: "rgba(255, 145, 198, 0.65)",
    text: "text-white",
    subtext: "text-white/90",
    cta: "bg-white text-ink hover:bg-ink hover:text-white",
    ring: "hover:ring-magenta/60",
  },
  yellow: {
    tint: "bg-[#EBE46E]/55",
    panel: "bg-gradient-to-b from-[#EBE46E] to-[#d2c93c]",
    waveFront: "#EBE46E",
    waveBack: "rgba(252, 248, 178, 0.78)",
    text: "text-ink",
    subtext: "text-ink/85",
    cta: "bg-ink text-white hover:bg-white hover:text-ink",
    ring: "hover:ring-yellow/80",
  },
};

export function Services() {
  return (
    <section id="servicios" className="bg-mist py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-magenta">
            Nuestros servicios
          </span>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Todo lo que tu marca necesita para{" "}
            <span className="text-brand-gradient">destacar</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Diseño, producción e instalación a nivel nacional.
          </p>
        </div>

        {/* 3 cards horizontales por fila en escritorio */}
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ slug, title, description, accent, image, href }) => {
            const theme = accentThemes[accent];
            const ctaLabel = href ? "Ver servicio" : "Cotizar";
            const ctaClasses = `relative z-20 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 ${theme.cta}`;

            return (
              <li key={slug}>
                <article
                  id={slug}
                  className={`group relative h-[305px] overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-ink/8 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl ${theme.ring}`}
                >
                  {/* Foto real del servicio arriba — con tinte traslúcido que se aclara en hover */}
                  <div className="absolute inset-0">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 group-hover:brightness-105"
                    />
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ease-out ${theme.tint} mix-blend-multiply opacity-20 lg:opacity-80 lg:group-hover:opacity-0`}
                    />
                    <div className="absolute inset-0 bg-ink/10 transition-opacity duration-500 ease-out lg:bg-ink/20 lg:group-hover:opacity-0" />
                  </div>

                  {/* Panel inferior wavy: abierto por defecto en móvil/tablet; se abre con hover en escritorio */}
                  <div
                    className={`absolute inset-x-0 bottom-0 z-10 h-[148px] translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-y-[86px] lg:group-hover:translate-y-0 ${theme.panel} ${theme.text}`}
                  >
                    {/* Doble ola SVG fluida */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-[38px] inset-x-0 h-[40px] overflow-hidden"
                    >
                      <svg
                        viewBox="0 0 1200 100"
                        preserveAspectRatio="none"
                        className="absolute inset-y-0 left-0 h-full w-[170%] -translate-x-[25%] transition-transform duration-[1300ms] ease-out lg:group-hover:translate-x-0"
                      >
                        <path
                          d="M0,58 C150,8 300,96 450,48 C600,4 750,92 900,46 C1050,6 1130,78 1200,42 L1200,100 L0,100 Z"
                          fill={theme.waveBack}
                        />
                      </svg>
                      <svg
                        viewBox="0 0 1200 100"
                        preserveAspectRatio="none"
                        className="absolute inset-y-0 left-0 h-full w-[170%] translate-x-0 transition-transform duration-[1400ms] ease-out lg:group-hover:-translate-x-[32%]"
                      >
                        <path
                          d="M0,64 C160,14 310,98 480,52 C640,8 800,94 960,48 C1080,14 1150,74 1200,50 L1200,100 L0,100 Z"
                          fill={theme.waveFront}
                        />
                      </svg>
                    </div>

                    {/* Contenido: siempre visible y clickeable en móvil; revelado en hover en escritorio */}
                    <div className="relative flex h-full flex-col justify-between px-6 pb-4 pt-1">
                      <div>
                        <h3 className="truncate font-display text-2xl font-bold leading-tight tracking-tight sm:text-[25px]">
                          {title}
                        </h3>
                        <p
                          className={`mt-1.5 line-clamp-2 text-xs leading-relaxed transition-all duration-500 delay-75 sm:text-[13px] lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 ${theme.subtext}`}
                        >
                          {description}
                        </p>
                      </div>

                      <div className="transition-all duration-500 delay-100 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                        {href ? (
                          <Link href={href} className={ctaClasses}>
                            {ctaLabel}
                            <ArrowRight className="size-4" />
                          </Link>
                        ) : (
                          <a href="#contacto" className={ctaClasses}>
                            {ctaLabel}
                            <ArrowRight className="size-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
