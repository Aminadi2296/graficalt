"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const STORAGE_KEY = "senaliza-cart-v1";

function readCartCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((sum, item) => sum + (Number(item?.qty) || 0), 0);
  } catch {
    return 0;
  }
}

/**
 * Muestra un acceso discreto al carrito de Señaléticas en el header de Gráfica LT
 * solo cuando el usuario ya tiene productos agregados.
 */
export function SiteCartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCartCount());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (count <= 0) return null;

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito de señaléticas, ${count} productos`}
      className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-mist px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-cyan hover:text-cyan"
    >
      <ShoppingCart className="size-4 text-magenta" />
      <span>{count}</span>
    </Link>
  );
}
