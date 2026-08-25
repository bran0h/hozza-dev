<script setup lang="ts">
const route = useRoute();
const scrolled = ref(false);
/** Local open state lives here with the trigger so hydration always matches (avoid useState/Teleport split). */
const panelOpen = ref(false);
const { primaryDarkHex, primaryLightHex, reset } = useTweakColors();

const links = [
  { label: "Work", to: "/#work" },
  { label: "Writing", to: "/blog" },
  { label: "Cloud", href: "https://cloud.hozza.dev", external: true },
  { label: "GitHub", href: "https://github.com/bran0h", external: true },
];

const onBlog = computed(() => route.path.startsWith("/blog"));

function togglePanel() {
  panelOpen.value = !panelOpen.value;
}

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 8;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  onUnmounted(() => window.removeEventListener("scroll", onScroll));
});
</script>

<template>
  <header
    :class="[
      'bg-bg/92 sticky top-0 z-100 border-b backdrop-blur-sm transition-colors duration-200',
      scrolled ? 'border-rule' : 'border-transparent',
    ]"
  >
    <div
      class="shell flex flex-col gap-2.5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:pt-6 sm:pb-6"
    >
      <NuxtLink
        to="/"
        class="font-display shrink-0 text-[1.375rem] leading-none tracking-[-0.01em] no-underline sm:text-[1.5rem]"
      >
        Branislav Hozza
      </NuxtLink>

      <nav class="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-7">
        <template v-for="link in links" :key="link.label">
          <a
            v-if="link.external"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="label nav-link no-underline"
          >
            {{ link.label }}<span class="text-fg3 ml-[0.2em]">↗</span>
          </a>
          <NuxtLink
            v-else
            :to="link.to!"
            class="label nav-link no-underline"
            :class="{ 'nav-link--on': link.label === 'Writing' && onBlog }"
          >
            {{ link.label }}
          </NuxtLink>
        </template>

        <span
          class="border-rule ml-auto flex items-baseline gap-1 border-l pl-3 sm:ml-1"
        >
          <button
            type="button"
            class="control"
            title="Tweak accent colour"
            :aria-expanded="panelOpen"
            aria-controls="tweak-colors-panel"
            aria-label="Tweak accent colour"
            @click="togglePanel"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="M12 3a9 9 0 0 1 0 18Z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
          </button>
          <ThemeToggle />
        </span>
      </nav>
    </div>
  </header>

  <Teleport to="body">
    <div
      v-if="panelOpen"
      id="tweak-colors-panel"
      class="bg-bg border-rule fixed top-[5.5rem] right-4 z-1100 w-[min(100vw-2rem,17rem)] border p-4 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.45)] sm:right-8"
      role="region"
      aria-label="Accent colour"
    >
      <p class="label mb-3">Accent</p>
      <div class="mb-4 flex flex-col gap-2.5">
        <label
          class="font-meta flex items-center justify-between gap-3 text-[0.8125rem]"
        >
          <span class="text-fg2 shrink-0">Paper</span>
          <input
            v-model="primaryLightHex"
            type="color"
            class="border-rule bg-bg h-8 w-12 shrink-0 cursor-pointer border p-0.5"
          />
        </label>
        <label
          class="font-meta flex items-center justify-between gap-3 text-[0.8125rem]"
        >
          <span class="text-fg2 shrink-0">Ink</span>
          <input
            v-model="primaryDarkHex"
            type="color"
            class="border-rule bg-bg h-8 w-12 shrink-0 cursor-pointer border p-0.5"
          />
        </label>
      </div>
      <button
        type="button"
        class="label hover:text-primary transition-colors"
        @click="reset"
      >
        Reset →
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.nav-link {
  position: relative;
  transition: color 0.15s ease;
}

.nav-link:hover,
.nav-link--on {
  color: var(--fg);
}

.nav-link--on::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.45em;
  height: 1px;
  background: var(--primary);
}

.control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--fg3);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.15s ease;
}

.control:hover {
  color: var(--fg);
}
</style>
