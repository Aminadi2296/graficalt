"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/data/site";

const field =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-cyan focus:ring-2 focus:ring-cyan/20";

// Sin backend por ahora: el formulario arma un mensaje y abre WhatsApp.
export function QuoteForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const g = (k: string) => String(d.get(k) ?? "").trim() || "-";
    const text = [
      "Hola, quiero cotizar una Caja de Luz Frameless.",
      `Nombre: ${g("nombre")}`,
      `Empresa: ${g("empresa")}`,
      `Teléfono: ${g("telefono")}`,
      `Correo: ${g("correo")}`,
      `Comuna / Ciudad: ${g("comuna")}`,
      `Cantidad: ${g("cantidad")}`,
      `Medidas: ${g("medidas")}`,
      `Instalación: ${g("instalacion")}`,
      `Proyecto: ${g("proyecto")}`,
    ].join("\n");
    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm font-medium">
        Nombre *
        <input required name="nombre" placeholder="Tu nombre" className={`${field} mt-1`} />
      </label>
      <label className="text-sm font-medium">
        Empresa *
        <input required name="empresa" placeholder="Nombre de tu empresa" className={`${field} mt-1`} />
      </label>
      <label className="text-sm font-medium">
        Teléfono / WhatsApp *
        <input required name="telefono" type="tel" placeholder="+56 9 1234 5678" className={`${field} mt-1`} />
      </label>
      <label className="text-sm font-medium">
        Correo *
        <input required name="correo" type="email" placeholder="tu@empresa.cl" className={`${field} mt-1`} />
      </label>
      <label className="text-sm font-medium">
        Comuna / Ciudad *
        <input required name="comuna" placeholder="Ej: Santiago" className={`${field} mt-1`} />
      </label>
      <label className="text-sm font-medium">
        Cantidad de cajas de luz
        <select name="cantidad" className={`${field} mt-1`} defaultValue="1">
          <option>1</option>
          <option>2 a 5</option>
          <option>6 a 10</option>
          <option>Más de 10</option>
        </select>
      </label>
      <label className="text-sm font-medium">
        Medidas aproximadas
        <input name="medidas" placeholder="Ej: 100 x 200 cm" className={`${field} mt-1`} />
      </label>
      <label className="text-sm font-medium">
        ¿Necesitas instalación?
        <select name="instalacion" className={`${field} mt-1`} defaultValue="Sí">
          <option>Sí</option>
          <option>No</option>
          <option>Por definir</option>
        </select>
      </label>
      <label className="text-sm font-medium sm:col-span-2">
        Cuéntanos tu proyecto *
        <textarea
          required
          name="proyecto"
          rows={4}
          placeholder="Describe tu proyecto: objetivo, ubicación, plazos, etc."
          className={`${field} mt-1`}
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-magenta px-6 py-3.5 font-semibold text-white transition hover:brightness-110 sm:col-span-2"
      >
        <Send className="size-5" />
        Quiero cotizar mi proyecto
      </button>
      {sent && (
        <p role="status" className="text-sm font-medium text-cyan sm:col-span-2">
          Abrimos WhatsApp con tu solicitud. Solo falta que presiones enviar.
        </p>
      )}
    </form>
  );
}
