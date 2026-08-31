// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
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
