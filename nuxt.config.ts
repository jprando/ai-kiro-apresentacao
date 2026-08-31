// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  // Tema escuro elegante como base do infográfico (a apresentação foi
  // desenhada para o modo escuro; sem seletor no palco).
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },
  // Tipografia da apresentação via @nuxt/fonts (incluído pelo Nuxt UI).
  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Sora', provider: 'google' }
    ]
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
