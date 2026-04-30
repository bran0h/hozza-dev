<script setup lang="ts">
const { el: headerEl, visible: headerVisible } = useVisible();

const projects = [
  {
    title: "Liftag",
    desc: "Gym workout tracking app — scan a QR code on any machine to auto-load exercises, log sets, and sync completed workouts to Strava. React Native mobile app backed by an AdonisJS API and a Nuxt gym-owner dashboard.",
    tags: ["Expo", "AdonisJS", "PostgreSQL", "Nuxt"],
    status: "active",
  },
  {
    title: "CardioElite",
    desc: "Cardiology platform for risk assessment and personalized lipid-lowering therapy recommendations",
    tags: ["TypeScript", "Nuxt", "AdonisJS"],
    status: "active",
  },
  {
    title: "OVB",
    desc: "Developing web and mobile apps for financial institutions",
    tags: ["TypeScript", "Nuxt", "AdonisJS", "LangChain", "Expo", "Monorepo"],
    status: "active",
  },
  {
    title: "dotmemo.xyz",
    desc: "Sharing tokenized memories with your friends",
    tags: ["TypeScript", "Nuxt", "Web3", "Cloudflare"],
    status: "inactive",
  },
  {
    title: "meta-assets",
    desc: "Polkadot solution for game asset representation on-chain",
    tags: ["TypeScript", "Nuxt", "Polkadot", "Substrate", "Rust"],
    status: "inactive",
  },
  {
    title: "Zhar",
    desc: "Zhar is a social platform for tokenized real-life challenges.",
    tags: ["TypeScript", "Expo", "Web3", "Ethereum"],
    status: "inactive",
  },
  {
    title: "Crypto-estate",
    desc: "Crypto-estate is a platform for buying and selling real estate with crypto",
    tags: ["TypeScript", "Nuxt", "Web3", "Cloudflare"],
    status: "inactive",
  },
  {
    title: "Tokengram",
    desc: "Tokengram is a platform for creating and sharing tokenized content",
    tags: ["TypeScript", "Nuxt", "Graph databases", "AI", "Web3"],
    status: "inactive",
  },
].map((p, i) => {
  const { el, visible } = useVisible();
  return { ...p, el, visible, delay: i * 0.12 };
});
</script>

<template>
  <section
    id="projects"
    class="bg-bg2 relative px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-[120px]"
  >
    <div
      class="absolute top-0 right-6 left-6 h-px bg-[var(--border)] sm:right-8 sm:left-8 lg:right-12 lg:left-12"
    />

    <div
      :ref="(el) => (headerEl = el as HTMLElement)"
      class="mb-12 transition-opacity duration-500 sm:mb-16"
      :class="headerVisible ? 'opacity-100' : 'opacity-0'"
    >
      <div class="font-code text-fg3 mb-3 text-[12px] tracking-[0.1em]">
        <span class="text-accent">02</span> / 03
      </div>
      <h2
        class="text-[clamp(36px,5vw,72px)] leading-none font-bold tracking-[-0.04em]"
      >
        Projects<span class="text-accent">.</span>
      </h2>
    </div>

    <div
      class="grid max-w-[1100px] grid-cols-1 gap-5 sm:gap-6 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
    >
      <div
        v-for="project in projects"
        :key="project.title"
        :ref="(el) => (project.el.value = el as HTMLElement)"
        class="project-card bg-bg2 relative cursor-default overflow-hidden rounded-[8px] border border-[var(--border)] p-6 sm:p-8"
        :style="{
          opacity: project.visible.value ? 1 : 0,
          transform: project.visible.value
            ? 'translateY(0)'
            : 'translateY(24px)',
          transition: `opacity 0.6s ${project.delay}s ease, transform 0.6s ${project.delay}s ease, border-color 0.2s ease`,
        }"
      >
        <div
          class="card-overlay pointer-events-none absolute inset-0"
          aria-hidden="true"
        />

        <div class="mb-4 flex items-start justify-between">
          <h3 class="text-[20px] font-semibold tracking-[-0.02em]">
            {{ project.title }}
          </h3>
          <span
            class="font-code rounded-[20px] px-[10px] py-[3px] text-[11px]"
            :class="
              project.status === 'active'
                ? 'bg-accent-dim text-accent border-accent-mid border'
                : 'bg-bg3 text-fg3 border border-[var(--border)]'
            "
          >
            {{ project.status }}
          </span>
        </div>

        <p class="text-fg2 mb-6 text-[14px] leading-[1.7]">
          {{ project.desc }}
        </p>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="font-code text-fg3 bg-bg3 rounded-[3px] px-[10px] py-[4px] text-[11px]"
            >{{ tag }}</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.project-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

html.light .project-card:hover {
  border-color: rgba(0, 0, 0, 0.18);
}

.card-overlay {
  background: linear-gradient(135deg, var(--accent-dim) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.2s;
}

.project-card:hover .card-overlay {
  opacity: 1;
}
</style>
