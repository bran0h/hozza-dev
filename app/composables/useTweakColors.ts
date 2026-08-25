import { refreshFavicon } from "../../utils/favicon";

const STORAGE_KEY = "hozza-dev:tweak-colors";
const DEFAULT_PRIMARY_DARK_HEX = "#dda15e";
const DEFAULT_PRIMARY_LIGHT_HEX = "#94381f";

/** Custom properties come back as authored, so accept hex as well as rgb(). */
function toHex(value: string): string | null {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1]!;
    return h.length === 3
      ? `#${h
          .split("")
          .map((c) => c + c)
          .join("")}`.toLowerCase()
      : `#${h.toLowerCase()}`;
  }

  const rgb = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (!rgb) return null;
  const [, r, g, b] = rgb;
  return `#${[r, g, b].map((x) => Number(x).toString(16).padStart(2, "0")).join("")}`;
}

function captureHtmlThemeClasses(): { dark: boolean; light: boolean } {
  const el = document.documentElement;
  return {
    dark: el.classList.contains("dark"),
    light: el.classList.contains("light"),
  };
}

function restoreHtmlThemeClasses(had: { dark: boolean; light: boolean }) {
  const el = document.documentElement;
  el.classList.toggle("dark", had.dark);
  el.classList.toggle("light", had.light);
}

/** Resolve --primary from stylesheet for one theme without trusting current mode. */
function readPrimaryHexWithHtmlClass(mode: "dark" | "light"): string {
  const el = document.documentElement;
  const had = captureHtmlThemeClasses();
  el.classList.remove("dark", "light");
  el.classList.add(mode === "dark" ? "dark" : "light");
  void el.offsetHeight;
  const raw = getComputedStyle(el).getPropertyValue("--primary").trim();
  const hex = toHex(raw);
  restoreHtmlThemeClasses(had);
  return (
    hex ??
    (mode === "dark" ? DEFAULT_PRIMARY_DARK_HEX : DEFAULT_PRIMARY_LIGHT_HEX)
  );
}

export function useTweakColors() {
  const colorMode = useColorMode();
  const primaryDarkHex = ref(DEFAULT_PRIMARY_DARK_HEX);
  const primaryLightHex = ref(DEFAULT_PRIMARY_LIGHT_HEX);
  const hydrated = ref(false);
  const silencePersist = ref(false);

  function isEffectiveDark() {
    const v = colorMode.value;
    if (v === "light") return false;
    if (v === "dark") return true;
    if (import.meta.client) {
      return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  }

  function applyPrimaryForCurrentMode() {
    const root = document.documentElement;
    root.style.setProperty(
      "--primary",
      isEffectiveDark() ? primaryDarkHex.value : primaryLightHex.value,
    );
    refreshFavicon();
  }

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          primaryDark: primaryDarkHex.value,
          primaryLight: primaryLightHex.value,
        }),
      );
    } catch {
      /* ignore */
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as {
        primaryDark?: string;
        primaryLight?: string;
        primary?: string;
        accent?: string;
      };

      if (
        parsed.primaryDark?.startsWith("#") &&
        parsed.primaryLight?.startsWith("#")
      ) {
        primaryDarkHex.value = parsed.primaryDark;
        primaryLightHex.value = parsed.primaryLight;
        return true;
      }

      const legacy = parsed.primary?.startsWith("#")
        ? parsed.primary
        : parsed.accent?.startsWith("#")
          ? parsed.accent
          : null;
      if (legacy) {
        primaryDarkHex.value = legacy;
        primaryLightHex.value = legacy;
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  function reset() {
    silencePersist.value = true;
    document.documentElement.style.removeProperty("--primary");
    primaryDarkHex.value = readPrimaryHexWithHtmlClass("dark");
    primaryLightHex.value = readPrimaryHexWithHtmlClass("light");
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    applyPrimaryForCurrentMode();
    nextTick(() => {
      silencePersist.value = false;
    });
  }

  function syncPickersFromCss() {
    primaryDarkHex.value = readPrimaryHexWithHtmlClass("dark");
    primaryLightHex.value = readPrimaryHexWithHtmlClass("light");
  }

  onMounted(() => {
    syncPickersFromCss();
    const hadSaved = load();
    if (hadSaved) applyPrimaryForCurrentMode();
    else refreshFavicon();
    hydrated.value = true;
  });

  watch(
    () => colorMode.value,
    () => {
      if (!import.meta.client || !hydrated.value || silencePersist.value)
        return;
      applyPrimaryForCurrentMode();
    },
  );

  watch([primaryDarkHex, primaryLightHex], () => {
    if (!import.meta.client || !hydrated.value || silencePersist.value) return;
    applyPrimaryForCurrentMode();
    persist();
  });

  return {
    primaryDarkHex,
    primaryLightHex,
    reset,
    syncPickersFromCss,
  };
}
