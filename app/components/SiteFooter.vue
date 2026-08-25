<template>
  <footer class="border-rule border-t">
    <div
      class="shell flex flex-col gap-6 py-10 sm:flex-row sm:items-baseline sm:justify-between sm:py-12"
    >
      <p class="font-display text-[1.125rem] leading-snug">
        Branislav Hozza
        <span class="text-fg3">— Bratislava, Slovakia</span>
      </p>

      <nav class="flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <a
          href="https://github.com/bran0h"
          target="_blank"
          rel="noopener noreferrer"
          class="label hover:text-fg no-underline transition-colors"
          >GitHub</a
        >
        <a
          href="https://cloud.hozza.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="label hover:text-fg no-underline transition-colors"
          >HozzaCloud</a
        >
        <NuxtLink
          to="/blog"
          class="label hover:text-fg no-underline transition-colors"
          >Writing</NuxtLink
        >
        <span class="label">© {{ new Date().getFullYear() }}</span>
      </nav>
    </div>
  </footer>
</template>
