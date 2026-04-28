<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: post } = await useAsyncData(slug, () =>
  queryCollection("blog").path(`/blog/${slug}`).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

const loaded = ref(false);
onMounted(() => setTimeout(() => (loaded.value = true), 60));
</script>

<template>
  <div class="bg-bg text-fg min-h-screen">
    <div class="scanline" aria-hidden="true" />

    <SiteNav>
      <NuxtLink
        to="/blog"
        class="text-fg2 hover:text-accent font-code text-[13px] no-underline transition-colors"
        >← blog</NuxtLink
      >
    </SiteNav>

    <div
      class="mx-auto max-w-[720px] px-6 pt-28 pb-20 transition-all duration-700 sm:pt-[120px] sm:pb-24"
      :style="{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(16px)',
      }"
    >
      <!-- Post header -->
      <header class="mb-10">
        <div
          class="font-code text-fg3 mb-5 flex items-center gap-2 text-[12px]"
        >
          <span>{{ post!.date }}</span>
          <span>·</span>
          <span>{{ post!.readTime }}</span>
        </div>
        <h1
          class="mb-6 text-[clamp(32px,5vw,52px)] leading-[1.1] font-bold tracking-[-0.03em]"
        >
          {{ post!.title }}
        </h1>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post!.tags"
            :key="tag"
            class="font-code text-fg3 bg-bg2 rounded-[3px] border border-[var(--border)] px-3 py-1 text-[11px]"
            >{{ tag }}</span
          >
        </div>
      </header>

      <div class="mb-12 h-px bg-[var(--border)]" />

      <!-- Rendered markdown -->
      <div class="prose">
        <ContentRenderer :value="post!" />
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<style scoped>
/* ── Prose ───────────────────────────────────────────────────────────────────── */
.prose {
  color: var(--fg2);
  font-size: 16px;
  line-height: 1.8;
}

.prose :deep(h1) {
  display: none;
}

.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  color: var(--fg);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin-top: 2.5em;
  margin-bottom: 0.75em;
}

.prose :deep(h2) {
  font-size: 1.35em;
}

.prose :deep(h3) {
  font-size: 1.1em;
}

.prose :deep(p) {
  margin-bottom: 1.5em;
}

.prose :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.prose :deep(:not(pre) > code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--bg2);
  border: 1px solid var(--border);
  padding: 2px 6px;
  border-radius: 3px;
  color: var(--accent);
}

.prose :deep(pre) {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  overflow-x: auto;
  margin-bottom: 1.5em;
  font-size: 0.875em;
}

.prose :deep(pre code) {
  font-family: var(--font-mono);
  background: none;
  border: none;
  padding: 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1.5em;
}

.prose :deep(li) {
  margin-bottom: 0.4em;
}

.prose :deep(blockquote) {
  border-left: 2px solid var(--accent);
  padding-left: 1.5em;
  color: var(--fg3);
  font-style: italic;
  margin-bottom: 1.5em;
}

.prose :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2em 0;
}
</style>
