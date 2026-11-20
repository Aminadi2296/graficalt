import type { LucideIcon } from "lucide-react";
import {
  Signpost,
  Printer,
  Type,
  Lightbulb,
  Image as ImageIcon,
  Sticker,
  Layers,
  Store,
} from "lucide-react";

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Color de acento de la card (paleta de marca) */
  accent: "cyan" | "magenta" | "yellow";
  /** Si existe, la card enlaza a su página dedicada */
  href?: string;
};

// Pensado para crecer: cada servicio podrá tener su propia sección/página (/servicios/[slug]).
export const services: Service[] = [
  {
    slug: "senaleticas",
    title: "Señaléticas",
    description:
      "Señalización corporativa, direccional y normativa para oficinas, edificios y espacios comerciales.",
    icon: Signpost,
    accent: "cyan",
    href: "/senaleticas",
  },
  {
    slug: "letras-volumetricas",
    title: "Letras volumétricas",
    description:
      "Letras corpóreas y letreros comerciales para fachadas e interiores, con o sin iluminación.",
    icon: Type,
    accent: "yellow",
  },
  {
    slug: "cajas-de-luz",
    title: "Cajas de luz",
    description:
      "Cajas de luz y sistemas frameless que dan presencia a tu marca de día y de noche.",
    icon: Lightbulb,
    accent: "magenta",
    href: "/cajas-de-luz-frameless",
  },
  {
    slug: "impresion-uv",
    title: "Impresión UV",
    description:
      "Impresión de alta fidelidad con tintas de bajo olor, segura para espacios exigentes.",
    icon: Printer,
    accent: "cyan",
  },
  {
    slug: "gigantografias",
    title: "Gigantografías",
    description:
      "Impresión en gran formato para publicidad exterior, eventos y puntos de venta.",
    icon: ImageIcon,
    accent: "magenta",
  },
  {
    slug: "adhesivos-y-vinilos",
    title: "Adhesivos y vinilos",
    description:
      "Adhesivos, troquelados y vinilos para múltiples superficies, vehículos y vitrinas.",
    icon: Sticker,
    accent: "yellow",
  },
  {
    slug: "empavonados",
    title: "Empavonados",
    description:
      "Vinilos decorativos y de privacidad para vidrios, oficinas y vitrinas.",
    icon: Layers,
    accent: "cyan",
  },
  {
    slug: "renovacion-de-espacios",
    title: "Renovación de espacios",
    description:
      "Ambientación y remodelación gráfica de puntos de venta y oficinas.",
    icon: Store,
    accent: "magenta",
  },
];
