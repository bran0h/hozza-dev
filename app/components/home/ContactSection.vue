<script setup lang="ts">
const { el: contactEl, visible: contactVisible } = useVisible();
const email = "brankohozza@gmail.com";
const copied = ref(false);

function copyEmail() {
  navigator.clipboard.writeText(email).then(() => {
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  });
}
</script>

<template>
  <section
    id="contact"
    class="relative flex min-h-[60vh] flex-col justify-center px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-[120px]"
  >
    <div
      class="absolute top-0 right-6 left-6 h-px bg-[var(--border)] sm:right-8 sm:left-8 lg:right-12 lg:left-12"
    />

    <div
      :ref="(el) => (contactEl = el as HTMLElement)"
      class="max-w-[700px] transition-all duration-700"
      :class="
        contactVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      "
    >
      <div class="font-code text-fg3 mb-3 text-[12px] tracking-[0.1em]">
        <span class="text-accent">03</span> / 03
      </div>
      <h2
        class="mb-7 text-[clamp(36px,5vw,72px)] leading-none font-bold tracking-[-0.04em]"
      >
        Let's talk<span class="text-accent">.</span>
      </h2>
      <p class="text-fg2 mb-12 text-[17px] leading-[1.7]">
        Open to interesting projects, collaborations, and conversations. Find me
        online or drop a message.
      </p>

      <div class="flex flex-col gap-4">
        <div
          class="bg-bg2 font-code hover:border-accent flex flex-col gap-2 rounded-[8px] border border-[var(--border)] px-5 py-5 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-6"
          @click="copyEmail"
        >
          <span class="text-fg3 text-[12px]">email</span>
          <span class="text-fg w-full flex-1 text-[14px] sm:w-auto">{{
            email
          }}</span>
          <span
            class="text-[12px] transition-colors"
            :class="copied ? 'text-accent' : 'text-fg3'"
            >{{ copied ? "copied!" : "click to copy" }}</span
          >
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://github.com/bran0h"
            target="_blank"
            rel="noopener"
            class="bg-bg2 text-fg2 font-code hover:border-accent hover:text-accent flex flex-1 justify-center rounded-[8px] border border-[var(--border)] py-4 text-[13px] no-underline transition-all"
            >./github</a
          >
          <NuxtLink
            to="/blog"
            class="bg-bg2 text-fg2 font-code hover:border-accent hover:text-accent flex flex-1 justify-center rounded-[8px] border border-[var(--border)] py-4 text-[13px] no-underline transition-all"
          >
            ./blog</NuxtLink
          >
        </div>
      </div>
    </div>
  </section>
</template>
