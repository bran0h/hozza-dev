<script setup lang="ts">
defineProps<{
  post: {
    title: string;
    date: string;
    readTime: string;
    tags: string[];
    excerpt: string;
    path: string;
  };
  index: number;
  visible: boolean;
}>();
</script>

<template>
  <article
    class="post-card bg-bg2 relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-[8px] border border-[var(--border)] p-6 sm:p-8"
    :class="{ 'post-card--visible': visible }"
    :style="{ '--delay': `${index * 0.08}s` }"
  >
    <NuxtLink
      :to="post.path"
      class="absolute inset-0 z-[1]"
      :aria-label="`Read ${post.title}`"
    />
    <div
      class="card-overlay pointer-events-none absolute inset-0"
      aria-hidden="true"
    />

    <div class="font-code text-fg3 flex items-center gap-2 text-[11px]">
      <span>{{ post.date }}</span>
      <span>·</span>
      <span>{{ post.readTime }}</span>
    </div>

    <h2
      class="text-fg text-[20px] leading-[1.3] font-semibold tracking-[-0.02em]"
    >
      {{ post.title }}
    </h2>

    <p class="text-fg2 line-clamp-3 flex-1 text-[14px] leading-[1.7]">
      {{ post.excerpt }}
    </p>

    <div
      class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="font-code text-fg3 bg-bg3 rounded-[3px] px-[10px] py-[3px] text-[11px]"
          >{{ tag }}</span
        >
      </div>
      <span
        class="post-more font-code text-accent text-[12px] whitespace-nowrap"
        >read more →</span
      >
    </div>
  </article>
</template>

<style scoped>
.post-card {
  opacity: 0;
  transition: border-color 0.2s ease;
}
.post-card--visible {
  animation: fadeUp 0.6s var(--delay, 0s) ease forwards;
}
.post-card:hover {
  border-color: rgba(255, 255, 255, 0.14);
}
html.light .post-card:hover {
  border-color: rgba(0, 0, 0, 0.18);
}
.card-overlay {
  background: linear-gradient(135deg, var(--accent-dim) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.2s;
}
.post-card:hover .card-overlay {
  opacity: 1;
}
.post-more {
  opacity: 0;
  transition: opacity 0.2s;
}
.post-card:hover .post-more {
  opacity: 1;
}
</style>
