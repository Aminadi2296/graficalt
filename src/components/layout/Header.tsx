"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { SiteCartBadge } from "@/components/layout/SiteCartBadge";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-white/85 text-ink backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Gráfica LT, ir al inicio">
          <Image
            src="/logo.png"
            alt="Gráfica LT"
            width={342}
            height={70}
            priority
            className="h-9 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/75 transition-colors hover:text-cyan"
            >
              {item.label}
            </Link>
          ))}
          <SiteCartBadge />
          <Link
            href="/#contacto"
            className="rounded-full bg-magenta px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
          >
            Cotizar
          </Link>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <nav
          className="flex flex-col gap-1 border-t border-ink/10 px-6 py-4 md:hidden"
          aria-label="Móvil"
        >
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 text-base font-medium text-ink/90"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
