// modules/imagens-slides.ts — Módulo local Nuxt que lista, em BUILD-TIME, os PNGs de public/images.
// Lê a pasta uma vez no setup e injeta um módulo virtual '#imagens-slides' com IDS_COM_IMAGEM (Set
// de ids derivados dos nomes dos arquivos). Assim a existência do PNG é resolvida sem fetch/HEAD em
// runtime (steering CUSTO-ZERO), sem hardcode, e SEM colocar os binários no bundle (só URL /images).

import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { addTemplate, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'imagens-slides'
  },
  setup(_opcoes, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Diretório dos PNGs: public/images na raiz do projeto (rootDir do Nuxt).
    const diretorioImagens = join(nuxt.options.rootDir, 'public', 'images')

    // Lê os nomes dos arquivos .png UMA VEZ, em build-time. Se a pasta não
    // existir (ou não houver PNGs), degrada para lista vazia (só fallback SVG).
    let ids: string[] = []
    try {
      ids = readdirSync(diretorioImagens)
        .filter((nome) => /\.png$/i.test(nome))
        .map((nome) => nome.replace(/\.png$/i, ''))
        .sort()
    }
    catch {
      ids = []
    }

    // Módulo virtual '#imagens-slides' consumido pelo app (app/utils/imagensSlides.ts).
    // Exporta o Set já pronto — nenhum binário é importado, apenas os nomes.
    const template = addTemplate({
      filename: 'imagens-slides.mjs',
      write: true,
      getContents: () =>
        `// Gerado por modules/imagens-slides.ts em build-time — NÃO editar.\n`
        + `export const IDS_COM_IMAGEM = new Set(${JSON.stringify(ids)})\n`
    })

    // Também um .d.ts para tipar o import virtual.
    addTemplate({
      filename: 'imagens-slides.d.ts',
      write: true,
      getContents: () =>
        `// Gerado por modules/imagens-slides.ts — tipos do módulo virtual '#imagens-slides'.\n`
        + `declare module '#imagens-slides' {\n`
        + `  export const IDS_COM_IMAGEM: Set<string>\n`
        + `}\n`
    })

    // Registra o alias '#imagens-slides' apontando para o template gerado.
    nuxt.options.alias['#imagens-slides'] = template.dst

    // Garante que o .d.ts entre no contexto TypeScript do Nuxt.
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ path: resolver.resolve(nuxt.options.buildDir, 'imagens-slides.d.ts') })
    })
  }
})
