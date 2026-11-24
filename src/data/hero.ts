export type HeroAct = {
  id: string;
  step: string;
  label: string;
  accent: "cyan" | "magenta" | "yellow";
  title: string;
  description: string;
  /** Rango normalizado de progreso [0..1] donde este acto está activo */
  range: [number, number];
  /** Punto exacto de scroll [0..1] al hacer clic en el indicador */
  target: number;
};

export const heroActs: HeroAct[] = [
  {
    id: "fachada",
    step: "01",
    label: "Fachada base",
    accent: "cyan",
    title: "Transformamos espacios en marcas memorables",
    description:
      "Vestimos locales comerciales de principio a fin: corpóreos 3D, vinilos en vitrina y tótems publicitarios.",
    range: [0, 0.18],
    target: 0.02,
  },
  {
    id: "corporeo",
    step: "02",
    label: "Corpóreo 3D",
    accent: "cyan",
    title: "Letras Volumétricas 3D",
    description:
      "Fabricamos tu logo en corpóreo de aluminio y acrílico con volumen real y retroiluminación LED de alta eficiencia.",
    range: [0.22, 0.49],
    target: 0.42,
  },
  {
    id: "vinil",
    step: "03",
    label: "Retiro de transfer",
    accent: "magenta",
    title: "Vinilos y Empavonados en Vitrina",
    description:
      "Corte de precisión e instalación limpia en vidrio: retiramos el papel transfer revelando gráfica impecable.",
    range: [0.53, 0.77],
    target: 0.68,
  },
  {
    id: "totem",
    step: "04",
    label: "Tótem publicitario",
    accent: "yellow",
    title: "Tu marca, visible de día y de noche",
    description:
      "Completamos tu fachada con tótems publicitarios iluminados, señalética y cajas de luz a medida en todo Chile.",
    range: [0.81, 1],
    target: 0.98,
  },
];
