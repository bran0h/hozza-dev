<script setup lang="ts">
/** Read as a sentence, not a wall of pills — order is roughly how often I reach for it. */
const groups = [
  {
    title: "Frontend",
    items: ["TypeScript", "Vue", "Nuxt", "Tailwind CSS", "React Native / Expo"],
  },
  {
    title: "Backend",
    items: [
      "AdonisJS",
      "Express",
      "LangChain",
      "AWS Bedrock",
      "PostgreSQL",
      "Supabase",
      "MSSQL",
      "MongoDB",
      ".NET",
      "Axum",
      "Actix",
    ],
  },
  {
    title: "Infrastructure",
    items: ["Docker", "Kubernetes", "R2 / S3", "CI/CD", "GitHub", "GitLab"],
  },
  {
    title: "After hours",
    items: ["Rust", "Bevy", "Godot", "Unity"],
  },
];
</script>

<template>
  <section id="toolkit" class="shell scroll-mt-24 pt-20 sm:pt-28">
    <SectionHead>What I work with</SectionHead>

    <dl>
      <div
        v-for="group in groups"
        :key="group.title"
        v-reveal
        class="border-rule grid gap-x-10 gap-y-1 border-b py-5 lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] lg:items-baseline"
      >
        <dt class="label">{{ group.title }}</dt>
        <dd class="text-[1.0625rem] leading-[1.7]">
          <span v-for="(item, i) in group.items" :key="item" class="text-fg2">
            <span class="text-fg">{{ item }}</span
            ><span v-if="i < group.items.length - 1" class="text-fg3">, </span>
          </span>
        </dd>
      </div>
    </dl>
  </section>
</template>
