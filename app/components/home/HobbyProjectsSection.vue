<script setup lang="ts">
const projects = [
  {
    title: "Opti-Music",
    desc: "Play music with your hands. The webcam tracks your fingers through MediaPipe, the distance between them becomes a note. No instrument required.",
    tags: ["Nuxt", "MediaPipe", "Tone.js"],
    url: "https://opti-music.hozza.dev/",
  },
  {
    title: "Quantumania",
    desc: "Learn and try quantum computing straight from the browser — gates, circuits and state vectors you can poke at.",
    tags: ["Nuxt", "TypeScript"],
    url: "https://quantumania.hozza.dev/",
  },
];
</script>

<template>
  <section id="play" class="shell scroll-mt-24 pt-20 sm:pt-28">
    <SectionHead meta="Live">Things I made for fun</SectionHead>

    <ul>
      <li v-for="project in projects" :key="project.title" v-reveal>
        <a
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="row border-rule grid gap-x-10 gap-y-2 border-b py-6 no-underline sm:py-7 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,12rem)] lg:items-baseline"
        >
          <h3 class="text-[1.5rem] leading-tight sm:text-[1.75rem]">
            <span class="row-title">{{ project.title }}</span>
            <span class="arrow text-fg3 ml-1.5 text-[0.6em]">↗</span>
          </h3>

          <p class="text-fg2 leading-[1.6]">{{ project.desc }}</p>

          <p
            class="font-meta text-fg3 text-[0.78125rem] leading-[1.55] tracking-wide text-balance"
          >
            {{ tagList(project.tags) }}
          </p>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.row-title,
.arrow {
  transition:
    color 0.15s ease,
    transform 0.2s ease;
}

.arrow {
  display: inline-block;
}

.row:hover .row-title,
.row:hover .arrow {
  color: var(--primary);
}

.row:hover .arrow {
  transform: translate(2px, -2px);
}
</style>
