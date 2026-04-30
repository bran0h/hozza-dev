<script setup lang="ts">
const { el: headerEl, visible: headerVisible } = useVisible();

const groups = [
  { title: "frontend", items: ["TypeScript", "Vue", "Nuxt", "Tailwind CSS"] },
  {
    title: "backend",
    items: [
      "AdonisJS",
      "LangChain",
      "Express",
      "PostgreSQL",
      "MSSQL",
      "MongoDB",
      ".NET",
      "Axum",
      "Actix",
    ],
  },
  {
    title: "devops",
    items: ["Docker", "Kubernetes", "CI/CD", "GitHub", "GitLab"],
  },
  { title: "game dev", items: ["Rust", "Bevy", "Godot", "Unity"] },
].map((g, i) => {
  const { el, visible } = useVisible();
  return { ...g, el, visible, delay: i * 0.1 };
});
</script>

<template>
  <section
    id="stack"
    class="relative px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-[120px]"
  >
    <div
      class="absolute top-0 right-6 left-6 h-px bg-[var(--border)] sm:right-8 sm:left-8 lg:right-12 lg:left-12"
    />

    <div
      :ref="(el) => (headerEl = el as HTMLElement)"
      class="mb-14 transition-opacity duration-500 sm:mb-16 lg:mb-20"
      :class="headerVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div class="font-code text-fg3 mb-3 text-[12px] tracking-[0.1em]">
        <span class="text-accent">01</span> / 03
      </div>
      <h2
        class="text-[clamp(36px,5vw,72px)] leading-none font-bold tracking-[-0.04em]"
      >
        Tech<br />Stack<span class="text-accent">.</span>
      </h2>
    </div>

    <div
      class="grid max-w-[1100px] grid-cols-1 gap-10 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] lg:gap-12"
    >
      <div
        v-for="group in groups"
        :key="group.title"
        :ref="(el) => (group.el.value = el as HTMLElement)"
        :style="{
          opacity: group.visible.value ? 1 : 0,
          transform: group.visible.value ? 'translateY(0)' : 'translateY(20px)',
          transition: `opacity 0.6s ${group.delay}s ease, transform 0.6s ${group.delay}s ease`,
        }"
      >
        <div
          class="font-code text-accent mb-4 text-[11px] tracking-[0.15em] uppercase"
        >
          <span class="text-fg3">// </span>{{ group.title }}
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="item in group.items"
            :key="item"
            class="font-code text-fg2 bg-bg2 hover:border-accent hover:text-accent hover:bg-accent-dim cursor-default rounded-[4px] border border-[var(--border)] px-[14px] py-[7px] text-[13px] whitespace-nowrap transition-all select-none"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
