<script setup lang="ts">
const loaded = ref(false);
onMounted(() => requestAnimationFrame(() => (loaded.value = true)));

const { data: posts } = await useAsyncData("blog-index", () =>
  queryCollection("blog").order("date", "DESC").all(),
);

useHead({
  title: "Writing — Branislav Hozza",
});
</script>

<template>
  <div class="text-fg min-h-screen">
    <SiteNav />

    <main>
      <header class="shell pt-12 sm:pt-16 lg:pt-20">
        <div
          class="transition-all duration-700"
          :style="{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(0.75rem)',
          }"
        >
          <p class="label mb-6 sm:mb-8">Notes & long-form</p>
          <h1
            class="mb-8 max-w-[38rem] text-[clamp(2.5rem,7vw,5rem)] leading-[1.02]"
          >
            Writing<span class="text-primary">.</span>
          </h1>
          <p
            class="text-fg2 max-w-[var(--measure)] text-[1.125rem] leading-[1.6]"
          >
            Things I build, break, and eventually understand — mostly
            TypeScript, occasionally Rust, always longer than I planned.
          </p>
        </div>
      </header>

      <section class="shell pt-20 pb-20 sm:pt-28 sm:pb-24">
        <SectionHead :meta="`${posts?.length ?? 0} posts`" size="sm">
          All posts
        </SectionHead>

        <BlogPostCard v-for="post in posts" :key="post.path" :post="post" />
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
