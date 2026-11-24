"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { LOGO_CORPOREAL_SVG, LOGO_VIEWBOX } from "./logoSvg";
import {
  createConcreteTextures,
  createFasciaTexture,
  createGlowTexture,
  createTotemTexture,
  createTransferTexture,
  createVinylTexture,
} from "./textures";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

type CorporealPiece = {
  mesh: THREE.Mesh;
  faceMat: THREE.MeshStandardMaterial;
  sideMat: THREE.MeshStandardMaterial;
  order: number;
  baseEmissive: number;
};

type Props = {
  /** Progreso normalizado [0..1] actualizado por GSAP */
  progressRef: React.MutableRefObject<number>;
};

export function StorefrontScene({ progressRef }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Renderer optimizado (sin shadowMap en tiempo real + DPR tope 1.5) ───
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#07080e");
    scene.fog = new THREE.FogExp2("#07080e", 0.032);

    // Entorno metálico sutil para reflejos reales en aluminio, vidrio y acrílico
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.45;

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      80,
    );

    // ─── Iluminación optimizada (solo 3 luces activas para 60fps fluidos) ────
    const hemiLight = new THREE.HemisphereLight("#8cb8ff", "#151722", 0.72);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#e4eeff", 1.25);
    keyLight.position.set(-5, 9, 10);
    scene.add(keyLight);

    // Luz LED frontal única que acompaña el encendido del corpóreo y tótem
    const accentLight = new THREE.PointLight("#1CA7E5", 0, 12, 1.5);
    accentLight.position.set(-1.5, 2.0, 2.2);
    scene.add(accentLight);

    // Focos decorativos bajo marquesina (sin PointLight extra para no saturar la GPU)
    const soffitPositions = [-3.6, -1.2, 1.2, 3.6];
    const fixtureGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 12);
    const fixtureMat = new THREE.MeshBasicMaterial({ color: "#ffe9cc" });
    soffitPositions.forEach((x) => {
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(x, 1.11, 0.52);
      scene.add(fixture);
    });

    // ─── Texturas procedurales ────────────────────────────────────────────────
    const concreteTex = createConcreteTextures();
    const fasciaTex = createFasciaTexture();
    const vinylTex = createVinylTexture();
    const transferTex = createTransferTexture();
    const totemTex = createTotemTexture();
    const glowCyanTex = createGlowTexture("#1CA7E5");
    const glowMagentaTex = createGlowTexture("#FB1988");
    const glowYellowTex = createGlowTexture("#EBE46E");
    const glowWhiteTex = createGlowTexture("#ffffff");
    const glowWarmTex = createGlowTexture("#ffcf96");

    // ─── 1. Arquitectura de la tienda (Fachada base) ──────────────────────────
    const storefront = new THREE.Group();
    scene.add(storefront);

    // Vereda / plaza de hormigón
    const groundMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      roughness: 0.45,
      metalness: 0.15,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(42, 26), groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -2.15, 4);
    storefront.add(ground);

    // Muros laterales de hormigón arquitectónico
    const wallMat = new THREE.MeshStandardMaterial({
      color: "#171a23",
      roughness: 0.78,
      metalness: 0.12,
    });
    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 5.6, 1.6), wallMat);
    leftPillar.position.set(-6.05, 0.65, -0.35);
    storefront.add(leftPillar);

    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 5.6, 1.6), wallMat);
    rightPillar.position.set(6.05, 0.65, -0.35);
    storefront.add(rightPillar);

    // Interior cálido del local detrás del vidrio (iluminado por emisivo/sprite, 0 costo GPU)
    const interiorBack = new THREE.Mesh(
      new THREE.PlaneGeometry(10.4, 4.2),
      new THREE.MeshStandardMaterial({
        color: "#221e20",
        emissive: "#3b2c20",
        emissiveIntensity: 0.55,
        roughness: 0.9,
      }),
    );
    interiorBack.position.set(0, -0.25, -2.5);
    storefront.add(interiorBack);

    const interiorFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(10.4, 3.2),
      new THREE.MeshStandardMaterial({ color: "#222024", roughness: 0.5, metalness: 0.1 }),
    );
    interiorFloor.rotation.x = -Math.PI / 2;
    interiorFloor.position.set(0, -2.12, -1.1);
    storefront.add(interiorFloor);

    // Halo cálido interior simulado en muro trasero (reemplaza PointLight interior)
    const warmBackdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(9.2, 3.8),
      new THREE.MeshBasicMaterial({
        map: glowWarmTex,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    warmBackdrop.position.set(0, 0.15, -2.42);
    storefront.add(warmBackdrop);

    // Lámparas colgantes minimalistas dentro del local
    [-2.4, 0, 2.4].forEach((x) => {
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.85, 6),
        new THREE.MeshStandardMaterial({ color: "#111", metalness: 0.8, roughness: 0.3 }),
      );
      rod.position.set(x, 0.72, -1.25);
      storefront.add(rod);

      const bulb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.24, 0.14, 16),
        new THREE.MeshStandardMaterial({
          color: "#222",
          emissive: "#ffcb8c",
          emissiveIntensity: 0.85,
          roughness: 0.3,
        }),
      );
      bulb.position.set(x, 0.28, -1.25);
      storefront.add(bulb);
    });

    // Marquesina superior de aluminio compuesto (ACM antracita)
    const fasciaMat = new THREE.MeshStandardMaterial({
      map: fasciaTex,
      roughness: 0.38,
      metalness: 0.58,
    });
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(11.6, 2.0, 1.25), fasciaMat);
    fascia.position.set(0, 2.12, 0.08);
    storefront.add(fascia);

    // Cornisa metálica fina en borde superior e inferior de la marquesina
    const trimMat = new THREE.MeshStandardMaterial({
      color: "#2c3140",
      metalness: 0.85,
      roughness: 0.22,
    });
    const topTrim = new THREE.Mesh(new THREE.BoxGeometry(11.72, 0.06, 1.32), trimMat);
    topTrim.position.set(0, 3.13, 0.1);
    storefront.add(topTrim);
    const botTrim = new THREE.Mesh(new THREE.BoxGeometry(11.72, 0.06, 1.32), trimMat);
    botTrim.position.set(0, 1.12, 0.1);
    storefront.add(botTrim);

    // Perfilería negra del ventanal de vidrio
    const mullionMat = new THREE.MeshStandardMaterial({
      color: "#11131a",
      metalness: 0.8,
      roughness: 0.28,
    });
    [-4.72, 2.95, 4.72].forEach((x) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.07, 3.26, 0.12), mullionMat);
      m.position.set(x, -0.52, 0.04);
      storefront.add(m);
    });
    const baseRail = new THREE.Mesh(new THREE.BoxGeometry(9.55, 0.14, 0.16), mullionMat);
    baseRail.position.set(0, -2.08, 0.04);
    storefront.add(baseRail);

    // Ventanal principal de vidrio (MeshStandardMaterial liviano con reflejo de entorno)
    const glassMat = new THREE.MeshStandardMaterial({
      color: "#b8d6f0",
      transparent: true,
      opacity: 0.18,
      roughness: 0.08,
      metalness: 0.35,
    });
    const glassPane = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 3.18), glassMat);
    glassPane.position.set(0, -0.5, 0.04);
    storefront.add(glassPane);

    // ─── 2. ACTO 2 — Corpóreo 3D Real (Logo Gráfica LT extruido) ──────────────
    const corporealAnchor = new THREE.Group();
    corporealAnchor.position.set(0, 2.12, 0.71);
    storefront.add(corporealAnchor);

    // Guía técnica de instalación
    const guideMat = new THREE.LineBasicMaterial({
      color: "#1CA7E5",
      transparent: true,
      opacity: 0,
    });
    const guideGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(7.7, 1.56));
    const guideBox = new THREE.LineSegments(guideGeo, guideMat);
    guideBox.position.set(0, 0, 0.01);
    corporealAnchor.add(guideBox);

    const logoGroup = new THREE.Group();
    const logoScale = 0.0218;
    logoGroup.scale.set(logoScale, -logoScale, 1);
    logoGroup.position.set(
      -(LOGO_VIEWBOX.width * logoScale) / 2,
      (LOGO_VIEWBOX.height * logoScale) / 2,
      0,
    );
    corporealAnchor.add(logoGroup);

    const svgLoader = new SVGLoader();
    const parsedSvg = svgLoader.parse(LOGO_CORPOREAL_SVG);
    const corporealPieces: CorporealPiece[] = [];

    const colorConfig: Record<
      string,
      { face: string; side: string; emissive: string; baseEmissive: number }
    > = {
      white: {
        face: "#f6f8fc",
        side: "#2b3245",
        emissive: "#ffffff",
        baseEmissive: 0.45,
      },
      cyan: {
        face: "#1CA7E5",
        side: "#0a4f73",
        emissive: "#1CA7E5",
        baseEmissive: 0.78,
      },
      magenta: {
        face: "#FB1988",
        side: "#6e083b",
        emissive: "#FB1988",
        baseEmissive: 0.78,
      },
      yellow: {
        face: "#EBE46E",
        side: "#6c6619",
        emissive: "#EBE46E",
        baseEmissive: 0.7,
      },
    };

    parsedSvg.paths.forEach((svgPath) => {
      const node = svgPath.userData?.node as Element | undefined;
      const colorKey = node?.getAttribute("data-color") || "white";
      const order = Number(node?.getAttribute("data-order") || "0");
      const cfg = colorConfig[colorKey] || colorConfig.white;

      const shapes = SVGLoader.createShapes(svgPath);
      shapes.forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 0.34,
          bevelEnabled: true,
          bevelThickness: 0.024,
          bevelSize: 0.65,
          bevelSegments: 2,
          curveSegments: 14,
        });

        const faceMat = new THREE.MeshStandardMaterial({
          color: cfg.face,
          emissive: cfg.emissive,
          emissiveIntensity: 0,
          roughness: 0.2,
          metalness: 0.12,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
        });

        const sideMat = new THREE.MeshStandardMaterial({
          color: cfg.side,
          emissive: cfg.emissive,
          emissiveIntensity: 0,
          roughness: 0.28,
          metalness: 0.76,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(geo, [faceMat, sideMat]);
        mesh.scale.z = 0.01;
        mesh.visible = false;
        logoGroup.add(mesh);

        corporealPieces.push({
          mesh,
          faceMat,
          sideMat,
          order,
          baseEmissive: cfg.baseEmissive,
        });
      });
    });

    // Halos LED traseros (retroiluminación rápida por sprites aditivos)
    const haloSpecs: [THREE.Texture, number, number, number, number][] = [
      [glowCyanTex, -3.15, -0.05, 2.3, 2.0],
      [glowMagentaTex, -2.55, -0.05, 2.2, 2.0],
      [glowYellowTex, -2.05, 0.35, 1.4, 1.2],
      [glowWhiteTex, 1.05, 0.0, 6.4, 1.8],
    ];
    const haloMats: THREE.MeshBasicMaterial[] = [];
    haloSpecs.forEach(([tex, x, y, w, h]) => {
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      plane.position.set(x, y, 0.006);
      corporealAnchor.add(plane);
      haloMats.push(mat);
    });

    // ─── 3. ACTO 3 — Vinil en vitrina + Retiro físico 3D del Transfer ─────────
    const VINYL_W = 8.9;
    const VINYL_H = 3.0;

    const vinylUniforms = {
      uMap: { value: vinylTex },
      uPeel: { value: 0 },
      uOpacity: { value: 0 },
    };
    const vinylShaderMat = new THREE.ShaderMaterial({
      uniforms: vinylUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform float uPeel;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec4 tex = texture2D(uMap, vUv);
          float diag = vUv.x * 0.78 + (1.0 - vUv.y) * 0.22;
          float revealed = 1.0 - smoothstep(uPeel - 0.035, uPeel + 0.01, diag);
          float alpha = tex.a * uOpacity * mix(0.22, 1.0, revealed);
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(tex.rgb, alpha);
          #include <colorspace_fragment>
        }
      `,
    });
    const vinylMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(VINYL_W, VINYL_H),
      vinylShaderMat,
    );
    vinylMesh.position.set(0, -0.5, 0.085);
    storefront.add(vinylMesh);

    // Malla optimizada 36×14 (4× más liviana para CPU, misma suavidad visual)
    const transferGeo = new THREE.PlaneGeometry(VINYL_W, VINYL_H, 36, 14);
    const baseTransferPos = new Float32Array(transferGeo.attributes.position.array);
    const transferMat = new THREE.MeshStandardMaterial({
      map: transferTex,
      roughness: 0.72,
      metalness: 0.05,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const transferMesh = new THREE.Mesh(transferGeo, transferMat);
    transferMesh.position.set(0, -0.5, 0.11);
    transferMesh.visible = false;
    storefront.add(transferMesh);

    function updateTransferDeform(peel: number) {
      const pos = transferGeo.attributes.position;
      const arr = pos.array as Float32Array;
      const front = -0.06 + peel * 1.24;
      const curlRadius = 0.44;
      const curlBand = 0.17;
      const dirX = 0.88;
      const dirY = -0.47;

      for (let i = 0; i < pos.count; i++) {
        const i3 = i * 3;
        const x0 = baseTransferPos[i3];
        const y0 = baseTransferPos[i3 + 1];

        const u = x0 / VINYL_W + 0.5;
        const v = 0.5 - y0 / VINYL_H;
        const diag = u * 0.78 + v * 0.22;
        const delta = front - diag;

        if (delta <= 0) {
          arr[i3] = x0;
          arr[i3 + 1] = y0;
          arr[i3 + 2] = 0;
        } else if (delta < curlBand) {
          const theta = (delta / curlBand) * Math.PI;
          const pull = delta * 3.1;
          arr[i3] = x0 + dirX * (pull - Math.sin(theta) * curlRadius * 0.45);
          arr[i3 + 1] = y0 + dirY * (pull - Math.sin(theta) * curlRadius * 0.45);
          arr[i3 + 2] = (1 - Math.cos(theta)) * curlRadius;
        } else {
          const extra = (delta - curlBand) * 6.8;
          arr[i3] = x0 + dirX * (curlBand * 3.1 + extra);
          arr[i3 + 1] = y0 + dirY * (curlBand * 3.1 + extra * 0.65);
          arr[i3 + 2] = 2 * curlRadius + extra * 0.18;
        }
      }
      pos.needsUpdate = true;
      transferGeo.computeVertexNormals();
    }

    // ─── 4. ACTO 4 — Tótem Publicitario 3D Iluminado en primer plano ──────────
    const totemGroup = new THREE.Group();
    const TOTEM_REST_Y = -2.15;
    totemGroup.position.set(4.15, TOTEM_REST_Y - 3.9, 2.05);
    totemGroup.rotation.y = -0.36;
    totemGroup.visible = false;
    storefront.add(totemGroup);

    const totemBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.36, 0.18, 0.52),
      new THREE.MeshStandardMaterial({ color: "#1c202c", metalness: 0.85, roughness: 0.25 }),
    );
    totemBase.position.set(0, 0.09, 0);
    totemGroup.add(totemBase);

    const totemBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 3.55, 0.28),
      new THREE.MeshStandardMaterial({ color: "#12151f", metalness: 0.78, roughness: 0.28 }),
    );
    totemBody.position.set(0, 1.94, 0);
    totemGroup.add(totemBody);

    const totemFaceMat = new THREE.MeshStandardMaterial({
      map: totemTex,
      emissiveMap: totemTex,
      emissive: new THREE.Color("#ffffff"),
      emissiveIntensity: 0,
      roughness: 0.14,
      metalness: 0.08,
    });
    const totemFace = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 3.36), totemFaceMat);
    totemFace.position.set(0, 1.94, 0.145);
    totemGroup.add(totemFace);

    const leftStripMat = new THREE.MeshStandardMaterial({
      color: "#1CA7E5",
      emissive: "#1CA7E5",
      emissiveIntensity: 0,
      roughness: 0.2,
    });
    const leftStrip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 3.45, 0.06), leftStripMat);
    leftStrip.position.set(-0.59, 1.94, 0.06);
    totemGroup.add(leftStrip);

    const rightStripMat = new THREE.MeshStandardMaterial({
      color: "#FB1988",
      emissive: "#FB1988",
      emissiveIntensity: 0,
      roughness: 0.2,
    });
    const rightStrip = new THREE.Mesh(new THREE.BoxGeometry(0.035, 3.45, 0.06), rightStripMat);
    rightStrip.position.set(0.59, 1.94, 0.06);
    totemGroup.add(rightStrip);

    const topStripMat = new THREE.MeshStandardMaterial({
      color: "#EBE46E",
      emissive: "#EBE46E",
      emissiveIntensity: 0,
      roughness: 0.2,
    });
    const topStrip = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.04, 0.29), topStripMat);
    topStrip.position.set(0, 3.73, 0);
    totemGroup.add(topStrip);

    // Reflejo luminoso del tótem en la vereda (plano aditivo en lugar de PointLight)
    const totemSpillMat = new THREE.MeshBasicMaterial({
      map: glowCyanTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const totemSpill = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), totemSpillMat);
    totemSpill.rotation.x = -Math.PI / 2;
    totemSpill.position.set(0, 0.02, 0.65);
    totemGroup.add(totemSpill);

    // ─── Visibilidad en viewport: pausa 100% WebGL al bajar a Servicios ───────
    let isInView = true;
    const io = new IntersectionObserver(
      (entries) => {
        isInView = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: 0.01 },
    );
    io.observe(container);

    // ─── Parallax sutil del mouse ─────────────────────────────────────────────
    const pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
    let needsRender = true;
    const onPointerMove = (e: PointerEvent) => {
      if (!isInView || e.pointerType !== "mouse") return;
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      needsRender = true;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // ─── Resize responsivo ────────────────────────────────────────────────────
    let aspect = container.clientWidth / Math.max(container.clientHeight, 1);
    const updateSize = () => {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      aspect = w / h;
      camera.aspect = aspect;
      camera.fov = aspect < 0.85 ? 56 : aspect < 1.25 ? 48 : 40;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      needsRender = true;
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(container);

    // ─── Loop inteligente (renderiza solo cuando está visible y hay cambios) ──
    const camPos = new THREE.Vector3();
    const camLook = new THREE.Vector3();
    let lastProgress = -1;
    let lastPeel = -1;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isInView || document.hidden) return;

      const p = clamp01(progressRef.current);
      const dx = pointer.x - pointer.smoothX;
      const dy = pointer.y - pointer.smoothY;
      const pointerMoving = Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001;
      const progressMoving = Math.abs(p - lastProgress) > 0.0001;

      if (!needsRender && !progressMoving && !pointerMoving) return;
      needsRender = false;

      if (pointerMoving) {
        pointer.smoothX += dx * 0.06;
        pointer.smoothY += dy * 0.06;
      }

      if (progressMoving) {
        lastProgress = p;

        // 1) Guía técnica
        const guideIn = smoothstep(0.08, 0.18, p);
        const guideOut = 1 - smoothstep(0.32, 0.44, p);
        guideMat.opacity = guideIn * guideOut * 0.45;

        // 2) Extrusión 2D -> 3D del corpóreo Gráfica LT
        const ledPower = smoothstep(0.35, 0.52, p);
        for (const piece of corporealPieces) {
          const start = 0.15 + (piece.order / 12) * 0.14;
          const local = clamp01((p - start) / 0.19);
          piece.mesh.visible = local > 0.005;
          if (!piece.mesh.visible) continue;

          const fade = smoothstep(0, 0.25, local);
          const extrude = easeOutCubic(clamp01((local - 0.18) / 0.82));

          piece.mesh.scale.z = 0.015 + extrude * 0.985;
          piece.faceMat.opacity = fade;
          piece.sideMat.opacity = fade;
          piece.faceMat.emissiveIntensity = piece.baseEmissive * ledPower;
          piece.sideMat.emissiveIntensity = piece.baseEmissive * 0.22 * ledPower;
        }

        haloMats.forEach((m, idx) => {
          m.opacity = ledPower * (idx === 3 ? 0.28 : 0.52);
        });
        accentLight.intensity = ledPower * 2.4;

        // 3) Vinil en vitrina + retiro físico 3D del transfer
        const vinylIn = smoothstep(0.45, 0.52, p);
        const peel = clamp01((p - 0.51) / 0.27);
        const transferOut = 1 - smoothstep(0.75, 0.82, p);

        vinylUniforms.uOpacity.value = vinylIn;
        vinylUniforms.uPeel.value = peel;

        const transferAlpha = vinylIn * transferOut * 0.92;
        transferMesh.visible = transferAlpha > 0.01;
        transferMat.opacity = transferAlpha;
        if (transferMesh.visible && Math.abs(peel - lastPeel) > 0.002) {
          updateTransferDeform(peel);
          lastPeel = peel;
        }

        // 4) Tótem publicitario iluminado
        const totemRise = easeOutCubic(clamp01((p - 0.75) / 0.16));
        const totemGlow = smoothstep(0.83, 0.96, p);
        totemGroup.visible = totemRise > 0.005;
        totemGroup.position.y = TOTEM_REST_Y - (1 - totemRise) * 3.85;
        totemFaceMat.emissiveIntensity = totemGlow * 0.95;
        leftStripMat.emissiveIntensity = totemGlow * 2.2;
        rightStripMat.emissiveIntensity = totemGlow * 2.2;
        topStripMat.emissiveIntensity = totemGlow * 1.8;
        totemSpillMat.opacity = totemGlow * 0.42;
      }

      // 5) Coreografía de cámara
      const zoomOffset = aspect < 0.85 ? 4.4 : aspect < 1.25 ? 2.0 : 0;

      const t1 = smoothstep(0.14, 0.46, p);
      const t2 = smoothstep(0.47, 0.74, p);
      const t3 = smoothstep(0.75, 0.98, p);

      let cx = THREE.MathUtils.lerp(0.0, -1.85, t1);
      let cy = THREE.MathUtils.lerp(0.45, 1.5, t1);
      let cz = THREE.MathUtils.lerp(9.6, 6.9, t1);

      let lx = THREE.MathUtils.lerp(0.0, 0.1, t1);
      let ly = THREE.MathUtils.lerp(0.55, 1.95, t1);
      let lz = THREE.MathUtils.lerp(0.0, 0.45, t1);

      cx = THREE.MathUtils.lerp(cx, 0.9, t2);
      cy = THREE.MathUtils.lerp(cy, -0.1, t2);
      cz = THREE.MathUtils.lerp(cz, 7.25, t2);

      lx = THREE.MathUtils.lerp(lx, -0.1, t2);
      ly = THREE.MathUtils.lerp(ly, -0.35, t2);
      lz = THREE.MathUtils.lerp(lz, 0.1, t2);

      cx = THREE.MathUtils.lerp(cx, -1.1, t3);
      cy = THREE.MathUtils.lerp(cy, 0.38, t3);
      cz = THREE.MathUtils.lerp(cz, 10.1, t3);

      lx = THREE.MathUtils.lerp(lx, 0.8, t3);
      ly = THREE.MathUtils.lerp(ly, 0.35, t3);
      lz = THREE.MathUtils.lerp(lz, 0.35, t3);

      camPos.set(
        cx + pointer.smoothX * 0.28,
        cy - pointer.smoothY * 0.16,
        cz + zoomOffset,
      );
      camLook.set(lx, ly, lz);

      camera.position.copy(camPos);
      camera.lookAt(camLook);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      [
        concreteTex,
        fasciaTex,
        vinylTex,
        transferTex,
        totemTex,
        glowCyanTex,
        glowMagentaTex,
        glowYellowTex,
        glowWhiteTex,
        glowWarmTex,
      ].forEach((t) => t.dispose());

      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progressRef]);

  return <div ref={mountRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
