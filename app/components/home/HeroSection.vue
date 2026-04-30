<script setup lang="ts">
const role = useTypewriter(
  [
    "full-stack developer",
    "game dev enthusiast",
    "rust learner",
    "open source builder",
  ],
  75,
  2200,
);

const loaded = ref(false);
onMounted(() => setTimeout(() => (loaded.value = true), 100));

function delay(d: number) {
  return {
    animationName: loaded.value ? "fadeUp" : "none",
    animationDuration: "0.7s",
    animationTimingFunction: "ease",
    animationDelay: `${d}s`,
    animationFillMode: "forwards",
    opacity: 0,
  };
}
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-dvh flex-col justify-center overflow-hidden px-6 py-24 sm:px-8 sm:py-28 lg:px-12"
  >
    <div class="hero-grid absolute inset-0" aria-hidden="true" />
    <div class="hero-blob absolute" aria-hidden="true" />

    <div class="relative max-w-[900px]">
      <div
        :style="delay(0.1)"
        class="font-code text-accent mb-6 text-[13px] tracking-[0.12em] uppercase"
      >
        <span class="text-fg3">$ </span>whoami
      </div>

      <h1
        :style="delay(0.25)"
        class="mb-8 text-[clamp(56px,8vw,120px)] leading-[0.9] font-bold tracking-[-0.04em]"
      >
        <span
          class="text-fg2 mb-2 block text-[0.55em] font-light tracking-[-0.02em]"
          >Hi, I'm</span
        >
        Brano<span class="text-accent">.</span>
      </h1>

      <div
        :style="delay(0.4)"
        class="font-code text-fg2 mb-10 flex h-9 items-center gap-0.5 text-[clamp(16px,2.5vw,24px)]"
      >
        <span class="text-accent">~/</span>
        <span>{{ role }}</span>
        <span
          class="text-accent animate-[blink_1s_step-end_infinite] font-light"
          >▌</span
        >
      </div>

      <p
        :style="delay(0.55)"
        class="text-fg2 mb-12 max-w-[520px] text-[17px] leading-[1.7]"
      >
        Building for the web and beyond. Based in
        <span class="text-fg">Slovakia</span>, currently hacking on full-stack
        apps and game engines in Rust.
      </p>

      <div :style="delay(0.7)" class="flex flex-wrap gap-4">
        <a
          href="#stack"
          class="bg-primary font-code text-bg block rounded-[4px] px-7 py-3 text-[13px] font-bold tracking-[0.05em] no-underline transition-opacity hover:opacity-85"
        >
          view stack
        </a>
        <a
          href="#contact"
          class="text-fg2 font-code hover:border-accent hover:text-accent rounded-[4px] border border-[var(--border)] px-7 py-3 text-[13px] tracking-[0.05em] no-underline transition-all"
          >get in touch
        </a>
      </div>
    </div>

    <div
      class="font-code text-fg2 absolute bottom-10 left-1/2 hidden -translate-x-1/2 animate-[fadeIn_1s_1.5s_ease_forwards] flex-col items-center gap-2 text-[11px] tracking-[0.1em] opacity-0 sm:flex"
      aria-hidden="true"
    >
      <span>scroll</span>
      <div class="from-fg3 h-10 w-px bg-gradient-to-b to-transparent" />
    </div>
  </section>
</template>

<style scoped>
.hero-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(
    ellipse 80% 60% at 50% 50%,
    black 0%,
    transparent 100%
  );
}

html.light .hero-grid {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}

.hero-blob {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(0.78 0.18 145 / 0.08) 0%,
    transparent 70%
  );
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
