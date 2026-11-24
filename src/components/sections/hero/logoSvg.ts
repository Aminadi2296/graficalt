/**
 * Geometría vectorial fiel a `public/logo.png` (342 × 70) para extrusión 3D en Three.js.
 *
 * Cada elemento se agrupa por color oficial de Gráfica LT:
 *  - white   : trazos estructurales del monograma LT + letras "GRÁFICA"
 *              (en fachada oscura se fabrican con frente blanco/perlado iluminado y canto metálico)
 *  - cyan    : trazo interior L (#1CA7E5)
 *  - magenta : trazo interior T (#FB1988)
 *  - yellow  : acento horizontal superior derecho (#EBE46E)
 */

export const LOGO_VIEWBOX = { width: 342, height: 70 } as const;

/**
 * Helper para generar un contorno cerrado (forma rellena) de un trazo con esquinas redondeadas.
 * Three.js `SVGLoader` extruye formas rellenas (`fill`), por lo que definimos cada trazo del
 * monograma LT y cada letra de GRÁFICA como polígonos/curvas rellenas limpias (con huecos
 * en las letras cerradas R, Á, A).
 */
export const LOGO_CORPOREAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342 70">
  <!-- 1. Trazo exterior L (estructural blanco iluminado) -->
  <path
    data-group="lt"
    data-color="white"
    data-order="0"
    fill="#ffffff"
    d="M 2.5 5.5 A 2.8 2.8 0 0 1 8.1 5.5 L 8.1 46 C 8.1 55.2 14.4 61.4 23.6 61.4 L 42.5 61.4 A 2.8 2.8 0 0 1 42.5 67 L 23.6 67 C 11.2 67 2.5 58.3 2.5 46 Z"
  />

  <!-- 2. Trazo interior L (Cyan oficial #1CA7E5) -->
  <path
    data-group="lt"
    data-color="cyan"
    data-order="1"
    fill="#1CA7E5"
    d="M 12.6 5.5 A 2.8 2.8 0 0 1 18.2 5.5 L 18.2 43.5 C 18.2 48.2 21.3 51.3 26 51.3 L 42.5 51.3 A 2.8 2.8 0 0 1 42.5 56.9 L 26 56.9 C 18.1 56.9 12.6 51.4 12.6 43.5 Z"
  />

  <!-- 3. Trazo interior T curvo (Magenta oficial #FB1988) -->
  <path
    data-group="lt"
    data-color="magenta"
    data-order="2"
    fill="#FB1988"
    d="M 27.5 12.9 L 44 12.9 C 51.9 12.9 57.4 18.4 57.4 26.3 L 57.4 64.2 A 2.8 2.8 0 0 1 51.8 64.2 L 51.8 26.3 C 51.8 21.6 48.7 18.5 44 18.5 L 27.5 18.5 A 2.8 2.8 0 0 1 27.5 12.9 Z"
  />

  <!-- 4. Trazo exterior T (barra superior + mástil curvo derecho, estructural blanco) -->
  <path
    data-group="lt"
    data-color="white"
    data-order="3"
    fill="#ffffff"
    d="M 27.5 2.8 L 87.5 2.8 A 2.8 2.8 0 0 1 87.5 8.4 L 56.2 8.4 C 63.3 11.4 67.5 17.8 67.5 26.3 L 67.5 64.2 A 2.8 2.8 0 0 1 61.9 64.2 L 61.9 26.3 C 61.9 16.5 55.6 9.8 46.2 8.4 L 27.5 8.4 A 2.8 2.8 0 0 1 27.5 2.8 Z"
  />

  <!-- 5. Acento amarillo superior derecho (#EBE46E) -->
  <path
    data-group="lt"
    data-color="yellow"
    data-order="4"
    fill="#EBE46E"
    d="M 68.5 12.9 L 87.5 12.9 A 2.7 2.7 0 0 1 87.5 18.4 L 71.2 18.4 Z"
  />

  <!-- 6. Wordmark "G R Á F I C A" — geométrica bold, fiel a public/logo.png -->
  <!-- G -->
  <path
    data-group="word"
    data-color="white"
    data-order="5"
    fill="#ffffff"
    d="M 111.5 21.5 C 117.6 21.5 122.2 24.3 124.7 28.4 L 119.2 31.6 C 117.6 29.1 114.9 27.4 111.5 27.4 C 105.7 27.4 101.6 31.6 101.6 37.2 C 101.6 42.9 105.7 47.0 111.7 47.0 C 116.0 47.0 119.1 44.8 119.8 41.2 L 111.4 41.2 L 111.4 35.8 L 126.4 35.8 L 126.4 38.2 C 126.4 46.8 120.4 52.8 111.6 52.8 C 102.3 52.8 95.2 46.1 95.2 37.2 C 95.2 28.2 102.3 21.5 111.5 21.5 Z"
  />

  <!-- R -->
  <path
    data-group="word"
    data-color="white"
    data-order="6"
    fill="#ffffff"
    d="M 136.5 22.2 L 149.8 22.2 C 156.4 22.2 160.8 26.0 160.8 31.8 C 160.8 36.1 158.4 39.2 154.5 40.5 L 161.6 52.1 L 154.4 52.1 L 148.0 41.3 L 143.0 41.3 L 143.0 52.1 L 136.5 52.1 Z M 143.0 27.7 L 143.0 35.9 L 149.5 35.9 C 152.6 35.9 154.3 34.4 154.3 31.8 C 154.3 29.3 152.6 27.7 149.5 27.7 Z"
  />

  <!-- Á (cuerpo A) -->
  <path
    data-group="word"
    data-color="white"
    data-order="7"
    fill="#ffffff"
    d="M 181.2 22.2 L 187.8 22.2 L 199.5 52.1 L 192.5 52.1 L 190.1 45.7 L 178.7 45.7 L 176.3 52.1 L 169.4 52.1 Z M 184.4 30.2 L 180.7 40.2 L 188.1 40.2 Z"
  />
  <!-- Á (tilde aguda) -->
  <path
    data-group="word"
    data-color="white"
    data-order="7"
    fill="#ffffff"
    d="M 186.6 13.0 L 193.0 13.0 L 187.4 19.6 L 182.6 19.6 Z"
  />

  <!-- F -->
  <path
    data-group="word"
    data-color="white"
    data-order="8"
    fill="#ffffff"
    d="M 208.5 22.2 L 229.8 22.2 L 229.8 28.0 L 215.0 28.0 L 215.0 34.7 L 228.0 34.7 L 228.0 40.5 L 215.0 40.5 L 215.0 52.1 L 208.5 52.1 Z"
  />

  <!-- I -->
  <path
    data-group="word"
    data-color="white"
    data-order="9"
    fill="#ffffff"
    d="M 241.0 22.2 L 247.6 22.2 L 247.6 52.1 L 241.0 52.1 Z"
  />

  <!-- C -->
  <path
    data-group="word"
    data-color="white"
    data-order="10"
    fill="#ffffff"
    d="M 275.4 21.5 C 281.6 21.5 286.4 24.4 289.0 28.9 L 283.3 32.1 C 281.7 29.2 278.9 27.4 275.4 27.4 C 269.7 27.4 265.7 31.6 265.7 37.2 C 265.7 42.8 269.7 47.0 275.4 47.0 C 278.9 47.0 281.7 45.2 283.3 42.3 L 289.0 45.5 C 286.4 50.0 281.6 52.8 275.4 52.8 C 266.2 52.8 259.2 46.1 259.2 37.2 C 259.2 28.2 266.2 21.5 275.4 21.5 Z"
  />

  <!-- A -->
  <path
    data-group="word"
    data-color="white"
    data-order="11"
    fill="#ffffff"
    d="M 309.2 22.2 L 315.8 22.2 L 327.5 52.1 L 320.5 52.1 L 318.1 45.7 L 306.7 45.7 L 304.3 52.1 L 297.4 52.1 Z M 312.4 30.2 L 308.7 40.2 L 316.1 40.2 Z"
  />
</svg>`;
