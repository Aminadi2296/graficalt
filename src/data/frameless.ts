import type { LucideIcon } from "lucide-react";
import {
  Lightbulb,
  Ruler,
  RefreshCw,
  Sparkles,
  ShoppingBag,
  Building2,
  Store,
  Megaphone,
  MessageSquare,
  PenTool,
  Factory,
  Wrench,
} from "lucide-react";

export const framelessBenefits: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Lightbulb,
    title: "Iluminación LED",
    text: "Iluminación homogénea para potenciar colores y diseños.",
  },
  {
    icon: Ruler,
    title: "Fabricación a medida",
    text: "Adaptamos cada proyecto a tu espacio y necesidad.",
  },
  {
    icon: RefreshCw,
    title: "Gráfica intercambiable",
    text: "Ideal para actualizar promociones o campañas.",
  },
  {
    icon: Sparkles,
    title: "Terminación moderna",
    text: "Presentación limpia y profesional.",
  },
];

export const framelessApplications: {
  icon: LucideIcon;
  title: string;
  text: string;
  tone: string;
}[] = [
  {
    icon: ShoppingBag,
    title: "Retail y tiendas",
    text: "Atrae más clientes y destaca tus productos en el punto de venta.",
    tone: "from-cyan to-ink",
  },
  {
    icon: Building2,
    title: "Oficinas y espacios corporativos",
    text: "Comunica la identidad de tu empresa con un look profesional y moderno.",
    tone: "from-magenta to-ink",
  },
  {
    icon: Store,
    title: "Malls y locales comerciales",
    text: "Alto impacto visual en espacios de gran afluencia.",
    tone: "from-yellow to-ink",
  },
  {
    icon: Megaphone,
    title: "Campañas y exhibiciones",
    text: "Solución ideal para lanzamientos, promociones y eventos.",
    tone: "from-cyan via-magenta to-yellow",
  },
];

export const framelessProcess: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: MessageSquare,
    title: "Cuéntanos tu proyecto",
    text: "Nos compartes tus ideas, medidas y referencias.",
  },
  {
    icon: PenTool,
    title: "Diseño y propuesta",
    text: "Desarrollamos una propuesta visual y técnica a tu medida.",
  },
  {
    icon: Factory,
    title: "Fabricación",
    text: "Producimos tu caja de luz con materiales de alta calidad.",
  },
  {
    icon: Wrench,
    title: "Instalación",
    text: "Nos encargamos de la instalación en tu local o empresa.",
  },
];

export const framelessProjects = [
  "Retail",
  "Moda",
  "Gastronomía",
  "Automotriz",
  "Oficinas",
  "Mall",
];
