import type { LucideIcon } from "lucide-react";
import {
  Signpost,
  Printer,
  Type,
  Lightbulb,
  Layers,
  Store,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Color de acento de la card (paleta oficial de marca) */
  accent: "cyan" | "magenta" | "yellow";
  /** Foto real de referencia en public/ */
  image: string;
  /** Etiquetas cortas estilo ficha técnica */
  tags: [string, string];
  /** Si existe, la card enlaza a su página dedicada */
  href?: string;
};

// 6 servicios (2 filas exactas de 3 cards, 2 por cada color oficial CMY)
export const services: Service[] = [
  {
    slug: "cajas-de-luz",
    title: "Cajas de Luz Frameless",
    description:
      "Cajas de luz LED frameless a medida con gráfica intercambiable para retail, oficinas y malls.",
    icon: Lightbulb,
    accent: "magenta",
    image: "/letras volumetricas iluminadas.webp",
    tags: ["Frameless", "LED a medida"],
    href: "/cajas-de-luz-frameless",
  },
  {
    slug: "senaleticas",
    title: "Señaléticas",
    description:
      "Señalización normativa, corporativa, direccional y tótems para empresas, obras y edificios.",
    icon: Signpost,
    accent: "cyan",
    image: "/totem.webp",
    tags: ["Normativa", "Tienda online"],
    href: "/senaleticas",
  },
  {
    slug: "letras-volumetricas",
    title: "Letras Volumétricas",
    description:
      "Letras corpóreas 3D y letreros comerciales para fachadas e interiores, con o sin iluminación LED.",
    icon: Type,
    accent: "yellow",
    image: "/letras volumetricas.webp",
    tags: ["Corpóreos 3D", "Fachadas"],
  },
  {
    slug: "vinilos-y-empavonados",
    title: "Vinilos y Empavonados",
    description:
      "Adhesivos, vinilos de corte, rotulado de vitrinas y empavonados de privacidad para oficinas.",
    icon: Layers,
    accent: "cyan",
    image: "/rotulados.webp",
    tags: ["Vitrinas", "Empavonados"],
  },
  {
    slug: "impresion-uv-y-gran-formato",
    title: "Impresión UV y Gran Formato",
    description:
      "Impresión UV de alta fidelidad sobre rígidos, gigantografías, pendones y publicidad exterior.",
    icon: Printer,
    accent: "magenta",
    image: "/pendones.webp",
    tags: ["Impresión UV", "Gigantografías"],
  },
  {
    slug: "renovacion-de-espacios",
    title: "Renovación de Espacios",
    description:
      "Ambientación y remodelación gráfica integral de puntos de venta, locales comerciales y oficinas.",
    icon: Store,
    accent: "yellow",
    image: "/espacios-remodelados.webp",
    tags: ["Retail", "Instalación"],
  },
];
