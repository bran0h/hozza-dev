<script setup lang="ts">
const scrolled = ref(false);
/** Local open state lives here with the trigger so hydration always matches (avoid useState/Teleport split). */
const panelOpen = ref(false);
const { primaryDarkHex, primaryLightHex, reset } = useTweakColors();

function togglePanel() {
  panelOpen.value = !panelOpen.value;
}

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 40;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", onScroll));
});
</script>

<template>
  <nav
    :class="[
      'font-code fixed inset-x-0 top-0 z-[100] flex h-16 items-center justify-between border-b px-4 text-[13px] transition-all duration-300 sm:px-6 lg:px-12',
      scrolled
        ? 'bg-bg/85 border-white/5 backdrop-blur-[12px]'
        : 'border-transparent bg-transparent',
    ]"
  >
    <NuxtLink
      to="/"
      class="text-accent text-[15px] font-bold tracking-[-0.02em] no-underline"
    >
      <span>~/</span>hozza.dev
    </NuxtLink>

    <div class="flex items-center gap-3 sm:gap-5 lg:gap-9">
      <div class="hidden items-center gap-5 md:flex lg:gap-9">
        <slot />
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="font-code text-fg2 hover:border-accent hover:text-accent flex h-8 w-8 items-center justify-center rounded-[4px] border border-[var(--border)] bg-transparent text-[14px] transition-all"
          title="Tweak colors"
          :aria-expanded="panelOpen"
          aria-controls="tweak-colors-panel"
          aria-label="Open color tweaks"
          @click="togglePanel"
        >
          <span aria-hidden="true">◎</span>
        </button>
        <ThemeToggle />
      </div>
      <a
        href="https://github.com/bran0h"
        target="_blank"
        rel="noopener"
        class="text-accent border-accent hover:bg-primary hover:text-bg rounded-[4px] border px-[14px] py-[6px] no-underline transition-all"
      >
        github
      </a>
    </div>
  </nav>

  <Teleport to="body">
    <div
      v-if="panelOpen"
      id="tweak-colors-panel"
      class="font-code bg-bg2/95 fixed top-[4.5rem] right-4 z-[1100] w-[min(100vw-2rem,280px)] rounded-[8px] border border-[var(--border)] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-[12px] sm:right-6 lg:right-12"
      role="region"
      aria-label="Theme color tweaks"
    >
      <p class="text-fg mb-3 text-[11px] tracking-[0.08em] uppercase">
        Primary
      </p>
      <div class="mb-3 flex flex-col gap-3">
        <label class="flex items-center justify-between gap-3 text-[12px]">
          <span class="text-fg2 shrink-0">Primary · dark</span>
          <input
            v-model="primaryDarkHex"
            type="color"
            class="border-bg3 bg-bg h-9 w-14 shrink-0 cursor-pointer rounded border p-0.5"
          />
        </label>
        <label class="flex items-center justify-between gap-3 text-[12px]">
          <span class="text-fg2 shrink-0">Primary · light</span>
          <input
            v-model="primaryLightHex"
            type="color"
            class="border-bg3 bg-bg h-9 w-14 shrink-0 cursor-pointer rounded border p-0.5"
          />
        </label>
      </div>
      <button
        type="button"
        class="text-fg3 hover:text-accent bg-bg w-full rounded-[4px] border border-[var(--border)] py-2 text-[11px] tracking-[0.06em] uppercase transition-colors"
        @click="reset"
      >
        Reset
      </button>
    </div>
  </Teleport>
</template>
