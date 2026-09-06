import * as THREE from "three";

/**
 * The hero's background scene: three layers on one canvas, one render loop.
 *   aurora  — a full-screen noise field that carries the palette + a cursor glow
 *   lattice — a tilted grid of cells that ripples and warms under the pointer
 *   liquid  — a raymarched zero-gravity water blob that reaches toward the pointer
 *
 * Colours are read from CSS custom properties on <body>, so the theme stays the
 * single source of truth. Call refreshPalette() after a theme change; the loop
 * eases toward the new colours. Call dispose() to tear everything down.
 */
export function createForgeScene(canvas: HTMLCanvasElement) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── palette (read from CSS, never hard-coded) ──
  function readPalette() {
    const s = getComputedStyle(document.body);
    const get = (name: string) => new THREE.Color(s.getPropertyValue(name).trim() || "#000");
    return {
      ground: get("--ground"),
      steel: get("--steel"),
      forge: get("--forge"),
      ink: get("--ink"),
      dark: parseFloat(s.getPropertyValue("--is-dark")) || 0,
    };
  }

  const pal = readPalette();
  const cur = {
    ground: pal.ground.clone(),
    steel: pal.steel.clone(),
    forge: pal.forge.clone(),
    ink: pal.ink.clone(),
    dark: pal.dark,
  };
  let target = readPalette();
  let fading = 0;

  function refreshPalette() {
    // Wait a frame so the CSS variables have actually swapped over.
    requestAnimationFrame(() => {
      target = readPalette();
      fading = 1;
    });
  }

  // ── renderer ──
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  } catch {
    return { refreshPalette() {}, dispose() {} }; // no WebGL: the page is complete without it
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 0, 12);

  // ── layer 1: aurora ──
  const auroraUniforms = {
    uTime: { value: 0 },
    uGround: { value: cur.ground },
    uSteel: { value: cur.steel },
    uForge: { value: cur.forge },
    uDark: { value: cur.dark },
    uIntensity: { value: 1 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uAspect: { value: 1.6 },
  };

  const aurora = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 70),
    new THREE.ShaderMaterial({
      uniforms: auroraUniforms,
      depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float; varying vec2 vUv;
        uniform float uTime, uDark, uIntensity, uHover, uAspect; uniform vec3 uGround, uSteel, uForge; uniform vec2 uMouse;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
        float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
        void main(){
          vec2 p = vUv * vec2(2.2, 1.3); float t = uTime * 0.05;
          vec2 warp = vec2(fbm(p*1.7 + t), fbm(p*1.7 - t + 4.7));
          vec2 md = vUv - uMouse; warp += md * 0.5 * exp(-dot(md, md) * 6.0);
          float n = fbm(p*2.2 + warp*1.8 + vec2(0.0, t*1.5));
          float band = fbm(p*0.95 - warp*0.7 - t*0.85);
          // Dark mode adds light; light mode lays pigment down instead.
          vec3 lit = mix(uGround, uSteel*0.9, smoothstep(0.26,0.84,n));
          lit += uForge * smoothstep(0.5,0.95, n*band*1.9) * 0.85;
          vec3 pig = mix(uGround, uSteel, smoothstep(0.3,0.9,n) * 0.80);
          pig = mix(pig, uForge, smoothstep(0.52,0.98, n*band*1.9) * 0.52);
          vec3 col = mix(pig, lit, uDark);
          // A tight forge glow follows the pointer on hover (aspect-corrected so it's a round pool).
          vec2 hmd = vec2(md.x * uAspect, md.y);
          float hov = exp(-dot(hmd, hmd) * 55.0) * uHover;
          col += uForge * hov * mix(0.3, 0.55, uDark);
          col = mix(uGround, col, uIntensity);
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }`,
    }),
  );
  aurora.position.z = -22;
  scene.add(aurora);

  // ── layer 2: lattice ──
  const GRID = 40;
  const GAP = 0.6;
  const latticeCount = GRID * GRID;
  const latticeMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.74 });
  // No vertexColors: that expects a geometry colour attribute BoxGeometry lacks and
  // would zero every instance to black. InstancedMesh applies setColorAt() on its own.
  const lattice = new THREE.InstancedMesh(new THREE.BoxGeometry(0.17, 0.17, 0.17), latticeMat, latticeCount);
  lattice.position.set(0, -3.4, -6);
  lattice.rotation.x = -0.64;
  scene.add(lattice);

  const cells: { x: number; z: number }[] = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      cells.push({ x: (i - GRID / 2 + 0.5) * GAP, z: (j - GRID / 2 + 0.5) * GAP });
    }
  }

  const dummy = new THREE.Object3D();
  const cellColor = new THREE.Color();
  const pointer = { x: 0, z: 0, active: false };
  let heat = 0;
  let heatTarget = 0; // a gentle whole-field breath while a project row is hovered

  function updateLattice(t: number, intensity: number, calm: number) {
    heat += (heatTarget - heat) * 0.06;
    for (let k = 0; k < latticeCount; k++) {
      const c = cells[k];
      // Rest state is a slow terrain of layered waves, not a bullseye ripple.
      const terrain =
        Math.sin(c.x * 0.55 + t * 0.4) * Math.cos(c.z * 0.5 - t * 0.3) * 0.28 +
        Math.sin((c.x + c.z) * 0.32 + t * 0.55) * 0.18;

      let ripple = 0;
      let local = 0;
      if (pointer.active) {
        const dx = c.x - pointer.x;
        const dz = c.z - pointer.z;
        const d = Math.sqrt(dx * dx + dz * dz);
        const falloff = Math.max(0, 1 - d / 4.6);
        local = falloff * falloff;
        ripple = local * Math.cos(d * 1.5 - t * 3.0) * 1.3;
      }

      const y = (terrain + ripple + heat * 0.12) * intensity;
      dummy.position.set(c.x, y, c.z);
      dummy.scale.set(1, 0.5 + Math.max(0, y) * 1.6 + local * 1.3 + heat * 0.3, 1);
      dummy.updateMatrix();
      lattice.setMatrixAt(k, dummy.matrix);

      const lift = Math.min(1, Math.max(0, (y + 0.45) / 1.5));
      // Warmth stays local to the cursor; hover only breathes a little colour into the whole field.
      const warm = Math.min(1, lift * 0.3 + local * 1.1 + heat * 0.18);
      cellColor.copy(cur.steel).lerp(cur.forge, warm);
      const gain =
        cur.dark > 0.5 ? 0.32 + lift * 0.6 + local * 0.9 + heat * 0.15 : 0.55 + lift * 0.28 + local * 0.35 + heat * 0.08;
      cellColor.multiplyScalar(gain);
      // On paper the cells stay pale; everywhere they calm down behind content.
      cellColor.lerp(cur.ground, cur.dark > 0.5 ? 0.3 * calm : 0.42 + 0.3 * calm);
      lattice.setColorAt(k, cellColor);
    }
    lattice.instanceMatrix.needsUpdate = true;
    if (lattice.instanceColor) lattice.instanceColor.needsUpdate = true;
  }

  // ── layer 3: monogram + liquid ──
  const monoCanvas = document.createElement("canvas");
  monoCanvas.width = 1024;
  monoCanvas.height = 512;
  const monoTex = new THREE.CanvasTexture(monoCanvas);
  monoTex.colorSpace = THREE.SRGBColorSpace;

  function drawMonogram() {
    const g = monoCanvas.getContext("2d")!;
    g.clearRect(0, 0, 1024, 512);
    g.fillStyle = "#fff";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "italic 600 340px Fraunces, Georgia, serif";
    g.fillText("JVS", 512, 286);
    monoTex.needsUpdate = true;
  }
  drawMonogram();
  document.fonts?.load("italic 600 380px Fraunces").then(drawMonogram).catch(() => {});

  const monogramMat = new THREE.MeshBasicMaterial({
    map: monoTex,
    transparent: true,
    color: cur.ink,
    opacity: 0.9,
    depthWrite: false,
  });
  const monogram = new THREE.Mesh(new THREE.PlaneGeometry(11, 5.5), monogramMat);
  monogram.position.set(2.4, 0.8, -1.6);
  scene.add(monogram);

  const liquidUniforms = {
    uTime: { value: 0 },
    uClick: { value: new THREE.Vector2(0, 0) },
    uClickTime: { value: -100 },
    uPointer: { value: new THREE.Vector2(0, 0) },
    uPntStr: { value: 0 },
    uSteel: { value: cur.steel },
    uForge: { value: cur.forge },
    uGround: { value: cur.ground },
    uDark: { value: cur.dark },
    uIntensity: { value: 1 },
    uSteps: { value: 64 },
  };

  const liquid = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.ShaderMaterial({
      uniforms: liquidUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        precision highp float; varying vec2 vUv;
        uniform float uTime, uDark, uIntensity, uSteps, uClickTime; uniform vec2 uClick;
        uniform vec2 uPointer; uniform float uPntStr;
        uniform vec3 uSteel, uForge, uGround;

        float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0); return mix(b, a, h) - k*h*(1.0-h); }

        // Each mass drifts slowly; a click shoves them away from the point, then the shove dies out.
        vec3 centre(int i, float t, float age){
          float f = float(i);
          vec3 c = vec3(sin(t*0.32 + f*1.7)*0.7, cos(t*0.27 + f*2.3)*0.85, sin(t*0.23 + f*0.9)*0.6);
          vec2 away = c.xy - uClick;
          float kick = exp(-age*1.6) * sin(age*7.0) * 0.35 / (0.6 + length(away));
          c.xy += normalize(away + 0.001) * kick;
          return c;
        }
        float sdLiquid(vec3 p, float t, float age){
          float d = 1e5;
          for (int i = 0; i < 7; i++){
            float r = (i < 4 ? 0.46 : 0.2) + 0.08*sin(t*0.5 + float(i)*1.3);
            d = smin(d, length(p - centre(i, t, age)) - r, 0.75);
          }
          // Surface waves keep the skin moving; a click sends a ring outward that fades.
          d += 0.05 * sin(p.x*3.1 + t*1.1) * sin(p.y*2.6 - t*0.9) * sin(p.z*2.2 + t*0.7);
          float rc = length(p.xy - uClick);
          d += 0.06 * sin(rc*9.0 - age*9.0) * exp(-age*1.4) * exp(-rc*0.9);
          // Meniscus: the skin nearest the pointer reaches toward it, gated to the existing surface
          // so it can only lift skin that is already there, never grow a limb into empty air.
          vec2 toP = uPointer - p.xy;
          float pull = uPntStr * exp(-dot(toP, toP) * 2.2) * (1.0 + 0.12 * sin(t * 6.0));
          d -= 0.22 * pull * smoothstep(0.5, 0.0, d);
          return d;
        }
        vec3 normalAt(vec3 p, float t, float age){
          vec2 e = vec2(0.012, 0.0);
          return normalize(vec3(sdLiquid(p+e.xyy,t,age) - sdLiquid(p-e.xyy,t,age),
                                sdLiquid(p+e.yxy,t,age) - sdLiquid(p-e.yxy,t,age),
                                sdLiquid(p+e.yyx,t,age) - sdLiquid(p-e.yyx,t,age)));
        }
        void main(){
          float t = uTime, age = max(0.0, uTime - uClickTime);
          vec3 ro = vec3((vUv - 0.5) * 4.0, 3.0);
          vec3 rd = vec3(0.0, 0.0, -1.0);
          float dist = 0.0, d = 1e5;
          vec3 p = ro;
          for (int i = 0; i < 96; i++){
            if (float(i) >= uSteps) break;
            p = ro + rd * dist;
            d = sdLiquid(p, t, age);
            if (d < 0.002 || dist > 6.0) break;
            dist += d;
          }
          if (d > 0.02) discard;
          vec3 n = normalAt(p, t, age);
          vec3 l = normalize(vec3(0.6, 0.8, 1.0));
          vec3 v = vec3(0.0, 0.0, 1.0);
          float diff = max(dot(n, l), 0.0);
          float spec = pow(max(dot(reflect(-l, n), v), 0.0), 64.0);
          float spec2 = pow(max(dot(reflect(-normalize(vec3(-0.7, 0.3, 0.8)), n), v), 0.0), 24.0);
          float fres = pow(1.0 - max(dot(n, v), 0.0), 2.5);
          // Fine capillary ripples ride out from the pointer (shading only).
          vec2 sp = p.xy - uPointer; float pr = length(sp); vec2 pdir = sp / (pr + 1e-3);
          float rip = sin(pr*26.0 - t*6.0) * exp(-pr*2.2);
          n = normalize(n + vec3(pdir * rip * 0.14 * uPntStr, 0.0));
          // Translucent body in the theme's steel: clear in the middle, dense at the rim.
          vec3 tint = mix(uSteel, mix(uSteel, vec3(1.0), 0.5), smoothstep(-0.2, 1.0, n.y) * 0.5);
          vec3 col = tint * (0.55 + 0.45 * diff);
          col = mix(col, uForge, fres * (0.08 + 0.35 * uDark));
          col += vec3(1.0) * (spec * 0.95 + spec2 * 0.25);
          float alpha = min(1.0, 0.32 + 0.6 * fres + spec * 0.4);
          // A light hovers in front of the pointer: a glint slides across the bulge, a warm caustic
          // focuses through the clear belly. Shading only, so it stays inside the silhouette.
          vec3 lp = vec3(uPointer, 1.6); vec3 ld = normalize(lp - p);
          float ps = pow(max(dot(reflect(-ld, n), v), 0.0), 90.0);
          vec2 cp = uPointer + n.xy * 0.35; float cr = length(p.xy - cp);
          float caus = pow(max(exp(-cr*cr*3.5) * (0.6 + 0.4*sin(cr*14.0 - t*3.0)), 0.0), 1.5) * (1.0 - fres);
          vec3 warm = mix(vec3(1.0), uForge, 0.35);
          col += (ps * 0.9 + caus * 0.7) * uPntStr * warm;
          col += max(dot(n, ld), 0.0) * 0.12 * uPntStr * uSteel;
          alpha = min(1.0, alpha + (ps * 0.25 + caus * 0.12) * uPntStr);
          col = mix(uGround, col, uIntensity);
          float edge = 1.0 - smoothstep(0.0, 0.02, d);
          gl_FragColor = vec4(col, alpha * edge * uIntensity);
          #include <colorspace_fragment>
        }`,
    }),
  );
  liquid.position.set(3.6, 0.5, 2);
  scene.add(liquid);

  // ── pointer + scroll input ──
  const ray = new THREE.Raycaster();
  const liquidPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -2);
  const hit = new THREE.Vector3();
  const ndc = new THREE.Vector2();
  const latNdc = new THREE.Vector2();
  const latPlane = new THREE.Plane();
  const latN = new THREE.Vector3();
  const latHit = new THREE.Vector3();
  const ptrTarget = new THREE.Vector2();
  let ptrNear = 0; // 1 over the blob, 0 out toward the headline
  let aurLastMove = -100; // the aurora glow fades ~1s after the cursor stops

  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

  function overlap(el: HTMLElement | null, y: number, vh: number) {
    if (!el) return 0;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    const visible = Math.min(bottom, y + vh) - Math.max(top, y);
    return clamp01(visible / Math.max(1, vh * 0.5));
  }

  // Scroll sets a target per layer; the loop eases toward it, so layers cross-fade.
  const stage = { aurora: 1, lattice: 1, liquid: 1, heroOut: 1 };
  const stageTarget = { aurora: 1, lattice: 1, liquid: 1, heroOut: 1 };

  function updateStaging() {
    const y = scrollY;
    const vh = innerHeight || 1;
    const heroOut = clamp01(1 - y / (vh * 0.85));
    const inWork = overlap(document.getElementById("work"), y, vh);
    const inPath = overlap(document.getElementById("path"), y, vh);
    const inContact = overlap(document.getElementById("contact"), y, vh);
    stageTarget.heroOut = heroOut;
    stageTarget.liquid = heroOut;
    stageTarget.lattice = Math.max(heroOut, inWork, inPath * 0.45);
    stageTarget.aurora = Math.max(0.34, heroOut, inContact);
  }

  function onPointerMove(e: PointerEvent) {
    const nx = e.clientX / innerWidth;
    const ny = e.clientY / innerHeight;
    auroraUniforms.uMouse.value.set(nx, 1 - ny);
    aurLastMove = performance.now() / 1000;
    latNdc.set(nx * 2 - 1, 1 - ny * 2);
    pointer.active = true;
    // Where the pointer lands on the liquid's plane, and how near the blob it is.
    ndc.set(nx * 2 - 1, 1 - ny * 2);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(liquidPlane, hit)) {
      const s = liquid.scale.x || 1;
      ptrTarget.set((hit.x - liquid.position.x) / (2 * s), (hit.y - liquid.position.y) / (2 * s));
      const q = clamp01((Math.hypot(ptrTarget.x, ptrTarget.y) - 1.2) / 1.4);
      ptrNear = 1 - q * q * (3 - 2 * q);
    }
  }

  function onPointerDown(e: PointerEvent) {
    ndc.set((e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2);
    ray.setFromCamera(ndc, camera);
    if (!ray.ray.intersectPlane(liquidPlane, hit)) return;
    const s = liquid.scale.x || 1;
    liquidUniforms.uClick.value.set((hit.x - liquid.position.x) / (2 * s), (hit.y - liquid.position.y) / (2 * s));
    liquidUniforms.uClickTime.value = performance.now() / 1000;
  }

  function clearPointer() {
    ptrNear = 0;
    aurLastMove = -100;
  }
  function onPointerOut(e: PointerEvent) {
    if (!e.relatedTarget) clearPointer(); // only when the cursor leaves the window entirely
  }

  function resize() {
    const w = innerWidth;
    const h = innerHeight;
    camera.aspect = w / h;
    auroraUniforms.uAspect.value = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, w > 1400 ? 1.25 : 1.5));
    renderer.setSize(w, h, false);
    // Pin the liquid near the right edge so it stays clear of the headline; up top on narrow screens.
    const halfW = Math.tan((camera.fov * Math.PI) / 360) * 10 * camera.aspect;
    if (w > 900) liquid.position.set(0.72 * halfW, 0.5, 2);
    else liquid.position.set(0, 2.8, 2);
    liquid.userData.size = w > 1400 ? 1 : 0.82;
    monogram.position.x = liquid.position.x - 1.0;
  }

  const onResize = () => {
    resize();
    updateStaging();
  };

  // Project the cursor onto the lattice's real (tilted, scroll-settled) plane so the heat sits under it.
  function projectPointerToLattice() {
    lattice.updateMatrixWorld();
    latN.set(0, 1, 0).transformDirection(lattice.matrixWorld);
    latPlane.setFromNormalAndCoplanarPoint(latN, lattice.position);
    ray.setFromCamera(latNdc, camera);
    if (ray.ray.intersectPlane(latPlane, latHit)) {
      lattice.worldToLocal(latHit);
      pointer.x = latHit.x;
      pointer.z = latHit.z;
    }
  }

  // Project rows warm the whole field a little while hovered.
  const rows = [...document.querySelectorAll<HTMLElement>(".ledger li, .feature")];
  const onRowEnter = () => (heatTarget = 1);
  const onRowLeave = () => (heatTarget = 0);
  for (const row of rows) {
    row.addEventListener("pointerenter", onRowEnter);
    row.addEventListener("pointerleave", onRowLeave);
  }

  addEventListener("pointermove", onPointerMove, { passive: true });
  addEventListener("pointerdown", onPointerDown);
  addEventListener("blur", clearPointer);
  addEventListener("pointerout", onPointerOut);
  addEventListener("resize", onResize);
  addEventListener("scroll", updateStaging, { passive: true });
  resize();
  updateStaging();

  // ── quality tiers: A full, B lighter lattice/liquid, C static (no 3D motion) ──
  let tier = innerWidth < 760 ? "B" : "A";
  if (reduced) tier = "C";
  let slowFrames = 0;
  function checkTier(fps: number) {
    if (tier === "A" && fps < 38) {
      if (++slowFrames > 12) {
        tier = "B";
        slowFrames = 0;
      }
    } else if (tier === "B" && fps < 22) {
      if (++slowFrames > 12) tier = "C";
    } else {
      slowFrames = 0;
    }
  }

  // ── render loop ──
  let rafId = 0;
  let last = performance.now();
  let fpsAvg = 60;
  let frame = 0;

  function tick(now: number) {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const t = now / 1000;

    if (fading > 0) {
      const k = Math.min(1, dt * 4);
      cur.ground.lerp(target.ground, k);
      cur.steel.lerp(target.steel, k);
      cur.forge.lerp(target.forge, k);
      cur.ink.lerp(target.ink, k);
      cur.dark += (target.dark - cur.dark) * k;
      if (Math.abs(target.dark - cur.dark) < 0.01) fading = 0;
    }

    const ease = Math.min(1, dt * 3.2);
    stage.aurora += (stageTarget.aurora - stage.aurora) * ease;
    stage.lattice += (stageTarget.lattice - stage.lattice) * ease;
    stage.liquid += (stageTarget.liquid - stage.liquid) * ease;
    stage.heroOut += (stageTarget.heroOut - stage.heroOut) * ease;

    auroraUniforms.uTime.value = t;
    auroraUniforms.uDark.value = cur.dark;
    auroraUniforms.uIntensity.value = stage.aurora;
    const aurTarget = t - aurLastMove < 1.0 ? 1 : 0;
    auroraUniforms.uHover.value += (aurTarget - auroraUniforms.uHover.value) * (1 - Math.exp(-dt * 1.8));
    scene.background = cur.ground;

    // Keep the lattice quiet so it never competes with the text (extra calm on paper).
    const latThemeScale = 0.38 + 0.24 * cur.dark;
    const latticeAlpha = (0.34 + 0.4 * stage.heroOut) * stage.lattice * latThemeScale;
    latticeMat.opacity = latticeAlpha;
    lattice.rotation.x = -0.64 - 0.28 * (1 - stage.heroOut);
    lattice.position.y = -3.4 - 1.1 * (1 - stage.heroOut);

    aurora.visible = stage.aurora > 0.01;
    lattice.visible = tier !== "C" && latticeAlpha > 0.01;
    liquid.visible = tier !== "C" && stage.liquid > 0.01;
    monogram.visible = liquid.visible;

    if (lattice.visible && pointer.active) projectPointerToLattice();
    if (lattice.visible) updateLattice(t, stage.lattice, 1 - stage.heroOut);

    if (liquid.visible) {
      liquidUniforms.uTime.value = t;
      liquidUniforms.uPointer.value.lerp(ptrTarget, 1 - Math.exp(-dt * 3.2));
      liquidUniforms.uPntStr.value += (ptrNear - liquidUniforms.uPntStr.value) * (1 - Math.exp(-dt * 2.4));
      liquidUniforms.uIntensity.value = stage.liquid;
      liquidUniforms.uDark.value = cur.dark;
      liquidUniforms.uSteps.value = tier === "A" ? 64 : 40;
      liquid.scale.setScalar(liquid.userData.size * (0.5 + stage.liquid * 0.5));
      monogramMat.opacity = (0.9 - 0.2 * (1 - cur.dark)) * stage.liquid; // firmer so the lattice does not read through it
      monogramMat.color.copy(cur.ink);
    }

    renderer.render(scene, camera);

    if (++frame % 12 === 0) {
      fpsAvg = fpsAvg * 0.8 + (1 / Math.max(dt, 0.001)) * 0.2;
      checkTier(fpsAvg);
    }
  }

  if (reduced) renderer.render(scene, camera);
  else rafId = requestAnimationFrame(tick);

  // ── teardown ──
  function dispose() {
    cancelAnimationFrame(rafId);
    removeEventListener("pointermove", onPointerMove);
    removeEventListener("pointerdown", onPointerDown);
    removeEventListener("blur", clearPointer);
    removeEventListener("pointerout", onPointerOut);
    removeEventListener("resize", onResize);
    removeEventListener("scroll", updateStaging);
    for (const row of rows) {
      row.removeEventListener("pointerenter", onRowEnter);
      row.removeEventListener("pointerleave", onRowLeave);
    }
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    monoTex.dispose();
    renderer.dispose();
  }

  return { refreshPalette, dispose };
}
