// Dados de EXEMPLO (placeholder) para provar o motor da apresentação.
// O conteúdo real e completo será preenchido no FEAT-003 a partir das docs
// do Kiro em /projects/sandbox/.ref/*.md. Aqui basta um subconjunto que
// exercite todos os tipos de nó e a relação assunto -> subassuntos.

import type { Apresentacao } from '~/tipos/apresentacao'

/**
 * Espaçamento base entre nós, para organizar o grafo em uma faixa horizontal
 * com os detalhes posicionados abaixo de cada assunto.
 */
const ESPACO_X = 520
const LINHA_ASSUNTOS = 0
const LINHA_DETALHES = 260

export const apresentacaoPlaceholder: Apresentacao = {
  ordem: [
    'capa',
    'agenda',
    'assunto-specs',
    'assunto-steering',
    'assunto-hooks'
  ],
  slides: [
    {
      id: 'capa',
      titulo: 'Kiro IDE',
      tipo: 'capa',
      posicao: { x: 0, y: LINHA_ASSUNTOS },
      conteudo: {
        subtitulo: 'Desenvolvimento assistido por IA',
        descricao: 'Uma apresentação interativa sobre os recursos do Kiro IDE.',
        icone: 'i-lucide-sparkles'
      }
    },
    {
      id: 'agenda',
      titulo: 'Agenda',
      tipo: 'agenda',
      posicao: { x: ESPACO_X, y: LINHA_ASSUNTOS },
      conteudo: {
        descricao: 'O que vamos explorar nesta apresentação.',
        topicos: ['Specs', 'Steering', 'Hooks'],
        icone: 'i-lucide-list-checks'
      }
    },
    {
      id: 'assunto-specs',
      titulo: 'Specs',
      tipo: 'assunto',
      posicao: { x: ESPACO_X * 2, y: LINHA_ASSUNTOS },
      subnos: ['detalhe-specs-1', 'detalhe-specs-2'],
      conteudo: {
        subtitulo: 'Do requisito ao código',
        descricao: 'Planejamento estruturado antes da implementação.',
        icone: 'i-lucide-file-text'
      }
    },
    {
      id: 'detalhe-specs-1',
      titulo: 'Requisitos',
      tipo: 'detalhe',
      paiId: 'assunto-specs',
      posicao: { x: ESPACO_X * 2 - 200, y: LINHA_DETALHES },
      conteudo: {
        descricao: 'Descreve o comportamento esperado em linguagem clara.',
        icone: 'i-lucide-clipboard-list'
      }
    },
    {
      id: 'detalhe-specs-2',
      titulo: 'Tarefas',
      tipo: 'detalhe',
      paiId: 'assunto-specs',
      posicao: { x: ESPACO_X * 2 + 200, y: LINHA_DETALHES },
      conteudo: {
        descricao: 'Divide o trabalho em passos rastreáveis.',
        icone: 'i-lucide-check-square'
      }
    },
    {
      id: 'assunto-steering',
      titulo: 'Steering',
      tipo: 'assunto',
      posicao: { x: ESPACO_X * 3, y: LINHA_ASSUNTOS },
      subnos: ['detalhe-steering-1'],
      conteudo: {
        subtitulo: 'Regras persistentes do projeto',
        descricao: 'Orienta o comportamento do agente em todo o repositório.',
        icone: 'i-lucide-compass'
      }
    },
    {
      id: 'detalhe-steering-1',
      titulo: 'Inclusão',
      tipo: 'detalhe',
      paiId: 'assunto-steering',
      posicao: { x: ESPACO_X * 3, y: LINHA_DETALHES },
      conteudo: {
        descricao: 'Regras sempre ativas, por padrão de arquivo ou manuais.',
        icone: 'i-lucide-toggle-right'
      }
    },
    {
      id: 'assunto-hooks',
      titulo: 'Hooks',
      tipo: 'assunto',
      posicao: { x: ESPACO_X * 4, y: LINHA_ASSUNTOS },
      subnos: ['detalhe-hooks-1', 'detalhe-hooks-2'],
      conteudo: {
        subtitulo: 'Automação por eventos',
        descricao: 'Dispara ações do agente quando algo acontece no projeto.',
        icone: 'i-lucide-zap'
      }
    },
    {
      id: 'detalhe-hooks-1',
      titulo: 'Ao salvar',
      tipo: 'detalhe',
      paiId: 'assunto-hooks',
      posicao: { x: ESPACO_X * 4 - 200, y: LINHA_DETALHES },
      conteudo: {
        descricao: 'Executa uma ação sempre que um arquivo é salvo.',
        icone: 'i-lucide-save'
      }
    },
    {
      id: 'detalhe-hooks-2',
      titulo: 'Manual',
      tipo: 'detalhe',
      paiId: 'assunto-hooks',
      posicao: { x: ESPACO_X * 4 + 200, y: LINHA_DETALHES },
      conteudo: {
        descricao: 'Acionado sob demanda por um botão dedicado.',
        icone: 'i-lucide-mouse-pointer-click'
      }
    }
  ],
  arestas: [
    { id: 'a-capa-agenda', origem: 'capa', destino: 'agenda', animada: true },
    { id: 'a-agenda-specs', origem: 'agenda', destino: 'assunto-specs', animada: true },
    { id: 'a-specs-steering', origem: 'assunto-specs', destino: 'assunto-steering', animada: true },
    { id: 'a-steering-hooks', origem: 'assunto-steering', destino: 'assunto-hooks', animada: true },
    { id: 'a-specs-d1', origem: 'assunto-specs', destino: 'detalhe-specs-1' },
    { id: 'a-specs-d2', origem: 'assunto-specs', destino: 'detalhe-specs-2' },
    { id: 'a-steering-d1', origem: 'assunto-steering', destino: 'detalhe-steering-1' },
    { id: 'a-hooks-d1', origem: 'assunto-hooks', destino: 'detalhe-hooks-1' },
    { id: 'a-hooks-d2', origem: 'assunto-hooks', destino: 'detalhe-hooks-2' }
  ]
}
