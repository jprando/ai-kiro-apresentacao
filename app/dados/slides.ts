// Conteúdo COMPLETO da apresentação sobre o Kiro, em pt-BR.
//
// Fonte de verdade: docs oficiais do Kiro baixadas em /projects/sandbox/.ref/
// (how-kiro-works, doc_ide, models, models_effort, models_available-models,
// specs, steering, hooks, mcp, skills, powers, checkpoints, permissions,
// custom-agents, guides_languages-and-frameworks, doc_cli/web/mobile/crew).
// Os textos foram traduzidos/adaptados para tom conciso de slide, sem inventar
// funcionalidades. O foco é APROFUNDADO no Kiro IDE; as demais opções
// (CLI, Web, Mobile, Crew) aparecem de forma breve.
//
// Público-alvo misto endereçado nos textos:
//  (i)   quem nunca usou IA para programar  -> introduções claras;
//  (ii)  quem já usou code agents           -> diferenciais (harness, specs...);
//  (iii) céticos/resistentes                -> controle, permissions, rewind.
//
// Nomes, comentários e conteúdo em pt-BR (steering IDIOMA). Estrutura estática
// no cliente (steering CUSTO-ZERO): nenhum fetch em tempo de execução.

import type { Apresentacao } from '~/tipos/apresentacao'

// --- Grade de posicionamento -------------------------------------------------
// Os assuntos principais ficam numa faixa horizontal. Os detalhes (subnós) de
// cada assunto são posicionados logo abaixo do pai, distribuídos na horizontal.
// ESPACO_X=800: o assunto "ide" tem 4 detalhes (o leque mais largo da grade).
// Centrado sob o pai, esse leque se estende ~490px para cada lado; com espaçamento
// menor ele invadia a faixa do card vizinho "overview" (que é largo, 360px). Com
// 800 todos os leques cabem entre os vizinhos com folga ≥ 40px, sem colisão.
const ESPACO_X = 800
const LINHA_ASSUNTOS = 0
const LINHA_DETALHES = 300
const PASSO_DETALHE = 250

/** Coluna X do i-ésimo assunto na faixa horizontal. */
function coluna(indice: number): number {
  return indice * ESPACO_X
}

/**
 * Distribui `total` detalhes horizontalmente, centrados sob a coluna do pai.
 * Retorna o X do detalhe de índice `i`.
 */
function xDetalhe(colunaPai: number, i: number, total: number): number {
  const inicio = colunaPai - ((total - 1) * PASSO_DETALHE) / 2
  return inicio + i * PASSO_DETALHE
}

export const apresentacaoKiro: Apresentacao = {
  ordem: [
    'capa',
    'agenda',
    'overview',
    'ide',
    'ide-historia',
    'ide-modelos',
    'ide-effort',
    'harness-conceito',
    'harness-kiro',
    'kiro-global',
    'kiro-projeto',
    'recurso-specs',
    'recurso-steering',
    'recurso-hooks',
    'recurso-mcp',
    'recurso-skills',
    'recurso-powers',
    'recurso-checkpoints',
    'recurso-permissions',
    'recurso-agents',
    'ide-linguagens',
    'superficies',
    'superficie-cli',
    'superficie-web',
    'superficie-mobile',
    'superficie-crew',
    'encerramento'
  ],
  slides: [
    // ======================= 1. CAPA =======================
    {
      id: 'capa',
      titulo: 'Kiro',
      tipo: 'capa',
      posicao: { x: coluna(0), y: LINHA_ASSUNTOS },
      conteudo: {
        logo: '/kiro-fantasminha.svg',
        ilustracao: 'fantasminha-portas',
        subtitulo: 'Um agente muitas opções',
        descricao:
          'Uma jornada pelos recursos do Kiro IDE — o ambiente de desenvolvimento com IA que mantém você no controle.'
      }
    },

    // ======================= 2. AGENDA =======================
    {
      id: 'agenda',
      titulo: 'Agenda',
      tipo: 'agenda',
      posicao: { x: coluna(1), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-list-checks',
        ilustracao: 'trilha-paradas',
        descricao: 'O caminho que vamos percorrer:',
        topicos: [
          'Overview: IDE, CLI, Web, Mobile e Crew',
          'Kiro IDE: história, modelos e reasoning effort',
          'Harness: o que é e como o Kiro organiza tudo',
          '.kiro global e por projeto: Specs, Steering, Hooks, MCP, Skills, Powers, Checkpoints, Permissions, Custom Agents',
          'Suporte a linguagens',
          'As demais opções em resumo'
        ]
      }
    },

    // ======================= 3. OVERVIEW =======================
    {
      id: 'overview',
      titulo: 'Overview do Kiro',
      tipo: 'overview',
      posicao: { x: coluna(2), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-layers',
        ilustracao: 'agente-portas',
        subtitulo: 'Um único agente, várias formas de conversar com ele',
        descricao:
          'Kiro é um só agente disponível onde você trabalha. IDE, CLI, Web e Mobile são portas de entrada para o mesmo "harness" unificado; o Crew é um agente pessoal que roda no seu hardware. Configurou uma vez — vale em qualquer superfície.',
        topicos: [
          'IDE — ambiente desktop para codar com o agente ao lado',
          'CLI — o agente no seu terminal, ótimo para automação e CI',
          'Web — agente no navegador, sem setup, entrega via pull request',
          'Mobile — inicie e acompanhe sessões pelo celular (iOS, early access)',
          'Crew — agente pessoal persistente que roda no seu hardware',
          'Nunca usou IA para codar? Comece pelo IDE. Já usa outro agente? O diferencial é o harness unificado.'
        ]
      }
    },

    // ======================= 4. KIRO IDE (bloco aprofundado) =======================
    {
      id: 'ide',
      titulo: 'Kiro IDE',
      tipo: 'assunto',
      posicao: { x: coluna(3), y: LINHA_ASSUNTOS },
      subnos: ['ide-d-editor', 'ide-d-specs', 'ide-d-chat', 'ide-d-controle'],
      conteudo: {
        icone: 'i-lucide-code-2',
        ilustracao: 'editor-robo',
        subtitulo: 'O ambiente desktop, em profundidade',
        descricao:
          'Ambiente de desenvolvimento desktop construído sobre a base do VS Code, com capacidades agentic. É aqui que exploramos os recursos com mais detalhe.'
      }
    },
    {
      id: 'ide-d-editor',
      titulo: 'Editor',
      tipo: 'detalhe',
      paiId: 'ide',
      posicao: { x: xDetalhe(coluna(3), 0, 4), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-panel-left',
        descricao:
          'Editor familiar (base VS Code): atalhos, indexação da base de código, controle de versão e extensões — nada de reaprender do zero.'
      }
    },
    {
      id: 'ide-d-specs',
      titulo: 'Specs no painel',
      tipo: 'detalhe',
      paiId: 'ide',
      posicao: { x: xDetalhe(coluna(3), 1, 4), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-clipboard-list',
        descricao:
          'Planeje features com requisitos, design e tarefas, acompanhando o progresso das tarefas em tempo real dentro do editor.'
      }
    },
    {
      id: 'ide-d-chat',
      titulo: 'Chat com contexto',
      tipo: 'detalhe',
      paiId: 'ide',
      posicao: { x: xDetalhe(coluna(3), 2, 4), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-messages-square',
        descricao:
          'Converse com seu código em linguagem natural, com contexto do projeto e diagnósticos do editor via #Problems.'
      }
    },
    {
      id: 'ide-d-controle',
      titulo: 'Você no controle',
      tipo: 'detalhe',
      paiId: 'ide',
      posicao: { x: xDetalhe(coluna(3), 3, 4), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-shield-check',
        descricao:
          'Diffs inline revisáveis, checkpoints e permissões: o agente propõe, você aprova. Pensado para quem desconfia de "IA que faz tudo sozinha".'
      }
    },

    // ---- IDE: História e origem ----
    {
      id: 'ide-historia',
      titulo: 'História e origem',
      tipo: 'assunto',
      posicao: { x: coluna(4), y: LINHA_ASSUNTOS },
      subnos: ['hist-d-base', 'hist-d-agentic'],
      conteudo: {
        icone: 'i-lucide-book-open',
        ilustracao: 'base-tijolos',
        subtitulo: 'De onde o Kiro IDE vem',
        descricao:
          'O IDE nasce de uma base consolidada de editor e ganha um agente de IA no centro da experiência.'
      }
    },
    {
      id: 'hist-d-base',
      titulo: 'Base VS Code',
      tipo: 'detalhe',
      paiId: 'ide-historia',
      posicao: { x: xDetalhe(coluna(4), 0, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-layout-template',
        descricao:
          'Construído sobre a fundação do VS Code: interface, extensões e fluxo de trabalho já conhecidos por milhões de devs.'
      }
    },
    {
      id: 'hist-d-agentic',
      titulo: 'Capacidades agentic',
      tipo: 'detalhe',
      paiId: 'ide-historia',
      posicao: { x: xDetalhe(coluna(4), 1, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-bot',
        descricao:
          'Sobre essa base, o Kiro adiciona um agente que planeja, edita vários arquivos e executa tarefas — desenvolvimento orientado a specs.'
      }
    },

    // ---- IDE: Modelos disponíveis ----
    {
      id: 'ide-modelos',
      titulo: 'Modelos disponíveis',
      tipo: 'assunto',
      posicao: { x: coluna(5), y: LINHA_ASSUNTOS },
      subnos: ['mod-d-catalogo', 'mod-d-auto', 'mod-d-custo'],
      conteudo: {
        icone: 'i-lucide-cpu',
        ilustracao: 'chips-cerebros',
        subtitulo: 'Escolha o modelo certo para a tarefa',
        descricao:
          'Acesso a modelos de fronteira e de peso aberto (OpenAI, Anthropic e outros). Escolha manual, ou deixe o Auto rotear cada tarefa.'
      }
    },
    {
      id: 'mod-d-catalogo',
      titulo: 'Catálogo amplo',
      tipo: 'detalhe',
      paiId: 'ide-modelos',
      posicao: { x: xDetalhe(coluna(5), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-library',
        descricao:
          'GPT-5.6 (Sol, Terra, Luna), Claude Opus e Sonnet, Haiku, e abertos como MiniMax, GLM, DeepSeek e Qwen — janelas de contexto de 128K a 1M.'
      }
    },
    {
      id: 'mod-d-auto',
      titulo: 'Auto (roteamento)',
      tipo: 'detalhe',
      paiId: 'ide-modelos',
      posicao: { x: xDetalhe(coluna(5), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-shuffle',
        descricao:
          'O Auto escolhe o melhor modelo por tarefa, equilibrando qualidade e custo automaticamente. Recomendado para o dia a dia.'
      }
    },
    {
      id: 'mod-d-custo',
      titulo: 'Custo relativo',
      tipo: 'detalhe',
      paiId: 'ide-modelos',
      posicao: { x: xDetalhe(coluna(5), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-coins',
        descricao:
          'O custo é relativo ao Auto (1.0x): Opus ~2.2x, Haiku ~0.4x, Qwen3 Coder Next ~0.05x. Dá para priorizar qualidade ou economia.'
      }
    },

    // ---- IDE: Reasoning effort ----
    {
      id: 'ide-effort',
      titulo: 'Reasoning effort',
      tipo: 'assunto',
      posicao: { x: coluna(6), y: LINHA_ASSUNTOS },
      subnos: ['eff-d-niveis', 'eff-d-quando'],
      conteudo: {
        icone: 'i-lucide-gauge',
        ilustracao: 'velocimetro',
        subtitulo: 'Quanto o modelo deve "pensar"',
        descricao:
          'Controla a profundidade de raciocínio: menos esforço = respostas rápidas e baratas; mais esforço = análise profunda. Disponível no IDE e no CLI.'
      }
    },
    {
      id: 'eff-d-niveis',
      titulo: 'Níveis',
      tipo: 'detalhe',
      paiId: 'ide-effort',
      posicao: { x: xDetalhe(coluna(6), 0, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-sliders-horizontal',
        descricao:
          'low, medium, high, xhigh e max. O seletor mostra apenas os níveis suportados pelo modelo atual; a escolha persiste.'
      }
    },
    {
      id: 'eff-d-quando',
      titulo: 'Quando ajustar',
      tipo: 'detalhe',
      paiId: 'ide-effort',
      posicao: { x: xDetalhe(coluna(6), 1, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-lightbulb',
        descricao:
          'Suba o nível para refatorações complexas, debugging difícil ou revisões de segurança. Baixe para consultas rápidas.'
      }
    },

    // ---- HARNESS: o que é ----
    {
      id: 'harness-conceito',
      titulo: 'O que é harness?',
      tipo: 'assunto',
      posicao: { x: coluna(7), y: LINHA_ASSUNTOS },
      subnos: ['harn-d-definicao', 'harn-d-loop'],
      conteudo: {
        icone: 'i-lucide-settings-2',
        ilustracao: 'motor-loop',
        subtitulo: 'O "motor" por trás do agente',
        descricao:
          'Harness é a camada que orquestra tudo em uma execução do agente: conversa, ferramentas, contexto, permissões e a conversa com os modelos.'
      }
    },
    {
      id: 'harn-d-definicao',
      titulo: 'Definição',
      tipo: 'detalhe',
      paiId: 'harness-conceito',
      posicao: { x: xDetalhe(coluna(7), 0, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-box',
        descricao:
          'É um processo independente que roda ao lado do seu código. Ele é o "lado do agente"; o cliente cuida de como você interage.'
      }
    },
    {
      id: 'harn-d-loop',
      titulo: 'Anatomia de um turn',
      tipo: 'detalhe',
      paiId: 'harness-conceito',
      posicao: { x: xDetalhe(coluna(7), 1, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-repeat',
        descricao:
          'Monta contexto, o modelo planeja, cada chamada de ferramenta é checada por permissões, ferramentas executam, resultados retornam e o loop repete.'
      }
    },

    // ---- HARNESS do Kiro ----
    {
      id: 'harness-kiro',
      titulo: 'Harness do Kiro',
      tipo: 'assunto',
      posicao: { x: coluna(8), y: LINHA_ASSUNTOS },
      subnos: ['hk-d-unificado', 'hk-d-acp', 'hk-d-onde'],
      conteudo: {
        icone: 'i-lucide-network',
        ilustracao: 'motor-portas',
        subtitulo: 'Um harness, muitas superfícies',
        descricao:
          'No centro está o harness unificado. IDE, CLI, Web e Mobile são apenas front-ends dele. Por isso uma regra ou configuração vale igual em todo lugar.'
      }
    },
    {
      id: 'hk-d-unificado',
      titulo: 'Comportamento igual',
      tipo: 'detalhe',
      paiId: 'harness-kiro',
      posicao: { x: xDetalhe(coluna(8), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-check-check',
        descricao:
          'A mesma permissão bloqueia a mesma operação no CLI e no IDE. O mesmo steering molda o comportamento em qualquer superfície.'
      }
    },
    {
      id: 'hk-d-acp',
      titulo: 'Protocolo ACP',
      tipo: 'detalhe',
      paiId: 'harness-kiro',
      posicao: { x: xDetalhe(coluna(8), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-plug',
        descricao:
          'Os clientes falam com o harness pelo Agent Client Protocol (ACP). Até editores compatíveis, como JetBrains e Zed, podem usar o Kiro como agente.'
      }
    },
    {
      id: 'hk-d-onde',
      titulo: 'Onde o agente roda',
      tipo: 'detalhe',
      paiId: 'harness-kiro',
      posicao: { x: xDetalhe(coluna(8), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-server',
        descricao:
          'IDE e CLI rodam na sua máquina; Web e Mobile rodam o mesmo harness em um sandbox na nuvem. Mesmo loop, mesmas regras.'
      }
    },

    // ---- .kiro global ----
    {
      id: 'kiro-global',
      titulo: 'Pasta .kiro global',
      tipo: 'assunto',
      posicao: { x: coluna(9), y: LINHA_ASSUNTOS },
      subnos: ['glob-d-local', 'glob-d-conteudo'],
      conteudo: {
        icone: 'i-lucide-house',
        ilustracao: 'casinha-usuario',
        subtitulo: '~/.kiro/ — viaja com você',
        descricao:
          'No seu diretório home. Guarda sua configuração pessoal, aplicada a todos os projetos locais na sua máquina.'
      }
    },
    {
      id: 'glob-d-local',
      titulo: 'Escopo do usuário',
      tipo: 'detalhe',
      paiId: 'kiro-global',
      posicao: { x: xDetalhe(coluna(9), 0, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-user',
        descricao:
          'Viaja com você (não com o repositório): agentes pessoais, skills, steering e settings valem em todos os seus projetos locais.'
      }
    },
    {
      id: 'glob-d-conteudo',
      titulo: 'Também para times',
      tipo: 'detalhe',
      paiId: 'kiro-global',
      posicao: { x: xDetalhe(coluna(9), 1, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-users',
        descricao:
          'Steering global pode ser distribuído por times (via MDM/políticas ou repositório central) para padronizar o comportamento do agente.'
      }
    },

    // ---- .kiro por projeto ----
    {
      id: 'kiro-projeto',
      titulo: 'Pasta .kiro por projeto',
      tipo: 'assunto',
      posicao: { x: coluna(10), y: LINHA_ASSUNTOS },
      subnos: ['proj-d-repo', 'proj-d-itens'],
      conteudo: {
        icone: 'i-lucide-folder-git-2',
        ilustracao: 'pasta-git',
        subtitulo: '.kiro/ — viaja com o repositório',
        descricao:
          'Fica no repositório. Todo mundo (e toda superfície) que abre o projeto recebe o mesmo steering, specs, agents, hooks e MCP servers.'
      }
    },
    {
      id: 'proj-d-repo',
      titulo: 'Consistência do time',
      tipo: 'detalhe',
      paiId: 'kiro-projeto',
      posicao: { x: xDetalhe(coluna(10), 0, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-git-merge',
        descricao:
          'Commitar .kiro/ dá a todos o mesmo comportamento do agente, seja no IDE, no terminal ou no navegador.'
      }
    },
    {
      id: 'proj-d-itens',
      titulo: 'O que mora aqui',
      tipo: 'detalhe',
      paiId: 'kiro-projeto',
      posicao: { x: xDetalhe(coluna(10), 1, 2), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-boxes',
        descricao:
          'Specs, Steering, Hooks, MCP, Skills, Powers, Checkpoints & rewind, Permissions e Custom Agents — detalhados a seguir.'
      }
    },

    // ---- Recurso: Specs ----
    {
      id: 'recurso-specs',
      titulo: 'Specs',
      tipo: 'assunto',
      posicao: { x: coluna(11), y: LINHA_ASSUNTOS },
      subnos: ['spec-d-tres', 'spec-d-fluxo', 'spec-d-paralelo'],
      conteudo: {
        icone: 'i-lucide-file-text',
        ilustracao: 'tres-documentos',
        subtitulo: 'Do requisito ao código, com rastreio',
        descricao:
          'Especificações estruturadas que transformam ideias em planos de implementação. Diferencial para quem já usou agentes: planejar antes de codar.'
      }
    },
    {
      id: 'spec-d-tres',
      titulo: 'Três arquivos',
      tipo: 'detalhe',
      paiId: 'recurso-specs',
      posicao: { x: xDetalhe(coluna(11), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-files',
        descricao:
          'requirements.md (histórias e critérios), design.md (arquitetura e diagramas) e tasks.md (tarefas rastreáveis).'
      }
    },
    {
      id: 'spec-d-fluxo',
      titulo: 'Três fases',
      tipo: 'detalhe',
      paiId: 'recurso-specs',
      posicao: { x: xDetalhe(coluna(11), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-workflow',
        descricao:
          'Requisitos → Design → Tarefas. Você revisa e aprova cada fase antes de a implementação começar.'
      }
    },
    {
      id: 'spec-d-paralelo',
      titulo: 'Execução paralela',
      tipo: 'detalhe',
      paiId: 'recurso-specs',
      posicao: { x: xDetalhe(coluna(11), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-split',
        descricao:
          'O Kiro monta um grafo de dependências e roda tarefas independentes em "ondas" concorrentes, reduzindo o tempo total.'
      }
    },

    // ---- Recurso: Steering ----
    {
      id: 'recurso-steering',
      titulo: 'Steering',
      tipo: 'assunto',
      posicao: { x: coluna(12), y: LINHA_ASSUNTOS },
      subnos: ['steer-d-oque', 'steer-d-inclusao', 'steer-d-escopo'],
      conteudo: {
        icone: 'i-lucide-compass',
        ilustracao: 'bussola',
        subtitulo: 'Contexto persistente do projeto',
        descricao:
          'Arquivos markdown que dão ao Kiro conhecimento permanente sobre padrões, arquitetura e convenções — sem repetir tudo a cada conversa.'
      }
    },
    {
      id: 'steer-d-oque',
      titulo: 'Arquivos base',
      tipo: 'detalhe',
      paiId: 'recurso-steering',
      posicao: { x: xDetalhe(coluna(12), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-file-cog',
        descricao:
          'product.md (o "porquê"), tech.md (stack) e structure.md (organização) formam a base de contexto em toda interação.'
      }
    },
    {
      id: 'steer-d-inclusao',
      titulo: 'Modos de inclusão',
      tipo: 'detalhe',
      paiId: 'recurso-steering',
      posicao: { x: xDetalhe(coluna(12), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-toggle-right',
        descricao:
          'always (sempre), fileMatch (por padrão de arquivo), manual (via #arquivo) e auto (quando o pedido casa com a descrição).'
      }
    },
    {
      id: 'steer-d-escopo',
      titulo: 'Global x workspace',
      tipo: 'detalhe',
      paiId: 'recurso-steering',
      posicao: { x: xDetalhe(coluna(12), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-scale',
        descricao:
          'Regras globais valem para tudo; regras do workspace têm prioridade em caso de conflito. Também suporta o padrão AGENTS.md.'
      }
    },

    // ---- Recurso: Hooks ----
    {
      id: 'recurso-hooks',
      titulo: 'Hooks',
      tipo: 'assunto',
      posicao: { x: coluna(13), y: LINHA_ASSUNTOS },
      subnos: ['hook-d-gatilhos', 'hook-d-acoes', 'hook-d-usos'],
      conteudo: {
        icone: 'i-lucide-zap',
        ilustracao: 'raio-engrenagem',
        subtitulo: 'Automação orientada a eventos',
        descricao:
          'Executam comandos ou prompts automaticamente quando algo acontece na sessão. Você define o gatilho e a ação; o Kiro cuida da execução.'
      }
    },
    {
      id: 'hook-d-gatilhos',
      titulo: 'Gatilhos',
      tipo: 'detalhe',
      paiId: 'recurso-hooks',
      posicao: { x: xDetalhe(coluna(13), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-bell',
        descricao:
          'PostFileSave, PreToolUse (pode bloquear), UserPromptSubmit, SessionStart, Stop, PreTaskExec, entre outros.'
      }
    },
    {
      id: 'hook-d-acoes',
      titulo: 'Ações',
      tipo: 'detalhe',
      paiId: 'recurso-hooks',
      posicao: { x: xDetalhe(coluna(13), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-terminal',
        descricao:
          'command (roda um comando shell) ou agent (injeta um prompt no agente). Definidos em JSON em .kiro/hooks/.'
      }
    },
    {
      id: 'hook-d-usos',
      titulo: 'Casos de uso',
      tipo: 'detalhe',
      paiId: 'recurso-hooks',
      posicao: { x: xDetalhe(coluna(13), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-wand-2',
        descricao:
          'Rodar linter/formatter após edições, gerar testes e docs, ou barrar operações perigosas antes de executarem.'
      }
    },

    // ---- Recurso: MCP ----
    {
      id: 'recurso-mcp',
      titulo: 'MCP',
      tipo: 'assunto',
      posicao: { x: coluna(14), y: LINHA_ASSUNTOS },
      subnos: ['mcp-d-oque', 'mcp-d-config', 'mcp-d-usos'],
      conteudo: {
        icone: 'i-lucide-cable',
        ilustracao: 'plugue-servidores',
        subtitulo: 'Model Context Protocol',
        descricao:
          'Conecta o Kiro a servidores especializados que fornecem ferramentas, prompts e recursos extras — estendendo o que o agente sabe fazer.'
      }
    },
    {
      id: 'mcp-d-oque',
      titulo: 'O que é',
      tipo: 'detalhe',
      paiId: 'recurso-mcp',
      posicao: { x: xDetalhe(coluna(14), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-info',
        descricao:
          'Protocolo aberto para o agente falar com servidores externos: bases de conhecimento, APIs e ferramentas de domínio específico.'
      }
    },
    {
      id: 'mcp-d-config',
      titulo: 'Configuração',
      tipo: 'detalhe',
      paiId: 'recurso-mcp',
      posicao: { x: xDetalhe(coluna(14), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-file-json',
        descricao:
          'Servidores locais (stdio) ou remotos (HTTP/SSE), definidos em mcp.json com escopo de workspace ou de usuário.'
      }
    },
    {
      id: 'mcp-d-usos',
      titulo: 'Segurança',
      tipo: 'detalhe',
      paiId: 'recurso-mcp',
      posicao: { x: xDetalhe(coluna(14), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-lock',
        descricao:
          'Instale apenas servidores confiáveis. Links de instalação mostram o comando antes de gravar qualquer coisa na sua configuração.'
      }
    },

    // ---- Recurso: Skills ----
    {
      id: 'recurso-skills',
      titulo: 'Skills',
      tipo: 'assunto',
      posicao: { x: coluna(15), y: LINHA_ASSUNTOS },
      subnos: ['skill-d-oque', 'skill-d-disclosure', 'skill-d-formato'],
      conteudo: {
        icone: 'i-lucide-graduation-cap',
        ilustracao: 'mochila-instrucoes',
        subtitulo: 'Pacotes de instruções portáteis',
        descricao:
          'Seguem o padrão aberto Agent Skills: instruções, scripts e templates reutilizáveis que o Kiro ativa quando são relevantes à tarefa.'
      }
    },
    {
      id: 'skill-d-oque',
      titulo: 'Portáteis',
      tipo: 'detalhe',
      paiId: 'recurso-skills',
      posicao: { x: xDetalhe(coluna(15), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-package',
        descricao:
          'Importe skills da comunidade ou de outras ferramentas compatíveis, e compartilhe as suas pelo ecossistema.'
      }
    },
    {
      id: 'skill-d-disclosure',
      titulo: 'Divulgação progressiva',
      tipo: 'detalhe',
      paiId: 'recurso-skills',
      posicao: { x: xDetalhe(coluna(15), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-layers-2',
        descricao:
          'No início, o Kiro carrega só nome e descrição. Quando seu pedido casa, carrega as instruções completas — mantém o contexto enxuto.'
      }
    },
    {
      id: 'skill-d-formato',
      titulo: 'Formato',
      tipo: 'detalhe',
      paiId: 'recurso-skills',
      posicao: { x: xDetalhe(coluna(15), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-folder',
        descricao:
          'Uma pasta com SKILL.md (frontmatter + instruções) e, opcionalmente, scripts/, references/ e assets/.'
      }
    },

    // ---- Recurso: Powers ----
    {
      id: 'recurso-powers',
      titulo: 'Powers',
      tipo: 'assunto',
      posicao: { x: coluna(16), y: LINHA_ASSUNTOS },
      subnos: ['power-d-problema', 'power-d-dinamico', 'power-d-conteudo'],
      conteudo: {
        icone: 'i-lucide-plug-zap',
        ilustracao: 'plugue-faisca',
        subtitulo: 'MCP + conhecimento, sob demanda',
        descricao:
          'Empacotam servidores MCP com skills e boas práticas. Ao mencionar palavras-chave, o Kiro carrega a power certa automaticamente.'
      }
    },
    {
      id: 'power-d-problema',
      titulo: 'O problema',
      tipo: 'detalhe',
      paiId: 'recurso-powers',
      posicao: { x: xDetalhe(coluna(16), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-alert-triangle',
        descricao:
          'Conectar muitos MCPs de uma vez enche o contexto de ferramentas e deixa o agente mais lento e menos preciso.'
      }
    },
    {
      id: 'power-d-dinamico',
      titulo: 'Carregamento dinâmico',
      tipo: 'detalhe',
      paiId: 'recurso-powers',
      posicao: { x: xDetalhe(coluna(16), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-toggle-left',
        descricao:
          'A power ativa por contexto: entra a relevante à tarefa e sai quando você muda de assunto — respostas rápidas e focadas.'
      }
    },
    {
      id: 'power-d-conteudo',
      titulo: 'Ecossistema aberto',
      tipo: 'detalhe',
      paiId: 'recurso-powers',
      posicao: { x: xDetalhe(coluna(16), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-store',
        descricao:
          'Seguem o padrão Agent Plugins. Instale com um clique da galeria (Stripe, Supabase, Figma, Datadog...) ou crie a sua.'
      }
    },

    // ---- Recurso: Checkpoints e rewind ----
    {
      id: 'recurso-checkpoints',
      titulo: 'Checkpoints e rewind',
      tipo: 'assunto',
      posicao: { x: coluna(17), y: LINHA_ASSUNTOS },
      subnos: ['chk-d-checkpoint', 'chk-d-rewind', 'chk-d-rede'],
      conteudo: {
        icone: 'i-lucide-history',
        ilustracao: 'linha-tempo-rewind',
        subtitulo: 'Volte atrás com segurança',
        descricao:
          'Duas formas de recuar: checkpoints restauram os arquivos a um ponto anterior; rewind bifurca a conversa em um turn anterior. Ótimo para os céticos.'
      }
    },
    {
      id: 'chk-d-checkpoint',
      titulo: 'Checkpoints',
      tipo: 'detalhe',
      paiId: 'recurso-checkpoints',
      posicao: { x: xDetalhe(coluna(17), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-save',
        descricao:
          'Cada prompt cria um checkpoint. Restaurar volta código e contexto àquele ponto — uma rede de segurança para explorar sem medo.'
      }
    },
    {
      id: 'chk-d-rewind',
      titulo: 'Rewind',
      tipo: 'detalhe',
      paiId: 'recurso-checkpoints',
      posicao: { x: xDetalhe(coluna(17), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-git-branch',
        descricao:
          'Bifurca a conversa em um turn anterior numa nova sessão, sem tocar nos arquivos. Útil para testar outro caminho (comando /rewind no CLI).'
      }
    },
    {
      id: 'chk-d-rede',
      titulo: 'Reverter último turn',
      tipo: 'detalhe',
      paiId: 'recurso-checkpoints',
      posicao: { x: xDetalhe(coluna(17), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-undo-2',
        descricao:
          'No IDE, um botão "Revert" desfaz as mudanças de arquivo do último turn do agente. Você sempre pode voltar.'
      }
    },

    // ---- Recurso: Permissions ----
    {
      id: 'recurso-permissions',
      titulo: 'Permissions',
      tipo: 'assunto',
      posicao: { x: coluna(18), y: LINHA_ASSUNTOS },
      subnos: ['perm-d-capacidades', 'perm-d-prioridade', 'perm-d-escopos'],
      conteudo: {
        icone: 'i-lucide-shield',
        ilustracao: 'escudo-semaforo',
        subtitulo: 'Controle do que o agente pode fazer',
        descricao:
          'Sistema baseado em capacidades: você define regras por capacidade, com padrões de correspondência e efeitos explícitos. Nada de "confiar em tudo".'
      }
    },
    {
      id: 'perm-d-capacidades',
      titulo: 'Capacidades',
      tipo: 'detalhe',
      paiId: 'recurso-permissions',
      posicao: { x: xDetalhe(coluna(18), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-key',
        descricao:
          'fs_read, fs_write, shell, web_fetch, mcp, subagent, skill, power e outras — cada uma com regras próprias e padrões (globs).'
      }
    },
    {
      id: 'perm-d-prioridade',
      titulo: 'deny > ask > allow',
      tipo: 'detalhe',
      paiId: 'recurso-permissions',
      posicao: { x: xDetalhe(coluna(18), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-ban',
        descricao:
          'Efeitos: deny (bloqueia), ask (pergunta) e allow (segue). O mais restritivo vence: um deny sempre ganha, venha de onde vier.'
      }
    },
    {
      id: 'perm-d-escopos',
      titulo: 'Escopos e confiança',
      tipo: 'detalhe',
      paiId: 'recurso-permissions',
      posicao: { x: xDetalhe(coluna(18), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-folder-lock',
        descricao:
          'Regras de workspace ficam fora do repositório (por usuário): um repo clonado não pode conceder confiança a si mesmo.'
      }
    },

    // ---- Recurso: Custom Agents ----
    {
      id: 'recurso-agents',
      titulo: 'Custom Agents',
      tipo: 'assunto',
      posicao: { x: coluna(19), y: LINHA_ASSUNTOS },
      subnos: ['ag-d-oque', 'ag-d-config', 'ag-d-sub'],
      conteudo: {
        icone: 'i-lucide-users-round',
        ilustracao: 'robos-especialistas',
        subtitulo: 'Agentes especializados',
        descricao:
          'Perfis de agente para fluxos específicos: quais ferramentas ele acessa, quais permissões tem e qual contexto carrega.'
      }
    },
    {
      id: 'ag-d-oque',
      titulo: 'Para que servem',
      tipo: 'detalhe',
      paiId: 'recurso-agents',
      posicao: { x: xDetalhe(coluna(19), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-target',
        descricao:
          'Pré-aprovar ferramentas confiáveis, limitar acesso, incluir contexto relevante e reduzir interrupções por permissão.'
      }
    },
    {
      id: 'ag-d-config',
      titulo: 'Configuração',
      tipo: 'detalhe',
      paiId: 'recurso-agents',
      posicao: { x: xDetalhe(coluna(19), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-file-code-2',
        descricao:
          'Em JSON ou Markdown, em .kiro/agents/ (projeto) ou ~/.kiro/agents/ (global): tools, permissions, resources, model e prompt.'
      }
    },
    {
      id: 'ag-d-sub',
      titulo: 'Sub-agentes',
      tipo: 'detalhe',
      paiId: 'recurso-agents',
      posicao: { x: xDetalhe(coluna(19), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-git-fork',
        descricao:
          'Delegue trabalho focado a agentes que rodam em paralelo, cada um com seu escopo e ferramentas.'
      }
    },

    // ---- IDE: Language Support ----
    {
      id: 'ide-linguagens',
      titulo: 'Suporte a linguagens',
      tipo: 'assunto',
      posicao: { x: coluna(20), y: LINHA_ASSUNTOS },
      subnos: ['lang-d-ts', 'lang-d-py', 'lang-d-java'],
      conteudo: {
        icone: 'i-lucide-file-terminal',
        ilustracao: 'simbolos-linguagens',
        subtitulo: 'Assistência especializada por linguagem',
        descricao:
          'Guias com boas práticas para escrever, depurar e manter código com o Kiro em diferentes linguagens e frameworks.'
      }
    },
    {
      id: 'lang-d-ts',
      titulo: 'TypeScript / JavaScript',
      tipo: 'detalhe',
      paiId: 'ide-linguagens',
      posicao: { x: xDetalhe(coluna(20), 0, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-braces',
        descricao:
          'Boas práticas para desenvolvimento TypeScript e JavaScript com o Kiro.'
      }
    },
    {
      id: 'lang-d-py',
      titulo: 'Python',
      tipo: 'detalhe',
      paiId: 'ide-linguagens',
      posicao: { x: xDetalhe(coluna(20), 1, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-file-code',
        descricao:
          'Otimize seu fluxo em Python com a assistência inteligente do Kiro.'
      }
    },
    {
      id: 'lang-d-java',
      titulo: 'Java',
      tipo: 'detalhe',
      paiId: 'ide-linguagens',
      posicao: { x: xDetalhe(coluna(20), 2, 3), y: LINHA_DETALHES },
      conteudo: {
        icone: 'i-lucide-coffee',
        descricao:
          'Desenvolvimento Java corporativo turbinado por recursos com IA.'
      }
    },

    // ======================= 5. DEMAIS SUPERFÍCIES (breve) =======================
    {
      id: 'superficies',
      titulo: 'Demais opções',
      tipo: 'overview',
      posicao: { x: coluna(21), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-panels-top-left',
        ilustracao: 'agente-portas',
        subtitulo: 'só para você saber que existem',
        descricao:
          'O mesmo agente, em outras portas de entrada. Aqui, apenas os destaques de cada uma.'
      }
    },
    {
      id: 'superficie-cli',
      titulo: 'Kiro CLI',
      tipo: 'assunto',
      posicao: { x: coluna(22), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-terminal-square',
        ilustracao: 'terminal',
        subtitulo: 'O agente no seu terminal',
        topicos: [
          'Chat interativo com TUI rica (syntax highlighting, painéis, temas)',
          'Modo headless para CI/CD com autenticação por API key',
          'Autocomplete, voice mode e gestão de sessões pelo shell',
          'Mesmas capacidades: steering, hooks, MCP, agents, permissions'
        ]
      }
    },
    {
      id: 'superficie-web',
      titulo: 'Kiro Web',
      tipo: 'assunto',
      posicao: { x: coluna(23), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-globe',
        ilustracao: 'navegador-pr',
        subtitulo: 'Agente no navegador (Preview)',
        topicos: [
          'Sem setup: roda em sandbox na nuvem em app.kiro.dev',
          'Entrega o trabalho como pull request (GitHub/GitLab)',
          'Modo autônomo: planeja, implementa e abre o PR sozinho',
          'Automações agendadas (cron) e memória do que aprende com você'
        ]
      }
    },
    {
      id: 'superficie-mobile',
      titulo: 'Kiro Mobile',
      tipo: 'assunto',
      posicao: { x: coluna(24), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-smartphone',
        ilustracao: 'celular-sessao',
        subtitulo: 'Kiro no bolso (iOS, early access)',
        topicos: [
          'App iOS em early access via TestFlight',
          'Inicie e conduza sessões na nuvem pelo celular',
          'Sessões e preferências sincronizam com o Kiro Web',
          'Comece no Web ou IDE e acompanhe pelo telefone'
        ]
      }
    },
    {
      id: 'superficie-crew',
      titulo: 'Kiro Crew',
      tipo: 'assunto',
      posicao: { x: coluna(25), y: LINHA_ASSUNTOS },
      conteudo: {
        icone: 'i-lucide-users',
        ilustracao: 'equipe-robos',
        subtitulo: 'Agente pessoal que roda no seu hardware',
        topicos: [
          'Open-source, persistente, auto-aprendente e auto-evolutivo',
          'Tarefas multi-etapa sem supervisão e jobs recorrentes agendados',
          'Mac app, dashboard web, CLI e canais (Slack, Discord, Telegram...)',
          'Memória, lições e skills visíveis e editáveis, sob seu controle'
        ]
      }
    },

    // ======================= ENCERRAMENTO =======================
    {
      id: 'encerramento',
      titulo: 'Kiro',
      tipo: 'capa',
      posicao: { x: coluna(26), y: LINHA_ASSUNTOS },
      conteudo: {
        logo: '/kiro-fantasminha.svg',
        ilustracao: 'fantasminha-portas',
        subtitulo: 'Um agente muitas opções',
        descricao:
          'Kiro coloca você no controle: specs para planejar, steering para padronizar, permissions para autorizar e checkpoints para voltar atrás.'
      }
    }
  ],
  arestas: [
    // Fluxo principal entre os assuntos (na ordem de navegação).
    { id: 'e-capa-agenda', origem: 'capa', destino: 'agenda', animada: true },
    { id: 'e-agenda-overview', origem: 'agenda', destino: 'overview', animada: true },
    { id: 'e-overview-ide', origem: 'overview', destino: 'ide', animada: true },
    { id: 'e-ide-historia', origem: 'ide', destino: 'ide-historia', animada: true },
    { id: 'e-historia-modelos', origem: 'ide-historia', destino: 'ide-modelos', animada: true },
    { id: 'e-modelos-effort', origem: 'ide-modelos', destino: 'ide-effort', animada: true },
    { id: 'e-effort-harnessc', origem: 'ide-effort', destino: 'harness-conceito', animada: true },
    { id: 'e-harnessc-harnessk', origem: 'harness-conceito', destino: 'harness-kiro', animada: true },
    { id: 'e-harnessk-global', origem: 'harness-kiro', destino: 'kiro-global', animada: true },
    { id: 'e-global-projeto', origem: 'kiro-global', destino: 'kiro-projeto', animada: true },
    { id: 'e-projeto-specs', origem: 'kiro-projeto', destino: 'recurso-specs', animada: true },
    { id: 'e-specs-steering', origem: 'recurso-specs', destino: 'recurso-steering', animada: true },
    { id: 'e-steering-hooks', origem: 'recurso-steering', destino: 'recurso-hooks', animada: true },
    { id: 'e-hooks-mcp', origem: 'recurso-hooks', destino: 'recurso-mcp', animada: true },
    { id: 'e-mcp-skills', origem: 'recurso-mcp', destino: 'recurso-skills', animada: true },
    { id: 'e-skills-powers', origem: 'recurso-skills', destino: 'recurso-powers', animada: true },
    { id: 'e-powers-checkpoints', origem: 'recurso-powers', destino: 'recurso-checkpoints', animada: true },
    { id: 'e-checkpoints-permissions', origem: 'recurso-checkpoints', destino: 'recurso-permissions', animada: true },
    { id: 'e-permissions-agents', origem: 'recurso-permissions', destino: 'recurso-agents', animada: true },
    { id: 'e-agents-linguagens', origem: 'recurso-agents', destino: 'ide-linguagens', animada: true },
    { id: 'e-linguagens-superficies', origem: 'ide-linguagens', destino: 'superficies', animada: true },
    { id: 'e-superficies-cli', origem: 'superficies', destino: 'superficie-cli', animada: true },
    { id: 'e-cli-web', origem: 'superficie-cli', destino: 'superficie-web', animada: true },
    { id: 'e-web-mobile', origem: 'superficie-web', destino: 'superficie-mobile', animada: true },
    { id: 'e-mobile-crew', origem: 'superficie-mobile', destino: 'superficie-crew', animada: true },
    { id: 'e-crew-encerramento', origem: 'superficie-crew', destino: 'encerramento', animada: true },

    // Arestas assunto -> detalhes (aparecem só quando o assunto está em foco).
    { id: 'd-ide-1', origem: 'ide', destino: 'ide-d-editor' },
    { id: 'd-ide-2', origem: 'ide', destino: 'ide-d-specs' },
    { id: 'd-ide-3', origem: 'ide', destino: 'ide-d-chat' },
    { id: 'd-ide-4', origem: 'ide', destino: 'ide-d-controle' },

    { id: 'd-hist-1', origem: 'ide-historia', destino: 'hist-d-base' },
    { id: 'd-hist-2', origem: 'ide-historia', destino: 'hist-d-agentic' },

    { id: 'd-mod-1', origem: 'ide-modelos', destino: 'mod-d-catalogo' },
    { id: 'd-mod-2', origem: 'ide-modelos', destino: 'mod-d-auto' },
    { id: 'd-mod-3', origem: 'ide-modelos', destino: 'mod-d-custo' },

    { id: 'd-eff-1', origem: 'ide-effort', destino: 'eff-d-niveis' },
    { id: 'd-eff-2', origem: 'ide-effort', destino: 'eff-d-quando' },

    { id: 'd-harnc-1', origem: 'harness-conceito', destino: 'harn-d-definicao' },
    { id: 'd-harnc-2', origem: 'harness-conceito', destino: 'harn-d-loop' },

    { id: 'd-harnk-1', origem: 'harness-kiro', destino: 'hk-d-unificado' },
    { id: 'd-harnk-2', origem: 'harness-kiro', destino: 'hk-d-acp' },
    { id: 'd-harnk-3', origem: 'harness-kiro', destino: 'hk-d-onde' },

    { id: 'd-glob-1', origem: 'kiro-global', destino: 'glob-d-local' },
    { id: 'd-glob-2', origem: 'kiro-global', destino: 'glob-d-conteudo' },

    { id: 'd-proj-1', origem: 'kiro-projeto', destino: 'proj-d-repo' },
    { id: 'd-proj-2', origem: 'kiro-projeto', destino: 'proj-d-itens' },

    { id: 'd-spec-1', origem: 'recurso-specs', destino: 'spec-d-tres' },
    { id: 'd-spec-2', origem: 'recurso-specs', destino: 'spec-d-fluxo' },
    { id: 'd-spec-3', origem: 'recurso-specs', destino: 'spec-d-paralelo' },

    { id: 'd-steer-1', origem: 'recurso-steering', destino: 'steer-d-oque' },
    { id: 'd-steer-2', origem: 'recurso-steering', destino: 'steer-d-inclusao' },
    { id: 'd-steer-3', origem: 'recurso-steering', destino: 'steer-d-escopo' },

    { id: 'd-hook-1', origem: 'recurso-hooks', destino: 'hook-d-gatilhos' },
    { id: 'd-hook-2', origem: 'recurso-hooks', destino: 'hook-d-acoes' },
    { id: 'd-hook-3', origem: 'recurso-hooks', destino: 'hook-d-usos' },

    { id: 'd-mcp-1', origem: 'recurso-mcp', destino: 'mcp-d-oque' },
    { id: 'd-mcp-2', origem: 'recurso-mcp', destino: 'mcp-d-config' },
    { id: 'd-mcp-3', origem: 'recurso-mcp', destino: 'mcp-d-usos' },

    { id: 'd-skill-1', origem: 'recurso-skills', destino: 'skill-d-oque' },
    { id: 'd-skill-2', origem: 'recurso-skills', destino: 'skill-d-disclosure' },
    { id: 'd-skill-3', origem: 'recurso-skills', destino: 'skill-d-formato' },

    { id: 'd-power-1', origem: 'recurso-powers', destino: 'power-d-problema' },
    { id: 'd-power-2', origem: 'recurso-powers', destino: 'power-d-dinamico' },
    { id: 'd-power-3', origem: 'recurso-powers', destino: 'power-d-conteudo' },

    { id: 'd-chk-1', origem: 'recurso-checkpoints', destino: 'chk-d-checkpoint' },
    { id: 'd-chk-2', origem: 'recurso-checkpoints', destino: 'chk-d-rewind' },
    { id: 'd-chk-3', origem: 'recurso-checkpoints', destino: 'chk-d-rede' },

    { id: 'd-perm-1', origem: 'recurso-permissions', destino: 'perm-d-capacidades' },
    { id: 'd-perm-2', origem: 'recurso-permissions', destino: 'perm-d-prioridade' },
    { id: 'd-perm-3', origem: 'recurso-permissions', destino: 'perm-d-escopos' },

    { id: 'd-ag-1', origem: 'recurso-agents', destino: 'ag-d-oque' },
    { id: 'd-ag-2', origem: 'recurso-agents', destino: 'ag-d-config' },
    { id: 'd-ag-3', origem: 'recurso-agents', destino: 'ag-d-sub' },

    { id: 'd-lang-1', origem: 'ide-linguagens', destino: 'lang-d-ts' },
    { id: 'd-lang-2', origem: 'ide-linguagens', destino: 'lang-d-py' },
    { id: 'd-lang-3', origem: 'ide-linguagens', destino: 'lang-d-java' }
  ]
}
