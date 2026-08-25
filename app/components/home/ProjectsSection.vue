<script setup lang="ts">
type Entry = {
  title: string;
  desc: string;
  tags: string[];
  href?: string;
};

const selected: Entry[] = [
  {
    title: "Liftag",
    desc: "Gym workout tracking. Scan the QR code on any machine and the exercise is already loaded — log sets, finish, and the workout syncs to Strava. React Native app, AdonisJS API, Nuxt dashboard for gym owners.",
    tags: ["Expo", "AdonisJS", "PostgreSQL", "Nuxt"],
  },
  {
    title: "HozzaCloud",
    desc: "My own file storage — upload, organise and share files from anywhere, without handing them to somebody else's cloud.",
    tags: ["Nuxt", "TypeScript", "Self-hosted"],
    href: "https://cloud.hozza.dev",
  },
  {
    title: "Shufflescape",
    desc: "Website and course platform for the first shuffle dance school in Bratislava — four levels of classes, schedules and online sign-up, in Slovak and English.",
    tags: ["Nuxt", "Tailwind CSS", "i18n", "Vercel"],
    href: "https://shufflescape.com",
  },
  {
    title: "CardioElite",
    desc: "Cardiology platform for cardiovascular risk assessment and personalised lipid-lowering therapy recommendations.",
    tags: ["TypeScript", "Nuxt", "AdonisJS"],
  },
  {
    title: "OVB",
    desc: "Web and mobile apps for financial institutions, built and maintained inside a TypeScript monorepo.",
    tags: ["Nuxt", "AdonisJS", "Expo", "LangChain", "Monorepo"],
  },
];

const archive: Entry[] = [
  {
    title: "Tokengram",
    desc: "Creating and sharing tokenised content, on top of a graph database.",
    tags: ["Nuxt", "Graph databases", "AI", "Web3"],
  },
  {
    title: "meta-assets",
    desc: "Polkadot solution for representing game assets on-chain.",
    tags: ["Polkadot", "Substrate", "Rust"],
  },
  {
    title: "dotmemo.xyz",
    desc: "Sharing tokenised memories with friends.",
    tags: ["Nuxt", "Web3", "Cloudflare"],
  },
  {
    title: "Zhar",
    desc: "Social platform for tokenised real-life challenges.",
    tags: ["Expo", "Web3", "Ethereum"],
  },
  {
    title: "Crypto-estate",
    desc: "Buying and selling real estate with crypto.",
    tags: ["Nuxt", "Web3", "Cloudflare"],
  },
];
</script>

<template>
  <section id="work" class="shell scroll-mt-24 pt-20 sm:pt-28">
    <SectionHead :meta="`${selected.length} projects`">
      Selected work
    </SectionHead>

    <ul>
      <li v-for="entry in selected" :key="entry.title" v-reveal>
        <component
          :is="entry.href ? 'a' : 'div'"
          v-bind="
            entry.href
              ? {
                  href: entry.href,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : {}
          "
          class="row border-rule grid gap-x-10 gap-y-2 border-b py-6 no-underline sm:py-7 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,12rem)] lg:items-baseline"
          :class="entry.href ? 'row--link' : ''"
        >
          <h3 class="text-[1.5rem] leading-tight sm:text-[1.75rem]">
            <span class="row-title">{{ entry.title }}</span>
            <span v-if="entry.href" class="arrow text-fg3 ml-1.5 text-[0.6em]"
              >↗</span
            >
          </h3>

          <p class="text-fg2 leading-[1.6]">{{ entry.desc }}</p>

          <p
            class="font-meta text-fg3 text-[0.78125rem] leading-[1.55] tracking-wide text-balance"
          >
            {{ tagList(entry.tags) }}
          </p>
        </component>
      </li>
    </ul>

    <!-- Older things, kept as a compact index rather than a second card grid. -->
    <div class="mt-16 sm:mt-20">
      <SectionHead meta="Archived" size="sm">Previously</SectionHead>

      <ul>
        <li
          v-for="entry in archive"
          :key="entry.title"
          v-reveal
          class="border-rule grid gap-x-10 gap-y-1 border-b py-4 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,12rem)] lg:items-baseline"
        >
          <h3 class="text-fg2 text-[1.1875rem] leading-tight">
            {{ entry.title }}
          </h3>
          <p class="text-fg2 text-[0.9375rem] leading-[1.6]">
            {{ entry.desc }}
          </p>

          <p
            class="font-meta text-fg3 text-[0.75rem] leading-[1.55] tracking-wide text-balance"
          >
            {{ tagList(entry.tags) }}
          </p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.row-title {
  transition: color 0.15s ease;
}

.row--link:hover .row-title {
  color: var(--primary);
}

.arrow {
  transition:
    transform 0.2s ease,
    color 0.15s ease;
  display: inline-block;
}

.row--link:hover .arrow {
  color: var(--primary);
  transform: translate(2px, -2px);
}
</style>
