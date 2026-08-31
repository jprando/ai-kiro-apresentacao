// nuxt.config.ts — Configuração raiz da apresentação Kiro (Nuxt 4 + Nuxt UI + Vue Flow).
// Define tema escuro, tipografia self-hosted (Inter/Sora) e os CSS globais (incl. Vue Flow).
// Referência da API: https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  // Preset Nitro do GitHub Pages: gera .nojekyll (impede o Jekyll de ignorar
  // _nuxt/) e o fallback 404.html do SPA. A baseURL do subcaminho é fornecida
  // via NUXT_APP_BASE_URL no build de CI.
  nitro: {
    preset: 'github-pages'
  },
  // Tema escuro elegante como base do infográfico (a apresentação foi
  // desenhada para o modo escuro; sem seletor no palco).
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },
  // Tipografia servida localmente via @nuxt/fonts (incluído pelo Nuxt UI).
  // provider: 'local' desativa TODOS os provedores externos (google/bunny/fontshare/
  // fontsource) — elimina o fetch de descoberta na inicialização, compatível com proxy
  // corporativo. Os arquivos .woff2 (Inter/Sora, pesos 400/600/700) ficam em public/fonts/
  // e são resolvidos automaticamente pelo provedor local a partir do nome no font-family.
  fonts: {
    provider: 'local',
    defaults: {
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin']
    }
  },
  css: [
    '~/assets/css/main.css',
    // Estilos do Vue Flow (o componente é renderizado apenas no cliente via <ClientOnly>)
    '@vue-flow/core/dist/style.css',
    '@vue-flow/core/dist/theme-default.css',
    '@vue-flow/controls/dist/style.css',
    '@vue-flow/minimap/dist/style.css'
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR'
      },
      title: 'Apresentação Kiro IDE',
      meta: [
        {
          name: 'description',
          content: 'Apresentação interativa sobre os recursos do Kiro IDE'
        }
      ]
    }
  }
})
