<script setup lang="ts">
defineProps<{
  post: {
    title: string;
    date: string;
    readTime: string;
    tags: string[];
    summary: string;
    path: string;
  };
}>();
</script>

<template>
  <article v-reveal class="post border-rule border-b">
    <NuxtLink
      :to="post.path"
      class="grid gap-x-10 gap-y-2 py-6 no-underline sm:py-7 lg:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_minmax(0,12rem)] lg:items-baseline"
    >
      <!-- Date column doubles as the index rail on wide screens. -->
      <p class="label whitespace-nowrap">
        {{ post.date }}
      </p>

      <div>
        <h2
          class="post-title mb-2 text-[1.5rem] leading-tight sm:text-[1.875rem]"
        >
          {{ post.title }}
        </h2>
        <p class="text-fg2 leading-[1.6]">{{ post.summary }}</p>
      </div>

      <p
        class="font-meta text-fg3 text-[0.78125rem] leading-[1.55] tracking-wide text-balance"
      >
        {{ post.readTime }}&nbsp;· {{ tagList(post.tags) }}
      </p>
    </NuxtLink>
  </article>
</template>

<style scoped>
.post-title {
  transition: color 0.15s ease;
}

.post:hover .post-title {
  color: var(--primary);
}
</style>
