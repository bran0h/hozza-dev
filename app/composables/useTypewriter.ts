export function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const display = ref("");
  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let timer: ReturnType<typeof setTimeout>;

  function tick() {
    const word = words[wordIdx]!;
    if (!deleting) {
      if (charIdx < word.length) {
        charIdx++;
        display.value = word.slice(0, charIdx);
        timer = setTimeout(tick, speed);
      } else {
        timer = setTimeout(() => {
          deleting = true;
          tick();
        }, pause);
      }
    } else {
      if (charIdx > 0) {
        charIdx--;
        display.value = word.slice(0, charIdx);
        timer = setTimeout(tick, speed / 2);
      } else {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        timer = setTimeout(tick, speed);
      }
    }
  }

  onMounted(() => {
    timer = setTimeout(tick, speed);
  });
  onUnmounted(() => clearTimeout(timer));

  return display;
}
