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
import type { Apresentacao, CamadaVisual, Slide } from '~/tipos/apresentacao'
import { apresentacaoKiro } from '~/dados/slides'

/**
 * Wallpaper (plano de fundo do palco) resolvido para o slide em foco.
 * - 'imagem' : PNG existente em public/images/{id}.png (servido por URL);
 * - 'svg'    : SVG conceitual do IlustracaoFundo, identificado por `chave`;
 * - null     : slide sem imagem nem chave (fundo do palco fica só no gradiente).
 */
export type WallpaperAtual =
  | { tipo: 'imagem'; url: string; camada: CamadaVisual }
  | { tipo: 'svg'; chave: string; camada: CamadaVisual }
  | null

/** Duração padrão (ms) das animações de câmera entre nós. */
const DURACAO_ANIMACAO = 700

/** Zoom aplicado ao focar um assunto/slide individual. */
const ZOOM_FOCO = 1.15

/**
 * Classifica cada slide em uma "camada visual" para colorir os cartões de
 * forma coerente (infográfico). A camada é derivada do id/tipo do slide,
 * evitando repetir a cor em cada um dos 27 slides do arquivo de dados.
 *
 * Camadas:
 * - 'abertura'   : capa, agenda, overview e encerramento (neutro/roxo base)
 * - 'ide'        : o bloco do Kiro IDE (história, modelos, effort, linguagens)
 * - 'harness'    : conceito de harness e o harness do Kiro
 * - 'recurso'    : os recursos do .kiro (specs, steering, hooks, permissions...)
 * - 'superficie' : as demais superfícies (CLI, Web, Mobile, Crew)
 */
function classificarCamada(slide: Slide): CamadaVisual {
  const id = slide.id
  const pai = slide.paiId ?? ''

  if (id.startsWith('superficie') || pai.startsWith('superficie')) {
    return 'superficie'
  }
  if (
    id.startsWith('harness') ||
    id.startsWith('harn-') ||
    id.startsWith('hk-') ||
    pai.startsWith('harness')
  ) {
    return 'harness'
  }
  if (
    id.startsWith('recurso-') ||
    id.startsWith('kiro-global') ||
    id.startsWith('kiro-projeto') ||
    pai.startsWith('recurso-') ||
    pai.startsWith('kiro-')
  ) {
    return 'recurso'
  }
  if (id.startsWith('ide') || pai.startsWith('ide') || id.startsWith('hist-')) {
    return 'ide'
  }
  return 'abertura'
}

export function usarApresentacao(dados: Apresentacao = apresentacaoKiro) {
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
   * Wallpaper (plano de fundo do palco) do slide em foco, resolvido por
   * PRIORIDADE, sem qualquer chamada de rede (existência do PNG é build-time
   * via urlImagemSlide -> import.meta.glob):
   *
   * 1. PNG do próprio slide: public/images/{idAtual}.png (assunto OU detalhe).
   * 2. Herança do pai (detalhes, que não têm chave própria):
   *    2a. PNG do assunto pai (public/images/{paiId}.png);
   *    2b. chave SVG do assunto pai (conteudo.ilustracao) -> IlustracaoFundo.
   * 3. Assunto sem PNG: sua própria chave SVG (conteudo.ilustracao).
   *
   * A camada é derivada de classificarCamada (mesma cor por camada dos nós),
   * garantindo que o SVG do wallpaper receba var(--cor)/var(--cor-forte).
   */
  const wallpaperAtual = computed<WallpaperAtual>(() => {
    const atual = slideAtual.value
    if (!atual) return null

    const camada = classificarCamada(atual)

    // 1. PNG do próprio slide (vale para assunto e detalhe).
    const urlProprio = urlImagemSlide(atual.id)
    if (urlProprio) {
      return { tipo: 'imagem', url: urlProprio, camada }
    }

    // 2. Detalhe sem PNG próprio: herda do assunto pai.
    if (atual.tipo === 'detalhe' && atual.paiId) {
      const urlPai = urlImagemSlide(atual.paiId)
      if (urlPai) {
        return { tipo: 'imagem', url: urlPai, camada }
      }
      const chavePai = mapaSlides.value.get(atual.paiId)?.conteudo?.ilustracao
      if (chavePai) {
        return { tipo: 'svg', chave: chavePai, camada }
      }
      return null
    }

    // 3. Assunto/panorama sem PNG: usa a própria chave SVG conceitual.
    const chavePropria = atual.conteudo?.ilustracao
    if (chavePropria) {
      return { tipo: 'svg', chave: chavePropria, camada }
    }

    return null
  })

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
      const camada = classificarCamada(slide)

      // Ilustração de fundo: o assunto usa a própria chave; o detalhe HERDA a
      // chave do assunto pai (renderizada de forma mais esmaecida pelo NoDetalhe),
      // reforçando que o detalhe "pertence" ao assunto — sem inventar dezenas de
      // desenhos novos. Se o pai não tiver ilustração, o detalhe fica sem fundo.
      const ilustracao = ehDetalhe && slide.paiId
        ? mapaSlides.value.get(slide.paiId)?.conteudo?.ilustracao
        : slide.conteudo?.ilustracao

      return {
        id: slide.id,
        type: slide.tipo,
        position: slide.posicao,
        // `hidden` recolhe os detalhes que não pertencem ao assunto em foco.
        hidden: !visivel,
        // Classes CSS controlam destaque/esmaecimento e a cor por camada
        // (transições declaradas no CSS não escopado do palco).
        class: [
          'no-apresentacao',
          `camada-${camada}`,
          ehAtual ? 'no-atual' : 'no-esmaecido'
        ].join(' '),
        data: {
          titulo: slide.titulo,
          conteudo: slide.conteudo,
          tipo: slide.tipo,
          camada,
          atual: ehAtual,
          // Chave da ilustração de fundo já resolvida (própria ou herdada do pai).
          ilustracao
        },
        // Detalhes ficam sob o assunto (não recebem novas conexões manuais).
        draggable: false,
        selectable: false
      }
    })
  )

  /**
   * Arestas no formato do Vue Flow.
   *
   * Duas famílias:
   * - assunto -> detalhe: só aparecem quando os detalhes do assunto em foco
   *   estão visíveis (ligadas do handle inferior "detalhes" ao topo do detalhe);
   * - fluxo principal (assunto -> assunto): sempre existem, mas apenas a
   *   aresta que TOCA o nó atual fica em destaque; as demais são esmaecidas.
   *
   * O esmaecimento das arestas de fluxo que não tocam o nó atual evita o efeito
   * de "linhas que se conectam a nada" quando a câmera dá zoom em um único nó —
   * os vizinhos ficam fora do viewport e suas linhas cruzavam a tela rumo ao
   * vazio. É o análogo, para arestas, do esmaecimento já aplicado aos nós
   * (`no-atual` / `no-esmaecido`).
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
      .map((aresta) => {
        const destino = mapaSlides.value.get(aresta.destino)
        const ehArestaDetalhe = destino?.tipo === 'detalhe'
        // Uma aresta de fluxo está "ativa" quando conecta o nó atual a um vizinho.
        const tocaAtual =
          aresta.origem === idAtual.value || aresta.destino === idAtual.value

        const classes = ['aresta-apresentacao']
        if (ehArestaDetalhe) {
          classes.push('aresta-detalhe')
        } else {
          classes.push(tocaAtual ? 'aresta-fluxo-ativa' : 'aresta-fluxo-esmaecida')
        }

        return {
          id: aresta.id,
          source: aresta.origem,
          target: aresta.destino,
          // Handles explícitos garantem curvas coerentes: o fluxo horizontal
          // sai pela direita e entra pela esquerda; o detalhe desce do handle
          // inferior do assunto para o topo do subnó.
          sourceHandle: ehArestaDetalhe ? 'detalhes' : 'fluxo-saida',
          targetHandle: ehArestaDetalhe ? 'detalhe-entrada' : 'fluxo-entrada',
          animated: (aresta.animada ?? false) && (ehArestaDetalhe || tocaAtual),
          class: classes.join(' ')
        }
      })
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
    wallpaperAtual,
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
