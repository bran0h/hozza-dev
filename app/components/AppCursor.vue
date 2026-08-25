<script setup lang="ts">
/**
 * Ring-and-dot pointer. At rest only the dot shows. The ring is driven entirely by
 * pointer speed — it fades in and grows the faster you move, eases behind the dot
 * so it reads as drift, and stretches along the travel direction. Fine pointers
 * only, and it bows out for reduced-motion and over text fields, where the caret
 * matters more.
 */
const INTERACTIVE = 'a, button, [role="button"], label, summary';
const TEXT_FIELD =
  'input:not([type="color"]), textarea, [contenteditable="true"]';

const enabled = ref(false);
const shown = ref(false);
const hot = ref(false);
const pressed = ref(false);

const ringEl = useTemplateRef<HTMLElement>("ringEl");
const dotEl = useTemplateRef<HTMLElement>("dotEl");

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

onMounted(async () => {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || calm.matches) return;

  enabled.value = true;
  await nextTick();

  const ring = ringEl.value;
  const dot = dotEl.value;
  if (!ring || !dot) return;

  document.documentElement.classList.add("custom-cursor");

  const target = { x: 0, y: 0 };
  const ringAt = { x: 0, y: 0 };
  const dotAt = { x: 0, y: 0 };
  const last = { x: 0, y: 0, t: 0 };

  /** Smoothed pointer speed in px/ms — measured from the events, not the frames. */
  let speed = 0;
  let raf = 0;
  let running = false;
  let primed = false;

  function tick() {
    const dx = target.x - ringAt.x;
    const dy = target.y - ringAt.y;

    ringAt.x = lerp(ringAt.x, target.x, 0.16);
    ringAt.y = lerp(ringAt.y, target.y, 0.16);
    dotAt.x = lerp(dotAt.x, target.x, 0.65);
    dotAt.y = lerp(dotAt.y, target.y, 0.65);

    // Barely bleed speed while moves keep arriving; drop it fast once they stop.
    const idle = performance.now() - last.t;
    speed = lerp(speed, 0, idle > 40 ? 0.14 : 0.02);

    const drive = Math.min(speed / 2.2, 1);
    const stretch = Math.min(speed / 4, 0.42);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const size =
      (0.55 + drive * 1.25 + (hot.value ? 0.3 : 0)) *
      (pressed.value ? 0.82 : 1);
    const alpha = speed < 0.01 ? 0 : Math.min(speed / 0.35, 1);

    ring.style.opacity = String(alpha);
    ring.style.transform =
      `translate3d(${ringAt.x}px, ${ringAt.y}px, 0) translate(-50%, -50%) ` +
      `rotate(${angle}deg) scale(${size * (1 + stretch)}, ${size * (1 - stretch * 0.62)})`;
    dot.style.transform =
      `translate3d(${dotAt.x}px, ${dotAt.y}px, 0) translate(-50%, -50%) ` +
      `scale(${pressed.value ? 1.7 : 1})`;

    // Park the loop once caught up and still; the next move wakes it.
    if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1 && speed < 0.004) {
      ring.style.opacity = "0";
      running = false;
      return;
    }
    raf = requestAnimationFrame(tick);
  }

  function wake() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(tick);
  }

  function onMove(e: PointerEvent) {
    const now = performance.now();
    target.x = e.clientX;
    target.y = e.clientY;

    if (!primed) {
      primed = true;
      ringAt.x = dotAt.x = target.x;
      ringAt.y = dotAt.y = target.y;
      shown.value = true;
    } else {
      const dt = Math.max(now - last.t, 1);
      const step = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
      speed = lerp(speed, step, 0.3);
    }

    last.x = e.clientX;
    last.y = e.clientY;
    last.t = now;
    wake();
  }

  function onOver(e: Event) {
    const el = e.target as Element | null;
    if (!el?.closest) return;
    hot.value = !!el.closest(INTERACTIVE);
    // Hand the caret back over inputs rather than covering it with a ring.
    shown.value = !el.closest(TEXT_FIELD);
    wake();
  }

  const onDown = () => {
    pressed.value = true;
    wake();
  };
  const onUp = () => {
    pressed.value = false;
    wake();
  };
  const onLeave = () => {
    shown.value = false;
    wake();
  };
  const onEnter = () => {
    shown.value = true;
    wake();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver, true);
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  document.addEventListener("pointerenter", onEnter);

  onUnmounted(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver, true);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    document.removeEventListener("pointerleave", onLeave);
    document.removeEventListener("pointerenter", onEnter);
    document.documentElement.classList.remove("custom-cursor");
  });
});
</script>

<template>
  <Teleport v-if="enabled" to="body">
    <div
      ref="ringEl"
      class="cursor-ring"
      :class="{ 'cursor-ring--on': shown, 'cursor-ring--hot': hot }"
      aria-hidden="true"
    />
    <div
      ref="dotEl"
      class="cursor-dot"
      :class="{ 'cursor-dot--on': shown }"
      aria-hidden="true"
    />
  </Teleport>
</template>

<style scoped>
.cursor-ring,
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  visibility: hidden;
  will-change: transform;
}

.cursor-ring {
  width: 26px;
  height: 26px;
  border: 1px solid var(--border-strong);
  border-radius: 50%;
  opacity: 0;
  /* No opacity transition — the frame loop writes it every tick. */
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.cursor-ring--hot {
  border-color: var(--primary);
  background: var(--primary-dim);
}

.cursor-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--primary);
}

.cursor-ring--on,
.cursor-dot--on {
  visibility: visible;
}
</style>
