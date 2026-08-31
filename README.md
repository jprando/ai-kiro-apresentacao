# Apresentação Kiro IDE

Apresentação interativa, no estilo **infográfico animado**, sobre os recursos do
**Kiro IDE**. Em vez de slides tradicionais, cada tema é um **nó de um grafo**
(Vue Flow): a câmera desliza entre os nós e os assuntos revelam subnós de
detalhamento conforme você navega.

O conteúdo tem foco aprofundado no Kiro IDE (história, modelos, reasoning effort,
harness e os recursos do `.kiro`: Specs, Steering, Hooks, MCP, Skills, Powers,
Checkpoints, Permissions e Custom Agents) e menciona de forma breve as demais
superfícies (CLI, Web, Mobile e Crew).

## Stack

- **[Nuxt 4](https://nuxt.com/)** — framework Vue full-stack (usado aqui em modo
  100% client-side / estático).
- **[Nuxt UI](https://ui.nuxt.com/)** — componentes, ícones (`@nuxt/icon`,
  coleção Lucide) e fontes (`@nuxt/fonts`).
- **[Vue Flow](https://vueflow.dev/)** — grafo interativo que serve de palco da
  apresentação (nós = assuntos, subnós = detalhes), renderizado apenas no cliente.

## Pré-requisitos

- **Node.js 22** (recomendado gerenciar via [nvm](https://github.com/nvm-sh/nvm)).
- **pnpm** como gerenciador de pacotes.

```bash
# Selecionar o Node 22 (exemplo com nvm)
nvm use 22
```

## Comandos

Instalar as dependências:

```bash
pnpm install
```

Rodar em desenvolvimento (http://localhost:3000):

```bash
pnpm dev
```

Gerar o build de produção:

```bash
pnpm build
```

Opcional — pré-renderizar a versão estática:

```bash
pnpm generate
```

## Como navegar

- Setas **←** / **→** (ou **↑** / **↓**, **PageUp** / **PageDown**, **Espaço**):
  slide anterior / próximo.
- **Home** / **End**: primeiro / último slide.
- **Esc**: enquadra todo o grafo (visão geral).
- Também é possível usar os botões e os **pontos de progresso** no rodapé.

## Arquitetura

A explicação detalhada da arquitetura (estrutura de nós/subnós, composable de
navegação, integração Vue Flow client-only e decisões de custo-zero), com
diagrama, está em [`docs/apresentacao.md`](./docs/apresentacao.md).
