import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="h-1 bg-brand-gradient" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm md:flex-row">
        <p>
          © 2026 {site.name}. Todos los derechos reservados.
        </p>
        <ul className="flex gap-6">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition-colors hover:text-cyan">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
