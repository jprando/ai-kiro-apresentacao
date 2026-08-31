// app/utils/imagensSlides.ts — Resolve a URL pública do PNG de um slide (/images/{id}.png).
// A lista de ids com PNG (IDS_COM_IMAGEM) é gerada em BUILD-TIME pelo módulo local
// modules/imagens-slides.ts (lê public/images e injeta o módulo virtual '#imagens-slides').
// Sem fetch/HEAD em runtime (CUSTO-ZERO), sem hardcode e sem embutir os binários no bundle.

import { IDS_COM_IMAGEM } from '#imagens-slides'

export { IDS_COM_IMAGEM }

/**
 * Retorna a URL pública da imagem do slide quando existe um PNG com o mesmo id
 * (ex.: 'ide' -> '/images/ide.png'); caso contrário, undefined (usa fallback SVG).
 * A URL aponta para public/ (servido na raiz), então o PNG nunca entra no bundle.
 */
export function urlImagemSlide(id: string): string | undefined {
  return IDS_COM_IMAGEM.has(id) ? `/images/${id}.png` : undefined
}
