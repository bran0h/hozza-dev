<script setup lang="ts">
const email = "brankohozza@gmail.com";
const copied = ref(false);

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    /* clipboard blocked — the mailto link still works */
  }
}
</script>

<template>
  <section
    id="contact"
    class="shell scroll-mt-24 pt-20 pb-20 sm:pt-28 sm:pb-24"
  >
    <div class="mb-8 sm:mb-10">
      <SectionHead>Say hello</SectionHead>
    </div>

    <div
      class="grid gap-10 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-20"
    >
      <div v-reveal class="max-w-[var(--measure)]">
        <p class="text-fg2 mb-8 text-[1.125rem] leading-[1.6]">
          I'm always up for a good problem — an interesting project, a
          collaboration, or an argument about type systems. The inbox is the
          fastest way in.
        </p>

        <a
          :href="`mailto:${email}`"
          class="font-display hover:text-primary block text-[clamp(1.5rem,4vw,2.5rem)] leading-tight no-underline transition-colors"
        >
          {{ email }}
        </a>

        <button
          type="button"
          class="label hover:text-fg mt-4 transition-colors"
          @click="copyEmail"
        >
          {{ copied ? "Copied to clipboard" : "Copy address" }}
        </button>
      </div>

      <aside v-reveal class="border-rule lg:border-l lg:pl-10">
        <p class="label mb-5">Elsewhere</p>
        <ul class="flex flex-col gap-3">
          <li>
            <a
              href="https://github.com/bran0h"
              target="_blank"
              rel="noopener noreferrer"
              class="font-display hover:text-primary text-[1.25rem] no-underline transition-colors"
              >GitHub<span class="text-fg3 ml-1 text-[0.7em]">↗</span></a
            >
          </li>
          <li>
            <a
              href="https://cloud.hozza.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="font-display hover:text-primary text-[1.25rem] no-underline transition-colors"
              >HozzaCloud<span class="text-fg3 ml-1 text-[0.7em]">↗</span></a
            >
          </li>
          <li>
            <NuxtLink
              to="/blog"
              class="font-display hover:text-primary text-[1.25rem] no-underline transition-colors"
              >Writing</NuxtLink
            >
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>
