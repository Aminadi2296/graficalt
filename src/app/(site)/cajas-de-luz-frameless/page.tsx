import type { Metadata } from "next";
import {
  ArrowRight,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { QuoteForm } from "@/components/frameless/QuoteForm";
import { HeroShowcase } from "@/components/frameless/HeroShowcase";
import {
  framelessApplications,
  framelessBenefits,
  framelessProjects,
} from "@/data/frameless";
import { ProcessTimeline } from "@/components/frameless/ProcessTimeline";
import { site, whatsappUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Cajas de Luz Frameless para empresas",
  description:
    "Diseño, fabricación e instalación de cajas de luz frameless a medida para locales comerciales, oficinas y proyectos corporativos.",
};

const wa = whatsappUrl("Hola, quiero cotizar una Caja de Luz Frameless.");

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3 font-semibold text-white transition hover:brightness-110";
const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-cyan px-6 py-3 font-semibold text-cyan transition hover:bg-cyan hover:text-ink";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold uppercase tracking-widest text-magenta">{children}</span>
  );
}

export default function FramelessPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex h-screen items-center overflow-hidden bg-ink pt-16 text-white">
        <HeroShowcase />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-8">
          <div className="max-w-lg">
            <Eyebrow>Imagen que impulsa tu negocio</Eyebrow>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Cajas de Luz <span className="text-brand-gradient">Frameless</span> para Empresas
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/80 lg:text-lg">
              Diseño, fabricación e instalación de cajas de luz a medida para locales comerciales,
              oficinas, tiendas y proyectos corporativos.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                <MessageCircle className="size-5" /> Cotizar por WhatsApp
              </a>
              <a
                href="#cotiza"
                className={`${btnOutline} border-cyan bg-ink/40 text-cyan backdrop-blur-sm hover:bg-cyan hover:text-ink`}
              >
                Solicitar cotización
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
              <li>Fabricación a medida</li>
              <li>Iluminación LED</li>
              <li>Diseño, impresión e instalación</li>
            </ul>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Más que un letrero, una experiencia visual</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
              Haz que tu marca destaque con una Caja de Luz Frameless
            </h2>
            <p className="mt-3 text-ink/70">
              Las cajas de luz frameless entregan una solución moderna, limpia y de alto impacto
              visual para empresas que buscan comunicar su marca con calidad y profesionalismo.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {framelessBenefits.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                <Icon className="size-8 text-cyan" />
                <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-ink/70">{text}</p>
              </li>
            ))}
          </ul>
          <CtaStrip title="¿Necesitas una caja de luz para tu empresa?" text="Hablemos de tu proyecto. Te asesoramos sin compromiso." />
        </div>
      </section>

      {/* APLICACIONES */}
      <section className="bg-mist py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Eyebrow>Aplicaciones reales, resultados tangibles</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
            Soluciones para Empresas y Locales Comerciales
          </h2>
          <p className="mt-2 max-w-2xl text-ink/70">
            Nuestras cajas de luz LED se adaptan a distintos espacios y necesidades, potenciando la
            visibilidad de tu marca.
          </p>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {framelessApplications.map(({ icon: Icon, title, text, tone }) => (
              <li key={title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${tone}`}>
                  <Icon className="size-14 text-white/90" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-ink/70">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex items-end justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink/50">
              Nuestros proyectos
            </h3>
            <a href="#cotiza" className="inline-flex items-center gap-1 text-sm font-semibold text-magenta">
              Ver mi proyecto <ArrowRight className="size-4" />
            </a>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {framelessProjects.map((p, i) => (
              <li
                key={p}
                className="flex aspect-[3/4] items-end rounded-xl bg-ink p-3 text-sm font-semibold text-white"
                style={{
                  backgroundImage: `linear-gradient(160deg, ${["#1CA7E5", "#FB1988", "#EBE46E"][i % 3]}66, #0a0a0f 75%)`,
                }}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <Eyebrow>Un proceso simple y seguro</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
              De tu idea a una Caja de Luz Frameless instalada
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink/70">
              Te acompañamos en todo el proceso, desde el diseño hasta la instalación, con un equipo
              experto y atención personalizada.
            </p>
          </div>
          <ProcessTimeline />
          <CtaStrip title="¿Listo para empezar tu proyecto?" text="Nuestro equipo está disponible para asesorarte." />
        </div>
      </section>

      {/* COTIZA */}
      <section id="cotiza" className="bg-mist py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
            <Eyebrow>Tu proyecto comienza aquí</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-bold">Cotiza tu Caja de Luz Frameless</h2>
            <p className="mb-6 mt-2 text-ink/70">
              Cuéntanos qué necesitas y nuestro equipo evaluará tu proyecto.
            </p>
            <QuoteForm />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/40 via-magenta/30 to-ink p-6 text-center font-display text-2xl font-bold uppercase text-white border border-white/10">
              Espacios que conectan personas
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-semibold">Hablemos de tu proyecto</h3>
              <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} mt-4 w-full`}>
                <MessageCircle className="size-5" /> Hablar por WhatsApp
              </a>
              <ul className="mt-5 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="size-5 text-cyan" />
                  <a href={`tel:+${site.whatsapp}`}>{site.phone}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="size-5 text-cyan" />
                  <a href={`mailto:${site.emails[1]}`}>{site.emails[1]}</a>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-cyan" /> Respuesta rápida para cotizaciones
                </li>
                <li className="flex items-center gap-3 text-ink/60">
                  <Clock className="size-5 text-cyan" /> Horario por confirmar
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function CtaStrip({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-mist p-6 md:flex-row">
      <div>
        <p className="font-display text-lg font-semibold">{title}</p>
        <p className="text-sm text-ink/70">{text}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={wa} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
          <MessageCircle className="size-5" /> Cotizar por WhatsApp
        </a>
        <a href="#cotiza" className={btnOutline}>
          Solicitar cotización
        </a>
      </div>
    </div>
  );
}
