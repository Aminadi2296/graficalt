export const site = {
  name: "Gráfica LT",
  description:
    "Soluciones gráficas, publicidad visual y comunicación corporativa: diseño, producción e instalación a nivel nacional.",
  address: "Los Militares 5620, oficina 905, Las Condes, Santiago, Chile",
  phone: "+56 9 4904 4203",
  whatsapp: "56949044203",
  emails: ["ventas@graficalt.cl", "contacto@graficalt.cl"],
  nav: [
    { label: "Inicio", href: "/#inicio" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Contacto", href: "/#contacto" },
  ],
} as const;

export const whatsappUrl = (message = "Hola, quisiera cotizar un proyecto.") =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
