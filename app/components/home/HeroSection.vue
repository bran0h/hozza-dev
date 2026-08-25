<script setup lang="ts">
/** Hero is above the fold, so it animates on mount rather than on intersection. */
const loaded = ref(false);
onMounted(() => requestAnimationFrame(() => (loaded.value = true)));

function rise(order: number) {
  return {
    animation: loaded.value
      ? `riseIn 0.6s ${order * 0.09}s cubic-bezier(0.16, 1, 0.3, 1) forwards`
      : "none",
    opacity: 0,
  };
}

const currently = [
  {
    name: "Liftag",
    note: "gym tracking that starts with a QR code on the machine",
  },
  {
    name: "HozzaCloud",
    note: "where I keep my files",
    href: "https://cloud.hozza.dev",
  },
  {
    name: "Bevy & Rust",
    note: "a game engine I keep starting over",
  },
];
</script>

<template>
  <section class="shell pt-12 sm:pt-16 lg:pt-20">
    <p :style="rise(0)" class="label mb-6 sm:mb-8">
      Full-stack developer · Slovakia
    </p>

    <h1
      :style="rise(1)"
      class="mb-10 max-w-[46rem] text-[clamp(2.75rem,8.5vw,6rem)] leading-[0.98] sm:mb-12"
    >
      I build for the web,<br class="hidden sm:block" />
      front to back<span class="text-primary">.</span>
    </h1>

    <div
      class="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-20"
    >
      <div class="max-w-[var(--measure)]" :style="rise(2)">
        <p class="text-fg2 mb-5 text-[1.125rem] leading-[1.6]">
          Most days that means TypeScript — Nuxt on the front, AdonisJS behind
          it, Postgres underneath. I write web and mobile apps for financial
          institutions at
          <span class="text-fg">OVB</span>, and a handful of my own products
          around the edges of that.
        </p>
        <p class="text-fg2 text-[1.125rem] leading-[1.6]">
          Evenings are less sensible: a game engine in Rust, quantum computing
          in the browser, playing music with a webcam. I
          <NuxtLink to="/blog" class="link">write some of it down</NuxtLink>.
        </p>
      </div>

      <!-- Right rail: what is actually open on my desk this month. -->
      <aside :style="rise(3)" class="border-rule lg:border-l lg:pl-10">
        <p class="label mb-5">Currently</p>
        <ul class="flex flex-col gap-5">
          <li v-for="item in currently" :key="item.name" class="max-w-[17rem]">
            <component
              :is="item.href ? 'a' : 'span'"
              v-bind="
                item.href
                  ? {
                      href: item.href,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                    }
                  : {}
              "
              class="font-display block text-[1.25rem] leading-tight no-underline"
              :class="item.href ? 'hover:text-primary transition-colors' : ''"
            >
              {{ item.name
              }}<span v-if="item.href" class="text-fg3 ml-1 text-[0.7em]"
                >↗</span
              >
            </component>
            <p class="text-fg3 font-meta mt-1 text-[0.8125rem] leading-[1.45]">
              {{ item.note }}
            </p>
          </li>
        </ul>
      </aside>
    </div>
  </section>
</template>
