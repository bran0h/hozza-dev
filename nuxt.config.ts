import VueI18nPlugin from "@intlify/unplugin-vue-i18n";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-04-28",
  app: {
    head: {
      title: "Branislav Hozza — full-stack developer",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "description",
          content:
            "Branislav Hozza — full-stack developer in Slovakia. TypeScript, Nuxt and AdonisJS by day, Rust by night.",
        },
      ],
    },
  },
  css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
      VueI18nPlugin.vite({
        include: ["./locales/**"],
      }),
    ],
    optimizeDeps: {
      include: ["@nuxtjs/mdc"],
    },
  },
  modules: [
    "@nuxt/icon",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxt/content",
  ],
  devtools: { enabled: true },
  googleFonts: {
    families: {
      // Display serif for headlines, text serif for prose, grotesque for labels.
      "Instrument Serif": [400],
      Newsreader: "200..600",
      "Inter Tight": "400..600",
      "JetBrains Mono": "400..600",
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
  },
  content: {
    highlight: {
      theme: {
        default: "github-light",
        dark: "github-dark",
        light: "github-light",
      },
      langs: [
        "typescript",
        "javascript",
        "rust",
        "sql",
        "css",
        "bash",
        "yaml",
        "dockerfile",
        "vue",
      ],
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "sr"],
  },
});
