<script setup lang="ts">
/**
 * Section masthead: title, optional right-hand meta, and the rule underneath.
 * The rule is a real element rather than a border so it can draw itself in.
 */
withDefaults(
  defineProps<{
    meta?: string;
    size?: "lg" | "sm";
  }>(),
  { meta: undefined, size: "lg" },
);
</script>

<template>
  <div class="mb-2">
    <div class="flex items-baseline justify-between gap-6">
      <h2
        v-reveal:mask
        :class="
          size === 'sm'
            ? 'text-[clamp(1.5rem,3vw,2rem)]'
            : 'text-[clamp(1.75rem,4vw,2.75rem)]'
        "
      >
        <span><slot /></span>
      </h2>
      <span v-if="meta" v-reveal class="label shrink-0">{{ meta }}</span>
    </div>
    <span v-reveal:rule class="bg-fg mt-4 block h-px" aria-hidden="true" />
  </div>
</template>
