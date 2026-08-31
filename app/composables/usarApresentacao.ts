// Composable que é o MOTOR da apresentação.
//
// Responsabilidades:
// - manter a lista ordenada de slides (assuntos e detalhes);
// - controlar o slide atual em estado client-side (useState), sem NENHUMA
//   chamada periódica ao servidor (steering CUSTO-ZERO);
// - expor as funções de navegação proximo() / anterior() / irPara(id);
// - integrar com a instância do Vue Flow (useVueFlow) para animar a câmera
//   até o nó atual, produzindo a sensação de "slides" navegando pelo grafo.
//
// IMPORTANTE: este composable é usado apenas dentro de componentes .client
// (Vue Flow acessa window/document). O useVueFlow só existe no cliente.

import { useVueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import type { Apresentacao, Slide } from '~/tipos/apresentacao'
import { apresentacaoPlaceholder } from '~/dados/slidesPlaceholder'

/** Duração padrão (ms) das animações de câmera entre nós. */
const DURACAO_ANIMACAO = 700

/** Zoom aplicado ao focar um assunto/slide individual. */
const ZOOM_FOCO = 1.15

export function usarApresentacao(dados: Apresentacao = apresentacaoPlaceholder) {
  // A instância do Vue Flow é identificada por um id fixo, compartilhado com
  // o componente <VueFlow :id="..."> do palco.
  const { setCenter, fitView, findNode } = useVueFlow('palco-apresentacao')

  // Índice do slide atual na sequência de navegação. Estado 100% client-side.
  const indiceAtual = useState<number>('apresentacao-indice', () => 0)

  /** IDs dos slides na ordem de navegação. */
  const ordem = computed(() => dados.ordem)

  /** ID do slide atualmente em foco. */
  const idAtual = computed<string | undefined>(() => ordem.value[indiceAtual.value])

  /** Mapa auxiliar id -> slide para buscas rápidas. */
  const mapaSlides = computed<Map<string, Slide>>(() => {
    const mapa = new Map<string, Slide>()
    for (const slide of dados.slides) {
      mapa.set(slide.id, slide)
    }
    return mapa
  })

  /** Slide atualmente em foco (objeto completo). */
  const slideAtual = computed<Slide | undefined>(() =>
    idAtual.value ? mapaSlides.value.get(idAtual.value) : undefined
  )

  /**
   * Conjunto de IDs de detalhes (subnós) que devem estar visíveis.
   * Regra: quando o slide atual é um assunto com subnós, seus detalhes são
   * revelados; ao sair do assunto, eles são recolhidos.
   */
  const detalhesVisiveis = computed<Set<string>>(() => {
    const visiveis = new Set<string>()
    const atual = slideAtual.value
    if (atual?.subnos?.length) {
      for (const subId of atual.subnos) {
        visiveis.add(subId)
      }
    }
    // Se o próprio slide atual é um detalhe, mantém visível ele e os irmãos.
    if (atual?.tipo === 'detalhe' && atual.paiId) {
      const pai = mapaSlides.value.get(atual.paiId)
      pai?.subnos?.forEach((subId) => visiveis.add(subId))
    }
    return visiveis
  })

  /**
   * Nós no formato do Vue Flow, derivados dos slides. Cada nó carrega em `data`
   * as informações de conteúdo e o estado de destaque, para os componentes de
   * nó customizados renderizarem o visual adequado.
   */
  const nos = computed<Node[]>(() =>
    dados.slides.map((slide) => {
      const ehDetalhe = slide.tipo === 'detalhe'
      const visivel = !ehDetalhe || detalhesVisiveis.value.has(slide.id)
      const ehAtual = slide.id === idAtual.value

      return {
        id: slide.id,
        type: slide.tipo,
        position: slide.posicao,
        // `hidden` recolhe os detalhes que não pertencem ao assunto em foco.
        hidden: !visivel,
        // Classes CSS controlam destaque/esmaecimento (transições no CSS).
        class: [
          'no-apresentacao',
          ehAtual ? 'no-atual' : 'no-esmaecido'
        ].join(' '),
        data: {
          titulo: slide.titulo,
          conteudo: slide.conteudo,
          tipo: slide.tipo,
          atual: ehAtual
        },
        // Detalhes ficam sob o assunto (não recebem novas conexões manuais).
        draggable: false,
        selectable: false
      }
    })
  )

  /**
   * Arestas no formato do Vue Flow. Arestas que ligam um assunto aos seus
   * detalhes só aparecem quando os detalhes estão visíveis.
   */
  const arestas = computed<Edge[]>(() =>
    dados.arestas
      .filter((aresta) => {
        const destino = mapaSlides.value.get(aresta.destino)
        if (destino?.tipo === 'detalhe') {
          return detalhesVisiveis.value.has(destino.id)
        }
        return true
      })
      .map((aresta) => ({
        id: aresta.id,
        source: aresta.origem,
        target: aresta.destino,
        animated: aresta.animada ?? false,
        class: 'aresta-apresentacao'
      }))
  )

  /**
   * Anima a câmera até o slide indicado. Usa o centro do nó (quando já montado)
   * com setCenter; caso o nó ainda não exista, recorre a fitView focado no id.
   * Todas as animações são locais (CSS/canvas), sem tráfego de rede.
   */
  async function animarCameraPara(id: string) {
    // Aguarda o Vue atualizar o DOM/estado dos nós antes de mover a câmera,
    // garantindo que subnós recém-revelados já estejam medidos.
    await nextTick()

    const no = findNode(id)
    if (no) {
      const largura = no.dimensions?.width ?? 0
      const altura = no.dimensions?.height ?? 0
      const centroX = no.position.x + largura / 2
      const centroY = no.position.y + altura / 2
      await setCenter(centroX, centroY, {
        zoom: ZOOM_FOCO,
        duration: DURACAO_ANIMACAO
      })
      return
    }

    // Fallback: enquadra o nó pelo id caso ainda não tenha dimensões.
    await fitView({ nodes: [id], duration: DURACAO_ANIMACAO, maxZoom: ZOOM_FOCO })
  }

  /** Vai para o slide de índice informado, respeitando os limites da ordem. */
  async function irParaIndice(indice: number) {
    const limitado = Math.max(0, Math.min(indice, ordem.value.length - 1))
    indiceAtual.value = limitado
    const id = ordem.value[limitado]
    if (id) {
      await animarCameraPara(id)
    }
  }

  /** Navega para o próximo slide da sequência. */
  async function proximo() {
    await irParaIndice(indiceAtual.value + 1)
  }

  /** Navega para o slide anterior da sequência. */
  async function anterior() {
    await irParaIndice(indiceAtual.value - 1)
  }

  /** Navega diretamente para um slide pelo seu id. */
  async function irPara(id: string) {
    const indice = ordem.value.indexOf(id)
    if (indice >= 0) {
      await irParaIndice(indice)
    }
  }

  /** Vai para o primeiro slide. */
  async function irParaInicio() {
    await irParaIndice(0)
  }

  /** Vai para o último slide. */
  async function irParaFim() {
    await irParaIndice(ordem.value.length - 1)
  }

  /** Enquadra todo o grafo (visão geral), sem alterar o slide atual. */
  async function enquadrarTudo() {
    await fitView({ duration: DURACAO_ANIMACAO, padding: 0.2 })
  }

  return {
    // estado
    indiceAtual,
    idAtual,
    slideAtual,
    ordem,
    // dados derivados para o Vue Flow
    nos,
    arestas,
    detalhesVisiveis,
    // navegação
    proximo,
    anterior,
    irPara,
    irParaIndice,
    irParaInicio,
    irParaFim,
    enquadrarTudo,
    animarCameraPara
  }
}
