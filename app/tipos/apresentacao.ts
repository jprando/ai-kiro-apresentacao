// Modelo de dados da apresentação interativa sobre o Kiro IDE.
// Todos os nomes e comentários em pt-BR (steering IDIOMA).
//
// A metáfora: cada "slide" é um nó (node) do Vue Flow. Os assuntos principais
// possuem subnós (subassuntos) que detalham o tema. A navegação move a câmera
// entre esses nós, produzindo a sensação de uma apresentação de slides.

/**
 * Tipos possíveis de um slide/nó da apresentação.
 * - 'capa'     : slide de abertura da apresentação
 * - 'agenda'   : visão geral dos temas que serão abordados
 * - 'overview' : panorama de um bloco (introdução de um grupo de assuntos)
 * - 'assunto'  : assunto principal (nó que pode expandir subassuntos)
 * - 'detalhe'  : detalhamento de um assunto (subnó)
 */
export type TipoSlide = 'capa' | 'agenda' | 'overview' | 'assunto' | 'detalhe'

/**
 * Camada visual usada para colorir os cartões de forma coerente, no estilo
 * de um infográfico. A camada é derivada do id/tipo do slide pelo motor
 * (composable), então não precisa ser preenchida manualmente nos dados.
 *
 * - 'abertura'   : capa, agenda, overview e encerramento
 * - 'ide'        : o bloco aprofundado do Kiro IDE
 * - 'harness'    : o conceito de harness e o harness do Kiro
 * - 'recurso'    : os recursos do .kiro (specs, steering, hooks, etc.)
 * - 'superficie' : as demais opções (CLI, Web, Mobile, Crew)
 */
export type CamadaVisual =
  | 'abertura'
  | 'ide'
  | 'harness'
  | 'recurso'
  | 'superficie'

/** Coordenada de posição de um nó no palco do Vue Flow. */
export interface Posicao {
  x: number
  y: number
}

/**
 * Conteúdo textual/visual de um slide. Mantido flexível para que o FEAT-003
 * preencha com o conteúdo real das docs do Kiro sem alterar o motor.
 */
export interface ConteudoSlide {
  /** Subtítulo ou chamada curta exibida abaixo do título. */
  subtitulo?: string
  /** Descrição em texto corrido. */
  descricao?: string
  /** Lista de tópicos/bullets. */
  topicos?: string[]
  /** Ícone (nome no formato do @nuxt/icon, ex.: 'i-lucide-sparkles'). */
  icone?: string
  /**
   * CHAVE estável que mapeia para uma ilustração de fundo conceitual do slide
   * (a "big image" que desenha a ideia do tema, ex.: 'motor-loop', 'velocimetro',
   * 'escudo-semaforo'). Resolvida pelo componente IlustracaoFundo; ausência ou
   * chave desconhecida = mantém apenas o fundo padrão do cartão (degrada bem).
   */
  ilustracao?: string
  /** Cor de destaque opcional (classe utilitária ou token de cor). */
  cor?: string
  /**
   * Caminho de uma imagem/logo exibida no topo do slide (ex.: o fantasminha
   * do Kiro na capa). Usado principalmente pelo nó de capa.
   */
  logo?: string
}

/**
 * Um slide da apresentação. Representa tanto assuntos principais quanto
 * subassuntos (detalhes). A relação de detalhamento é expressa por `subnos`
 * (no assunto pai) e/ou por `paiId` (no detalhe filho).
 */
export interface Slide {
  /** Identificador único do slide/nó. */
  id: string
  /** Título exibido no nó. */
  titulo: string
  /** Tipo do slide, controla o componente de nó customizado usado. */
  tipo: TipoSlide
  /** Conteúdo textual/visual do slide. */
  conteudo?: ConteudoSlide
  /** IDs dos subnós (detalhes) revelados ao focar este assunto. */
  subnos?: string[]
  /** ID do assunto pai, quando este slide for um detalhe (subnó). */
  paiId?: string
  /** Posição do nó no palco do Vue Flow. */
  posicao: Posicao
}

/**
 * Aresta (edge) que conecta dois slides no grafo. Reaproveita a ideia de
 * origem/destino do Vue Flow, com nomes em pt-BR na camada de modelo.
 */
export interface ArestaSlide {
  id: string
  origem: string
  destino: string
  /** Se a aresta deve ser animada (fluxo pontilhado em movimento). */
  animada?: boolean
}

/**
 * Estrutura completa da apresentação: a ordem de navegação (sequência de IDs),
 * os slides e as arestas entre eles.
 */
export interface Apresentacao {
  /** Ordem linear de navegação por teclado/controles (IDs de slides). */
  ordem: string[]
  /** Todos os slides da apresentação. */
  slides: Slide[]
  /** Arestas que ligam os slides no grafo. */
  arestas: ArestaSlide[]
}
