<script setup lang="ts">
const colorMode = useColorMode();
const mounted = ref(false);
const isDark = computed(() => colorMode.value === "dark");

function toggle() {
  colorMode.preference = isDark.value ? "light" : "dark";
}

onMounted(() => {
  mounted.value = true;
});

const ariaLabel = computed(() =>
  !mounted.value
    ? "Toggle color theme"
    : isDark.value
      ? "Switch to light mode"
      : "Switch to dark mode",
);
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="ariaLabel"
    @click="toggle"
  >
    <!-- Icon deferred until mount so SSR and client markup match (color mode resolves after hydration). -->
    <span v-if="!mounted" class="theme-toggle-placeholder" aria-hidden="true" />
    <svg
      v-else-if="isDark"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--fg2);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.theme-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.theme-toggle-placeholder {
  display: block;
  width: 15px;
  height: 15px;
}
</style>
