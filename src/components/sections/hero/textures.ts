import * as THREE from "three";

const CYAN = "#1CA7E5";
const MAGENTA = "#FB1988";
const YELLOW = "#EBE46E";

/** Textura procedural de hormigón arquitectónico para vereda y muros laterales */
export function createConcreteTextures() {
  const size = 512;
  const colorCanvas = document.createElement("canvas");
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext("2d")!;

  ctx.fillStyle = "#1a1d26";
  ctx.fillRect(0, 0, size, size);

  // Grano sutil de hormigón
  for (let i = 0; i < 6000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const v = 22 + Math.floor(Math.random() * 24);
    ctx.fillStyle = `rgba(${v},${v + 2},${v + 8},0.35)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Juntas de dilatación arquitectónicas
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, size - 3, size - 3);
  ctx.beginPath();
  ctx.moveTo(size / 2, 0);
  ctx.lineTo(size / 2, size);
  ctx.moveTo(0, size / 2);
  ctx.lineTo(size, size / 2);
  ctx.stroke();

  const map = new THREE.CanvasTexture(colorCanvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(6, 4);
  map.colorSpace = THREE.SRGBColorSpace;

  return map;
}

/** Textura procedural de aluminio compuesto (ACM) antracita cepillado para la marquesina */
export function createFasciaTexture() {
  const w = 1024;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#151720");
  grad.addColorStop(0.5, "#1b1e29");
  grad.addColorStop(1, "#101219");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Micro cepillado horizontal metálico
  for (let y = 0; y < h; y += 2) {
    const a = 0.015 + Math.random() * 0.025;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(0, y, w, 1);
  }

  // Juntas de paneles ACM verticales sutiles
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 2;
  for (let x = 128; x < w; x += 256) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Gráfica de vinil de corte + empavonado que queda revelada sobre el ventanal
 * al retirar el papel transfer en el Acto 3.
 */
export function createVinylTexture() {
  const w = 2048;
  const h = 768;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, w, h);

  // 1. Franja de empavonado translúcido sutil en el centro-inferior del vidrio
  const frostGrad = ctx.createLinearGradient(0, 410, 0, 625);
  frostGrad.addColorStop(0, "rgba(255,255,255,0.16)");
  frostGrad.addColorStop(0.5, "rgba(255,255,255,0.22)");
  frostGrad.addColorStop(1, "rgba(255,255,255,0.13)");
  ctx.fillStyle = frostGrad;
  ctx.fillRect(70, 415, w - 140, 200);

  // Líneas finas caladas en el empavonado
  ctx.clearRect(70, 442, w - 140, 6);
  ctx.clearRect(70, 586, w - 140, 6);

  // 2. Bandas diagonales de vinil de corte en paleta CMYK exacta del logo
  ctx.save();
  ctx.beginPath();
  ctx.rect(70, 90, 560, 580);
  ctx.clip();

  const stripes: [string, number, number][] = [
    [CYAN, 95, 76],
    [MAGENTA, 192, 76],
    [YELLOW, 289, 64],
    ["#0a0a0f", 374, 34],
  ];
  for (const [color, xStart, width] of stripes) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(xStart, 670);
    ctx.lineTo(xStart + 185, 90);
    ctx.lineTo(xStart + 185 + width, 90);
    ctx.lineTo(xStart + width, 670);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 3. Tipografía en vinil blanco de corte limpio (centro-derecha)
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "700 84px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("SOLUCIONES GRÁFICAS", 600, 275);

  // Barra CMYK oficial
  ctx.fillStyle = CYAN;
  ctx.fillRect(600, 306, 170, 8);
  ctx.fillStyle = MAGENTA;
  ctx.fillRect(780, 306, 170, 8);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(960, 306, 120, 8);
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(1090, 306, 54, 8);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "600 36px Inter, system-ui, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("LETREROS 3D  ·  CAJAS DE LUZ  ·  SEÑALÉTICA", 600, 378);

  // Etiqueta sobre la franja empavonada
  ctx.fillStyle = "rgba(255,255,255,0.96)";
  ctx.font = "700 42px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("DISEÑO  ·  PRODUCCIÓN  ·  INSTALACIÓN", 600, 532);

  // Detalle de puerta / acceso a la derecha
  ctx.strokeStyle = "rgba(255,255,255,0.65)";
  ctx.lineWidth = 3;
  ctx.strokeRect(1660, 175, 290, 170);
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 30px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText("GRAFICALT.CL", 1692, 250);
  ctx.fillStyle = CYAN;
  ctx.font = "600 22px Inter, system-ui, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("TODO CHILE", 1692, 296);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * Textura realista de papel transfer (application tape) semi-opaco con cuadrícula
 * técnica y marcas de registro de instalación.
 */
export function createTransferTexture() {
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Base papel transfer crema-blanco translúcido
  ctx.fillStyle = "#eef1f6";
  ctx.fillRect(0, 0, w, h);

  // Fibra suave de papel transfer
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = `rgba(140,150,170,${0.03 + Math.random() * 0.04})`;
    ctx.fillRect(x, y, 6, 1);
  }

  // Cuadrícula de alineación típica de papel transfer
  ctx.strokeStyle = "rgba(28, 167, 229, 0.22)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Guías mayores + cruces de registro
  ctx.strokeStyle = "rgba(251, 25, 136, 0.28)";
  ctx.lineWidth = 1.5;
  for (let x = 128; x < w; x += 256) {
    for (let y = 128; y < h; y += 256) {
      ctx.beginPath();
      ctx.moveTo(x - 14, y);
      ctx.lineTo(x + 14, y);
      ctx.moveTo(x, y - 14);
      ctx.lineTo(x, y + 14);
      ctx.stroke();
    }
  }

  // Texto sutil impreso en el respaldo del transfer
  ctx.fillStyle = "rgba(10, 10, 15, 0.22)";
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  for (let x = 48; x < w; x += 340) {
    ctx.fillText("TRANSFER TAPE  ·  GRÁFICA LT", x, 46);
    ctx.fillText("RETIRAR EN DIAGONAL 45°  →", x, h - 30);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/**
 * Cara acrílica retroiluminada del Tótem Publicitario exterior (Acto 4).
 */
export function createTotemTexture() {
  const w = 512;
  const h = 1536;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Fondo negro profundo con ligero degradado arquitectónico
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0c0e17");
  bg.addColorStop(0.55, "#111420");
  bg.addColorStop(1, "#090a10");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Franja superior CMY luminosa
  const topGrad = ctx.createLinearGradient(0, 0, w, 0);
  topGrad.addColorStop(0, CYAN);
  topGrad.addColorStop(0.55, MAGENTA);
  topGrad.addColorStop(1, YELLOW);
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, w, 24);

  // Monograma LT estilizado en la parte superior del tótem
  ctx.save();
  ctx.translate(156, 120);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 14;

  // L exterior blanca
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(10, 10);
  ctx.lineTo(10, 102);
  ctx.quadraticCurveTo(10, 138, 46, 138);
  ctx.lineTo(90, 138);
  ctx.stroke();

  // L interior cyan
  ctx.strokeStyle = CYAN;
  ctx.beginPath();
  ctx.moveTo(34, 10);
  ctx.lineTo(34, 96);
  ctx.quadraticCurveTo(34, 114, 52, 114);
  ctx.lineTo(90, 114);
  ctx.stroke();

  // T interior magenta
  ctx.strokeStyle = MAGENTA;
  ctx.beginPath();
  ctx.moveTo(64, 34);
  ctx.lineTo(96, 34);
  ctx.quadraticCurveTo(116, 34, 116, 54);
  ctx.lineTo(116, 138);
  ctx.stroke();

  // T exterior blanca
  ctx.strokeStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(64, 10);
  ctx.lineTo(190, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(108, 10);
  ctx.quadraticCurveTo(140, 14, 140, 52);
  ctx.lineTo(140, 138);
  ctx.stroke();

  // Acento amarillo
  ctx.strokeStyle = YELLOW;
  ctx.beginPath();
  ctx.moveTo(158, 34);
  ctx.lineTo(190, 34);
  ctx.stroke();
  ctx.restore();

  // Wordmark GRÁFICA
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "700 54px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("GRÁFICA", w / 2, 345);

  // Separador CMY
  ctx.fillStyle = CYAN;
  ctx.fillRect(96, 386, 100, 6);
  ctx.fillStyle = MAGENTA;
  ctx.fillRect(206, 386, 100, 6);
  ctx.fillStyle = YELLOW;
  ctx.fillRect(316, 386, 100, 6);

  // Lista limpia de servicios iluminados
  const items: [string, string][] = [
    ["LETREROS 3D", CYAN],
    ["CAJAS DE LUZ", MAGENTA],
    ["SEÑALÉTICA", YELLOW],
    ["VINILOS", CYAN],
    ["TÓTEMS", MAGENTA],
  ];

  items.forEach(([label, color], i) => {
    const y = 520 + i * 132;
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(54, y - 54, w - 108, 92);
    ctx.fillStyle = color;
    ctx.fillRect(54, y - 54, 10, 92);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = "700 34px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillText(label, 88, y + 4);
  });

  // Pie del tótem
  ctx.textAlign = "center";
  ctx.fillStyle = CYAN;
  ctx.font = "700 30px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("GRAFICALT.CL", w / 2, 1340);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "500 22px Inter, system-ui, sans-serif";
  ctx.fillText("DISEÑO · PRODUCCIÓN · INSTALACIÓN", w / 2, 1390);

  // Franja inferior CMY
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, h - 18, w, 18);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Halo radial suave para retroiluminación LED del corpóreo 3D */
export function createGlowTexture(hexColor: string) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const g = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  g.addColorStop(0, hexColor);
  g.addColorStop(0.35, `${hexColor}88`);
  g.addColorStop(0.7, `${hexColor}22`);
  g.addColorStop(1, `${hexColor}00`);

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
