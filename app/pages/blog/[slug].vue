<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: post } = await useAsyncData(slug, () =>
  queryCollection("blog").path(`/blog/${slug}`).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Post not found" });
}

useHead({
  title: `${post.value.title} — Branislav Hozza`,
  meta: [{ name: "description", content: post.value.summary }],
});

const loaded = ref(false);
onMounted(() => requestAnimationFrame(() => (loaded.value = true)));
</script>

<template>
  <div class="text-fg min-h-screen">
    <SiteNav />

    <main
      class="shell pt-14 pb-16 transition-all duration-700 sm:pt-20"
      :style="{
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'none' : 'translateY(0.5rem)',
      }"
    >
      <article class="mx-auto max-w-[42rem]">
        <header class="mb-12">
          <p class="label mb-6 flex flex-wrap items-baseline gap-x-2">
            <NuxtLink
              to="/blog"
              class="hover:text-fg no-underline transition-colors"
              >← Writing</NuxtLink
            >
            <span>/</span>
            <span>{{ post!.date }}</span>
            <span>·</span>
            <span>{{ post!.readTime }}</span>
          </p>

          <h1 class="mb-6 text-[clamp(2.125rem,5.5vw,3.5rem)] leading-[1.04]">
            {{ post!.title }}
          </h1>

          <p
            class="text-fg2 border-rule border-l pl-5 text-[1.1875rem] leading-[1.55]"
          >
            {{ post!.summary }}
          </p>
        </header>

        <div class="border-fg mb-12 border-t" />

        <div class="prose">
          <ContentRenderer :value="post!" />
        </div>

        <footer class="border-rule mt-16 border-t pt-6">
          <p class="font-meta text-fg3 mb-4 text-[0.78125rem] tracking-wide">
            {{ tagList(post!.tags) }}
          </p>
          <NuxtLink to="/blog" class="label hover:text-fg transition-colors"
            >← All posts</NuxtLink
          >
        </footer>
      </article>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
/* ── Prose ───────────────────────────────────────────────────────────────────
   Serif body at a print-ish measure; headings share the display face so an
   article reads like a page from a magazine rather than a docs site. */
.prose {
  color: var(--fg2);
  font-size: 1.0625rem;
  line-height: 1.75;
}

.prose :deep(h1) {
  display: none;
}

.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
  font-family: var(--font-display);
  color: var(--fg);
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.15;
  margin-top: 2.25em;
  margin-bottom: 0.6em;
}

.prose :deep(h2) {
  font-size: 1.7em;
}

.prose :deep(h3) {
  font-size: 1.3em;
}

.prose :deep(h4) {
  font-family: var(--font-meta);
  font-size: 0.8em;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.prose :deep(p) {
  margin-bottom: 1.4em;
}

.prose :deep(strong) {
  color: var(--fg);
  font-weight: 600;
}

.prose :deep(a) {
  color: inherit;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-decoration-color: var(--border-strong);
  text-underline-offset: 0.22em;
  transition:
    color 0.15s ease,
    text-decoration-color 0.15s ease;
}

.prose :deep(a:hover) {
  color: var(--primary);
  text-decoration-color: var(--primary);
}

.prose :deep(:not(pre) > code) {
  font-family: var(--font-mono);
  font-size: 0.8125em;
  background: var(--bg2);
  padding: 0.15em 0.4em;
  border-radius: 2px;
  color: var(--fg);
}

.prose :deep(pre) {
  background: var(--bg2);
  border-left: 2px solid var(--border-strong);
  padding: 1.25rem 1.375rem;
  overflow-x: auto;
  margin-bottom: 1.5em;
  font-size: 0.8125rem;
  line-height: 1.65;
}

.prose :deep(pre code) {
  font-family: var(--font-mono);
  background: none;
  padding: 0;
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.35em;
  margin-bottom: 1.4em;
}

.prose :deep(ul) {
  list-style: none;
  padding-left: 1.1em;
}

.prose :deep(ul > li) {
  position: relative;
}

.prose :deep(ul > li)::before {
  content: "—";
  position: absolute;
  left: -1.1em;
  color: var(--fg3);
}

.prose :deep(li) {
  margin-bottom: 0.4em;
}

.prose :deep(blockquote) {
  font-family: var(--font-display);
  font-size: 1.3em;
  line-height: 1.35;
  color: var(--fg);
  border: none;
  margin: 2em 0;
  padding: 0;
}

.prose :deep(blockquote p) {
  margin-bottom: 0;
}

.prose :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.5em 0;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-meta);
  font-size: 0.875rem;
  margin-bottom: 1.5em;
}

.prose :deep(th),
.prose :deep(td) {
  border-bottom: 1px solid var(--border);
  padding: 0.55em 0.75em 0.55em 0;
  text-align: left;
}

.prose :deep(th) {
  color: var(--fg);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 0.72rem;
  border-bottom-color: var(--border-strong);
}
</style>
