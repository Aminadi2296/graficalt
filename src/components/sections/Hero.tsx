/**
 * HERO — pendiente.
 *
 * Se deja vacío a propósito: aquí irá la animación con GSAP (y posible Three.js).
 * Ideas en evaluación:
 *  1. Imagen en un solo color que se "corta" como vinil, se retira el vinil
 *     y queda un patrón (efecto vitrina / fachada de local con algo de movimiento).
 *  2. Vinil que cae como al imprimirse, o un local en gris que se pinta, se
 *     le coloca vinil y luego letras volumétricas.
 *
 * Cuando se implemente será un Client Component ("use client") con useGSAP.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center bg-ink text-white"
    >
      <div data-hero-stage className="absolute inset-0" aria-hidden />
      <p className="relative z-10 font-display text-sm uppercase tracking-[0.3em] text-white/30">
        Hero · en construcción
      </p>
    </section>
  );
}
