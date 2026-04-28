export function useVisible(threshold = 0.15) {
  const el = ref<HTMLElement | null>(null);
  const visible = ref(false);

  onMounted(() => {
    if (!el.value) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          visible.value = true;
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el.value);
  });

  return { el, visible };
}
