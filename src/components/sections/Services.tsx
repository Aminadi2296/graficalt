import Link from "next/link";
import { services, type Service } from "@/data/services";

const accentStyles: Record<Service["accent"], { icon: string; hover: string }> = {
  cyan: { icon: "bg-cyan/15 text-cyan", hover: "hover:border-cyan" },
  magenta: { icon: "bg-magenta/15 text-magenta", hover: "hover:border-magenta" },
  yellow: { icon: "bg-yellow/20 text-[#8d8212] dark:text-yellow", hover: "hover:border-yellow" },
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
            Todo lo que tu marca necesita para <span className="text-brand-gradient">destacar</span>
          </h2>
          <p className="mt-4 text-lg text-ink/70">
            Diseño, producción e instalación a nivel nacional.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(({ slug, title, description, icon: Icon, accent, href }) => (
            <li key={slug}>
              <article
                id={slug}
                className={`group relative flex h-full flex-col rounded-2xl border border-transparent bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${accentStyles[accent].hover}`}
              >
                <span
                  className={`flex size-12 items-center justify-center rounded-xl ${accentStyles[accent].icon}`}
                >
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {href ? (
                    <Link href={href} className="after:absolute after:inset-0">
                      {title}
                    </Link>
                  ) : (
                    title
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>
                {href && (
                  <span className="mt-4 text-sm font-semibold text-magenta">Ver más →</span>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
