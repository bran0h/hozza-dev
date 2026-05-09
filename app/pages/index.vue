<template>
  <div class="bg-bg text-fg min-h-screen overflow-x-hidden">
    <div class="scanline" aria-hidden="true" />
    <SiteNav>
      <NuxtLink
        to="/blog"
        class="text-fg2 hover:text-accent font-code text-[13px] no-underline transition-colors"
      >
        ./blog
      </NuxtLink>
    </SiteNav>

    <HomeHeroSection />
    <HomeStackSection />
    <HomeProjectsSection />
    <HomeHobbyProjectsSection />
    <HomeContactSection />
    <SiteFooter />
  </div>
</template>
