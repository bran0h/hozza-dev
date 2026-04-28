<script setup lang="ts">
const scrolled = ref(false);
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
      <ThemeToggle />
      <a
        href="https://github.com/bran0h"
        target="_blank"
        rel="noopener"
        class="text-accent border-accent hover:bg-accent rounded-[4px] border px-[14px] py-[6px] no-underline transition-all hover:text-[#07090e]"
      >
        github
      </a>
    </div>
  </nav>
</template>
