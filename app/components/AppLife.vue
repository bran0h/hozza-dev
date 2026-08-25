<script setup lang="ts">
/**
 * Conway's Game of Life, printed rather than projected.
 *
 * A coarse grid of ink dots at a few percent contrast, advancing one generation
 * roughly every 1.2s, with each cell easing between states so nothing pops. The
 * board is toroidal so gliders drift off one edge and back in the other, and it
 * gets tended — a sprinkle when the population thins, a fresh glider every so
 * often — because Life left alone settles into still lifes and stops being alive.
 *
 * Cheap by construction: ~2.7k cells on a laptop viewport, one integer pass per
 * generation, and the frame loop parks itself as soon as every cell has settled.
 */
const GENERATION_MS = 1600;
const CELL = 18;
/** Visible core of a dot; the sprite adds a soft falloff around it. */
const DOT = 3.4;
const SPRITE = DOT * 2.2;
const EASE = 0.065;

/** The canonical glider — five cells, and the closest thing coding has to a crest. */
const GLIDER = [
  [1, 0],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
] as const;

const canvasEl = useTemplateRef<HTMLCanvasElement>("canvasEl");
const colorMode = useColorMode();

let refreshInk: (() => void) | undefined;

onMounted(() => {
  const canvas = canvasEl.value;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  try {
    boot(canvas, ctx);
  } catch {
    // Purely decorative: if the canvas misbehaves, drop it and leave the page be.
    canvas.remove();
  }
});

function boot(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  let cols = 0;
  let rows = 0;
  let cur = new Uint8Array(0);
  let next = new Uint8Array(0);
  let alpha = new Float32Array(0);

  let ink = "26 25 22";
  /** Same triplet in comma form: `rgba()` rejects space-separated components. */
  let inkCss = "26, 25, 22";
  let ceiling = 0.06;
  /** Pre-rendered soft dot, redrawn only when the ink or pixel ratio changes. */
  let sprite: HTMLCanvasElement | undefined;
  let spriteKey = "";
  let gen = 0;
  let raf = 0;
  let running = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  function buildSprite() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const key = `${inkCss}@${dpr}`;
    if (sprite && spriteKey === key) return;

    const box = document.createElement("canvas");
    box.width = box.height = Math.ceil(SPRITE * dpr);
    const sc = box.getContext("2d");
    if (!sc) return;
    sc.scale(dpr, dpr);

    // Soft-edged dot: solid core easing out to nothing, so nothing looks pixelated.
    const r = SPRITE / 2;
    const grad = sc.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, `rgba(${inkCss}, 1)`);
    grad.addColorStop(DOT / SPRITE, `rgba(${inkCss}, 0.5)`);
    grad.addColorStop(1, `rgba(${inkCss}, 0)`);
    sc.fillStyle = grad;
    sc.fillRect(0, 0, SPRITE, SPRITE);

    sprite = box;
    spriteKey = key;
  }

  function readInk() {
    const cs = getComputedStyle(document.documentElement);
    ink = cs.getPropertyValue("--life-ink").trim() || ink;
    inkCss = ink.replace(/[\s,]+/g, ", ");
    ceiling = Number(cs.getPropertyValue("--life-alpha")) || ceiling;
    buildSprite();
  }

  const at = (x: number, y: number) =>
    ((y + rows) % rows) * cols + ((x + cols) % cols);

  function sprinkle(density: number) {
    for (let i = 0; i < cur.length; i++) {
      if (Math.random() < density) cur[i] = 1;
    }
  }

  function addGlider() {
    const ox = Math.floor(Math.random() * cols);
    const oy = Math.floor(Math.random() * rows);
    const swap = Math.random() < 0.5;
    const flipX = Math.random() < 0.5;
    const flipY = Math.random() < 0.5;
    for (const [dx, dy] of GLIDER) {
      let a = swap ? dy : dx;
      let b = swap ? dx : dy;
      if (flipX) a = 2 - a;
      if (flipY) b = 2 - b;
      cur[at(ox + a, oy + b)] = 1;
    }
  }

  function build() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildSprite();

    cols = Math.ceil(w / CELL) + 1;
    rows = Math.ceil(h / CELL) + 1;
    cur = new Uint8Array(cols * rows);
    next = new Uint8Array(cols * rows);
    alpha = new Float32Array(cols * rows);

    sprinkle(0.12);
    for (let i = 0; i < 3; i++) addGlider();
  }

  function step() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const n =
          cur[at(x - 1, y - 1)]! +
          cur[at(x, y - 1)]! +
          cur[at(x + 1, y - 1)]! +
          cur[at(x - 1, y)]! +
          cur[at(x + 1, y)]! +
          cur[at(x - 1, y + 1)]! +
          cur[at(x, y + 1)]! +
          cur[at(x + 1, y + 1)]!;
        const i = y * cols + x;
        next[i] = cur[i] ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
      }
    }
    const swap = cur;
    cur = next;
    next = swap;

    // Keep it inhabited: Life on its own decays into stationary debris.
    gen++;
    let pop = 0;
    for (let i = 0; i < cur.length; i++) pop += cur[i]!;
    if (pop < cur.length * 0.05) sprinkle(0.05);
    if (gen % 16 === 0) addGlider();
  }

  /** Eases every cell toward its state; returns true while anything is moving. */
  function paint() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (!sprite) return false;

    const offset = (CELL - SPRITE) / 2;
    let moving = false;
    for (let i = 0; i < cur.length; i++) {
      const goal = cur[i]!;
      const a = alpha[i]! + (goal - alpha[i]!) * EASE;
      alpha[i] = a;
      if (Math.abs(goal - a) > 0.004) moving = true;
      if (a < 0.01) continue;

      ctx.globalAlpha = a * ceiling;
      ctx.drawImage(
        sprite,
        (i % cols) * CELL + offset,
        Math.floor(i / cols) * CELL + offset,
        SPRITE,
        SPRITE,
      );
    }
    ctx.globalAlpha = 1;
    return moving;
  }

  function frame() {
    if (!paint()) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function settle() {
    for (let i = 0; i < cur.length; i++) alpha[i] = cur[i]!;
    paint();
  }

  function start() {
    stop();
    if (calm.matches) return;
    timer = setInterval(() => {
      readInk();
      step();
      wake();
    }, GENERATION_MS);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = undefined;
  }

  refreshInk = () => {
    readInk();
    if (calm.matches || !running) paint();
  };

  // ── Boot ───────────────────────────────────────────────────────────────────
  readInk();
  build();

  if (calm.matches) {
    // Keep the printed texture, drop the motion.
    settle();
  } else {
    wake();
    start();
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      build();
      if (calm.matches) settle();
      else wake();
    }, 200);
  };

  // No reason to compute generations for a tab nobody is looking at.
  const onVisibility = () => {
    if (document.hidden) stop();
    else if (!calm.matches) start();
  };

  const onCalmChange = () => {
    if (calm.matches) {
      stop();
      settle();
    } else {
      start();
      wake();
    }
  };

  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  calm.addEventListener("change", onCalmChange);

  onUnmounted(() => {
    stop();
    cancelAnimationFrame(raf);
    if (resizeTimer) clearTimeout(resizeTimer);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    calm.removeEventListener("change", onCalmChange);
    refreshInk = undefined;
  });
}

// The dots are derived from --fg, so they need re-reading when the theme flips.
watch(
  () => colorMode.value,
  () => nextTick(() => refreshInk?.()),
);
</script>

<template>
  <canvas ref="canvasEl" class="life" aria-hidden="true" />
</template>

<style scoped>
.life {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>
