<script setup lang="ts">
const loaded = ref(false);
onMounted(() => setTimeout(() => (loaded.value = true), 60));

const { data: posts } = await useAsyncData("blog-index", () =>
  queryCollection("blog").order("date", "DESC").all(),
);
</script>

<template>
  <div class="bg-bg text-fg min-h-screen overflow-x-hidden">
    <div class="scanline" aria-hidden="true" />

    <SiteNav>
      <NuxtLink
        to="/blog"
        class="text-accent font-code text-[13px] no-underline"
        >./blog</NuxtLink
      >
    </SiteNav>

    <!-- Header -->
    <header
      class="relative overflow-hidden px-6 pt-32 pb-20 sm:px-8 sm:pt-40 sm:pb-24 lg:px-12"
    >
      <div class="header-grid absolute inset-0" aria-hidden="true" />
      <div class="header-blob absolute" aria-hidden="true" />
      <div
        class="relative max-w-[900px] transition-all duration-700"
        :style="{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(20px)',
        }"
      >
        <div
          class="font-code text-accent mb-6 text-[13px] tracking-[0.12em] uppercase"
        >
          <span class="text-fg3">$ </span>ls ./blog
        </div>
        <h1
          class="mb-7 text-[clamp(56px,8vw,100px)] leading-[0.9] font-bold tracking-[-0.04em]"
        >
          Blog<span class="text-accent">.</span>
        </h1>
        <p class="text-fg2 max-w-[480px] text-[18px] leading-[1.7]">
          Writing about things I build, break, and eventually understand.
        </p>
      </div>
    </header>

    <!-- Posts -->
    <section
      class="relative px-6 pt-16 pb-24 sm:px-8 sm:pt-20 sm:pb-28 lg:px-12 lg:pb-[120px]"
    >
      <div
        class="absolute top-0 right-6 left-6 h-px bg-[var(--border)] sm:right-8 sm:left-8 lg:right-12 lg:left-12"
      />

      <div
        class="font-code text-fg3 mb-12 text-[12px] tracking-[0.1em] transition-opacity duration-500"
        :class="loaded ? 'opacity-100' : 'opacity-0'"
      >
        <span class="text-accent">{{ posts?.length ?? 0 }}</span> posts
      </div>

      <div
        class="grid max-w-[1200px] grid-cols-1 gap-5 sm:gap-6 md:grid-cols-[repeat(auto-fill,minmax(360px,1fr))]"
      >
        <BlogPostCard
          v-for="(post, i) in posts"
          :key="post.path"
          :post="post"
          :index="i"
          :visible="loaded"
        />
      </div>
    </section>

    <SiteFooter />
  </div>
</template>

<style scoped>
.header-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(
    ellipse 80% 80% at 50% 50%,
    black 0%,
    transparent 100%
  );
}

html.light .header-grid {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}

.header-blob {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    oklch(0.78 0.18 145 / 0.07) 0%,
    transparent 70%
  );
  top: 50%;
  right: 15%;
  transform: translateY(-50%);
  pointer-events: none;
}
</style>
