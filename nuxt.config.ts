import VueI18nPlugin from "@intlify/unplugin-vue-i18n";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-04-28",
  app: {
    head: {
      title: "hozza.dev",
      htmlAttrs: {
        lang: "en",
      },
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
      "JetBrains Mono": "200..700",
      "Space Grotesk": "300..700",
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
    fallback: "dark",
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
