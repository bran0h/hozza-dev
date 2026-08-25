/**
 * `v-reveal` — scroll-in reveals through a single shared IntersectionObserver.
 *
 * Variants pick the motion: `v-reveal` rises and fades, `v-reveal:rule` draws a
 * hairline out from the left, `v-reveal:mask` slides the child up out of a clip.
 *
 * Two deliberate choices:
 *  - Elements already on screen at mount are left alone. The hiding class can only
 *    be applied after hydration, so hiding then revealing something the reader can
 *    already see would flash. It also means the page degrades to fully visible if
 *    JS never runs — nothing is hidden by the server-rendered markup.
 *  - Stagger comes from each element's position in the observer batch, not its
 *    index in a list. A row that scrolls in alone animates immediately; a group
 *    entering together cascades.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | undefined;

  function observer() {
    io ??= new IntersectionObserver(
      (entries) => {
        // Anything jumped clean past (anchor link, Home/End, fast flick) is
        // already above the viewport and would otherwise stay hidden until the
        // reader scrolled back. Settle it silently instead.
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom > 0)
            continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-delay", "0ms");
          el.classList.add("reveal--in");
          io?.unobserve(el);
        }

        const arrived = entries.filter((e) => e.isIntersecting);
        arrived.forEach((entry, i) => {
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 70}ms`);
          el.classList.add("reveal--in");
          io?.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" },
    );
    return io;
  }

  nuxtApp.vueApp.directive("reveal", {
    getSSRProps: () => undefined,

    mounted(el: HTMLElement, binding) {
      const calm = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (calm) return;

      const box = el.getBoundingClientRect();
      const onScreen = box.top < window.innerHeight && box.bottom > 0;
      if (onScreen) return;

      el.classList.add("reveal", `reveal--${binding.arg ?? "up"}`);
      observer().observe(el);
    },

    unmounted(el: HTMLElement) {
      io?.unobserve(el);
    },
  });
});
