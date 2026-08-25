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
    ? "Toggle colour theme"
    : isDark.value
      ? "Switch to paper"
      : "Switch to ink",
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M6.2 17.8l-1.6 1.6M19.4 4.6l-1.6 1.6"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
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
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: none;
  background: none;
  color: var(--fg3);
  cursor: pointer;
  transition: color 0.15s ease;
}

.theme-toggle:hover {
  color: var(--fg);
}

.theme-toggle-placeholder {
  display: block;
  width: 14px;
  height: 14px;
}
</style>
