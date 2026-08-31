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
  // Ícones (@nuxt/icon, embutido pelo Nuxt UI). Como o app é 100% estático e
  // publicado no GitHub Pages sob subcaminho, NÃO pode haver fetch de rede em
  // runtime (Iconify API) — que é o comportamento padrão para ícones fora do
  // client bundle em apps estáticos. Os ícones dos nós vêm de dados dinâmicos
  // (<UIcon :name="...">), então a análise estática do @nuxt/icon não os detecta.
  // Solução: provider 'none' (zero fetch em runtime) + client bundle com scan dos
  // literais nos componentes MAIS a lista explícita de todos os ícones dinâmicos
  // usados em app/dados/slides.ts (formato Iconify "lucide:nome"). Assim 100% dos
  // ícones ficam embutidos no bundle e nada é buscado da rede (alinhado ao custo-zero).
  icon: {
    provider: 'none',
    clientBundle: {
      scan: true,
      sizeLimitKb: 512,
      icons: [
        'lucide:alert-triangle',
        'lucide:ban',
        'lucide:bell',
        'lucide:book-open',
        'lucide:bot',
        'lucide:box',
        'lucide:boxes',
        'lucide:braces',
        'lucide:cable',
        'lucide:check',
        'lucide:check-check',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'lucide:clipboard-list',
        'lucide:code-2',
        'lucide:coffee',
        'lucide:coins',
        'lucide:compass',
        'lucide:cpu',
        'lucide:file-code',
        'lucide:file-code-2',
        'lucide:file-cog',
        'lucide:file-json',
        'lucide:files',
        'lucide:file-terminal',
        'lucide:file-text',
        'lucide:folder',
        'lucide:folder-git-2',
        'lucide:folder-lock',
        'lucide:gauge',
        'lucide:git-branch',
        'lucide:git-fork',
        'lucide:git-merge',
        'lucide:globe',
        'lucide:graduation-cap',
        'lucide:history',
        'lucide:house',
        'lucide:info',
        'lucide:key',
        'lucide:keyboard',
        'lucide:layers',
        'lucide:layers-2',
        'lucide:layout-template',
        'lucide:library',
        'lucide:lightbulb',
        'lucide:list-checks',
        'lucide:lock',
        'lucide:maximize',
        'lucide:messages-square',
        'lucide:network',
        'lucide:package',
        'lucide:panel-left',
        'lucide:panels-top-left',
        'lucide:plug',
        'lucide:plug-zap',
        'lucide:repeat',
        'lucide:save',
        'lucide:scale',
        'lucide:server',
        'lucide:settings-2',
        'lucide:shield',
        'lucide:shield-check',
        'lucide:shuffle',
        'lucide:sliders-horizontal',
        'lucide:smartphone',
        'lucide:sparkles',
        'lucide:split',
        'lucide:store',
        'lucide:target',
        'lucide:terminal',
        'lucide:terminal-square',
        'lucide:toggle-left',
        'lucide:toggle-right',
        'lucide:undo-2',
        'lucide:user',
        'lucide:users',
        'lucide:users-round',
        'lucide:wand-2',
        'lucide:workflow',
        'lucide:zap'
      ]
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
