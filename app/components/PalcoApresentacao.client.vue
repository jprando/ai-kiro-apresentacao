<script setup lang="ts">
// Palco da apresentação: renderiza o <VueFlow> com Background, Controls e
// MiniMap, alimentado pelos nós/arestas do composable usarApresentacao.
//
// Este componente é .client (Vue Flow acessa window/document) e deve ser usado
// dentro de <ClientOnly> na página. Registra a navegação por teclado no
// onMounted e a remove no onUnmounted — tudo client-side, sem tráfego de rede
// (steering CUSTO-ZERO: nenhum setInterval/polling/fetch periódico).
import { VueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { markRaw } from 'vue'

import NoCapa from '~/components/nos/NoCapa.client.vue'
import NoAssunto from '~/components/nos/NoAssunto.client.vue'
import NoDetalhe from '~/components/nos/NoDetalhe.client.vue'

const {
  nos,
  arestas,
  slideAtual,
  wallpaperAtual,
  indiceAtual,
  ordem,
  proximo,
  anterior,
  irPara,
  irParaIndice,
  irParaInicio,
  irParaFim,
  enquadrarTudo
} = usarApresentacao()

/**
 * Chave de transição do wallpaper: muda quando a imagem/chave do fundo muda,
 * disparando o crossfade curto. Slides que compartilham o mesmo wallpaper
 * (ex.: detalhes que herdam a imagem do pai) NÃO reanimam o fundo.
 */
const chaveWallpaper = computed(() => {
  const w = wallpaperAtual.value
  if (!w) return 'vazio'
  return w.tipo === 'imagem' ? `img:${w.url}` : `svg:${w.chave}`
})

/**
 * Prefetch LEVE (custo-zero) só dos vizinhos imediatos: quando o próximo/anterior
 * slide tem PNG próprio, adiciona <link rel="prefetch"> para o navegador buscar
 * a imagem em ociosidade. Não pré-carrega os 17 de uma vez; SVGs não precisam.
 */
const prefetchVizinhos = computed(() => {
  const alvos = [indiceAtual.value - 1, indiceAtual.value + 1]
  const urls = new Set<string>()
  for (const indice of alvos) {
    const id = ordem.value[indice]
    if (!id) continue
    const url = urlImagemSlide(id)
    if (url) urls.add(url)
  }
  return [...urls].map((href) => ({ rel: 'prefetch', as: 'image', href }))
})

useHead({
  link: prefetchVizinhos
})

/** Percentual de progresso da apresentação (para a barra do topo). */
const progresso = computed(() => {
  const total = ordem.value.length
  if (total <= 1) return 100
  return (indiceAtual.value / (total - 1)) * 100
})

// Tipos de nó customizados registrados no Vue Flow. markRaw evita que o Vue
// torne os componentes reativos desnecessariamente.
// 'capa', 'agenda' e 'overview' compartilham o mesmo componente de abertura.
const tiposDeNo = {
  capa: markRaw(NoCapa),
  agenda: markRaw(NoCapa),
  overview: markRaw(NoCapa),
  assunto: markRaw(NoAssunto),
  detalhe: markRaw(NoDetalhe)
}

/**
 * Trata a navegação por teclado:
 * - setas direita/baixo, PageDown, Espaço: próximo slide
 * - setas esquerda/cima, PageUp: slide anterior
 * - Home / End: primeiro / último slide
 * - Esc: enquadra todo o grafo (visão geral)
 */
function aoPressionarTecla(evento: KeyboardEvent) {
  switch (evento.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case 'PageDown':
    case ' ':
      evento.preventDefault()
      proximo()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
      evento.preventDefault()
      anterior()
      break
    case 'Home':
      evento.preventDefault()
      irParaInicio()
      break
    case 'End':
      evento.preventDefault()
      irParaFim()
      break
    case 'Escape':
      evento.preventDefault()
      enquadrarTudo()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', aoPressionarTecla)
})

onUnmounted(() => {
  window.removeEventListener('keydown', aoPressionarTecla)
})

// Enquadra o slide atual assim que o Vue Flow terminar de montar os nós.
function aoInicializarPalco() {
  const id = ordem.value[indiceAtual.value]
  if (id) {
    irPara(id)
  }
}
</script>

<template>
  <div class="palco">
    <!--
      Wallpaper do palco: a "big image" do slide em foco, ATRÁS do Vue Flow.
      É decorativo (aria-hidden, pointer-events:none). O crossfade curto na
      troca de slide é feito por <Transition> com :key = chaveWallpaper.
    -->
    <div class="palco-wallpaper-camada" aria-hidden="true">
      <Transition name="wallpaper-fade" mode="out-in">
        <div :key="chaveWallpaper" class="palco-wallpaper">
          <div
            v-if="wallpaperAtual?.tipo === 'imagem'"
            class="palco-wallpaper-imagem"
            :style="{ backgroundImage: `url('${wallpaperAtual.url}')` }"
          />
          <div
            v-else-if="wallpaperAtual?.tipo === 'svg'"
            class="palco-wallpaper-svg"
            :class="`camada-${wallpaperAtual.camada}`"
          >
            <IlustracaoFundo
              :chave="wallpaperAtual.chave"
              :camada="wallpaperAtual.camada"
              modo="wallpaper"
            />
          </div>
        </div>
      </Transition>
      <!-- Overlay de legibilidade NO PALCO (não no card): escurece + vinheta. -->
      <div class="palco-wallpaper-overlay" />
    </div>

    <VueFlow
      id="palco-apresentacao"
      :nodes="nos"
      :edges="arestas"
      :node-types="tiposDeNo"
      :nodes-draggable="false"
      :edges-updatable="false"
      :zoom-on-double-click="false"
      fit-view-on-init
      class="palco-fluxo"
      @pane-ready="aoInicializarPalco"
    >
      <Background :gap="26" pattern-color="#26304d" />
      <Controls position="bottom-left" />
      <!-- <MiniMap pannable zoomable /> -->
    </VueFlow>

    <!-- Barra de progresso fina no topo (slide atual sobre o total). -->
    <div class="palco-progresso" aria-hidden="true">
      <div class="palco-progresso-preenchido" :style="{ width: progresso + '%' }" />
    </div>

    <!-- Título do slide atual + contador, no topo. -->
    <div class="palco-cabecalho">
      <span class="palco-cabecalho-titulo">{{ slideAtual?.titulo ?? '' }}</span>
      <span class="palco-cabecalho-contador">
        slide {{ indiceAtual + 1 }} de {{ ordem.length }}
      </span>
    </div>

    <!-- Dica de navegação por teclado, discreta, no canto. -->
    <div class="palco-dica" role="note">
      <UIcon name="i-lucide-keyboard" class="palco-dica-icone" />
      <span>Use as setas <kbd>←</kbd> <kbd>→</kbd> para navegar</span>
    </div>

    <!-- Barra de controles de navegação (client-side). -->
    <div class="palco-controles">
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="soft"
        aria-label="Slide anterior"
        @click="anterior"
      />

      <!-- Indicador em pontos: um por slide, o atual em destaque. -->
      <div class="palco-pontos" role="tablist" aria-label="Progresso da apresentação">
        <button
          v-for="(id, indice) in ordem"
          :key="id"
          type="button"
          class="palco-ponto"
          :class="{ 'palco-ponto--atual': indice === indiceAtual }"
          :aria-label="`Ir para o slide ${indice + 1}`"
          :aria-selected="indice === indiceAtual"
          @click="irParaIndice(indice)"
        />
      </div>

      <UButton
        icon="i-lucide-chevron-right"
        color="neutral"
        variant="soft"
        aria-label="Próximo slide"
        @click="proximo"
      />
      <UButton
        icon="i-lucide-maximize"
        color="neutral"
        variant="ghost"
        aria-label="Visão geral"
        @click="enquadrarTudo"
      />
    </div>
  </div>
</template>

<style scoped>
.palco {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* Fundo escuro em gradiente, base do infográfico. */
  background:
    radial-gradient(80% 60% at 50% 0%, #1a2340, transparent 70%),
    linear-gradient(180deg, var(--palco-fundo-1, #0b1020), var(--palco-fundo-2, #131a30));
  font-family: var(--fonte-texto);
}

.palco-fluxo {
  position: relative;
  /* Acima do wallpaper (z-index:0), abaixo dos overlays de UI (z-index:10). */
  z-index: 1;
  width: 100%;
  height: 100%;
  background: transparent;
}

/*
  Camada de wallpaper: ocupa todo o palco, ATRÁS do Vue Flow, ACIMA do
  gradiente base do .palco. Decorativa (aria-hidden + pointer-events:none).
*/
.palco-wallpaper-camada {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.palco-wallpaper {
  position: absolute;
  inset: 0;
}

/* PNG do slide: cobre o palco, centralizado (cover). */
.palco-wallpaper-imagem {
  position: absolute;
  inset: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  /* Esmaece levemente a imagem para os cards de detalhe respirarem melhor. */
  opacity: 0.9;
  filter: brightness(0.92) saturate(0.95);
}

/* SVG conceitual grande: contêiner que fixa --cor/--cor-forte via camada. */
.palco-wallpaper-svg {
  position: absolute;
  inset: 0;
}

/*
  Overlay de legibilidade do PALCO: escurecimento + vinheta radial para os
  cartões (primeiro plano) permanecerem legíveis sobre o wallpaper (ambiente).
  Fica ACIMA do wallpaper mas ABAIXO do Vue Flow.
*/
.palco-wallpaper-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 50% 45%, rgba(11, 16, 32, 0.42), rgba(11, 16, 32, 0.88) 90%),
    linear-gradient(180deg, rgba(11, 16, 32, 0.52), rgba(19, 26, 48, 0.66));
}

/* Crossfade curto do wallpaper na troca de slide (custo-zero: pontual). */
.wallpaper-fade-enter-active,
.wallpaper-fade-leave-active {
  transition: opacity 0.5s ease;
}

.wallpaper-fade-enter-from,
.wallpaper-fade-leave-to {
  opacity: 0;
}

/* Acessibilidade: sem crossfade sob prefers-reduced-motion (troca instantânea). */
@media (prefers-reduced-motion: reduce) {
  .wallpaper-fade-enter-active,
  .wallpaper-fade-leave-active {
    transition: none;
  }
}

/* Barra de progresso fina no topo. */
.palco-progresso {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.08);
}

.palco-progresso-preenchido {
  height: 100%;
  background: linear-gradient(90deg, var(--camada-abertura, #8b7bf0), var(--camada-ide, #38bdf8));
  border-radius: 0 3px 3px 0;
  transition: width 0.5s ease;
}

/* Cabeçalho: título do slide atual + contador. */
.palco-cabecalho {
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.palco-cabecalho-titulo {
  font-family: var(--fonte-titulo);
  font-size: 1.05rem;
  font-weight: 700;
  color: #f5f7ff;
}

.palco-cabecalho-contador {
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.55);
}

/* Dica de navegação por teclado, discreta no canto superior direito. */
.palco-dica {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: rgba(226, 232, 240, 0.7);
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(148, 163, 184, 0.2);
  backdrop-filter: blur(6px);
}

.palco-dica-icone {
  font-size: 0.95rem;
}

.palco-dica kbd {
  padding: 0.05rem 0.3rem;
  border-radius: 0.3rem;
  font-family: var(--fonte-texto);
  font-size: 0.7rem;
  background: rgba(148, 163, 184, 0.18);
  border: 1px solid rgba(148, 163, 184, 0.28);
}

/* Barra de controles fixada no rodapé centralizado. */
.palco-controles {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.9rem;
  border-radius: 9999px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.22);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 30px -12px rgba(0, 0, 0, 0.6);
}

/* Pontos de progresso: um por slide. */
.palco-pontos {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  max-width: 60vw;
  flex-wrap: wrap;
  justify-content: center;
}

.palco-ponto {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  background: rgba(148, 163, 184, 0.35);
  transition:
    width 0.3s ease,
    background 0.3s ease;
}

.palco-ponto:hover {
  background: rgba(148, 163, 184, 0.6);
}

.palco-ponto--atual {
  width: 22px;
  background: linear-gradient(90deg, var(--camada-abertura, #8b7bf0), var(--camada-ide, #38bdf8));
}
</style>

<!--
  Estilos NÃO escopados para atingir os nós do Vue Flow (que ficam fora do
  escopo do componente). Controlam o destaque do nó atual e o esmaecimento
  dos demais, além das transições de entrada/saída dos detalhes (subnós).
-->
<style>
.no-apresentacao {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease,
    filter 0.45s ease;
}

/* Nó atualmente em foco: totalmente visível e levemente ampliado. */
.no-atual {
  opacity: 1;
  filter: none;
  z-index: 5;
  transform: scale(1.02);
}

/*
  Subnó (detalhe) do assunto em foco: totalmente opaco e sem esmaecimento,
  mas SEM o realce de destaque do pai (sem scale/z-index elevado). Sem esta
  classe os subnós caíam em `.no-esmaecido` (opacity 0.4), deixando o cartão
  inteiro translúcido — o fundo do palco vazava mesmo com fundo sólido.
*/
.no-detalhe-ativo {
  opacity: 1;
  filter: none;
}

/* Demais nós: esmaecidos para reforçar a metáfora de slide. */
.no-esmaecido {
  opacity: 0.4;
  filter: saturate(0.65) brightness(0.9);
}

/*
  Cores por CAMADA aplicadas via classe do nó (definida pelo motor).
  Cada classe injeta as variáveis --cor/--cor-forte consumidas pelos
  cartões (NoCapa/NoAssunto/NoDetalhe).
*/
.camada-abertura {
  --cor: var(--camada-abertura);
  --cor-forte: var(--camada-abertura-forte);
}
.camada-ide {
  --cor: var(--camada-ide);
  --cor-forte: var(--camada-ide-forte);
}
.camada-harness {
  --cor: var(--camada-harness);
  --cor-forte: var(--camada-harness-forte);
}
.camada-recurso {
  --cor: var(--camada-recurso);
  --cor-forte: var(--camada-recurso-forte);
}
.camada-superficie {
  --cor: var(--camada-superficie);
  --cor-forte: var(--camada-superficie-forte);
}

/*
  As variáveis acima ficam no wrapper .vue-flow__node; propagamos para o
  cartão interno (que define seu próprio fallback de cor). Como os cartões
  usam var(--cor), a herança de custom properties já cobre o caso.
*/
.camada-abertura .cartao-capa,
.camada-abertura .cartao-assunto,
.camada-abertura .cartao-detalhe,
.camada-ide .cartao-capa,
.camada-ide .cartao-assunto,
.camada-ide .cartao-detalhe,
.camada-harness .cartao-capa,
.camada-harness .cartao-assunto,
.camada-harness .cartao-detalhe,
.camada-recurso .cartao-capa,
.camada-recurso .cartao-assunto,
.camada-recurso .cartao-detalhe,
.camada-superficie .cartao-capa,
.camada-superficie .cartao-assunto,
.camada-superficie .cartao-detalhe {
  --cor: inherit;
  --cor-forte: inherit;
}

/*
  Animação de entrada dos detalhes (subnós) quando o assunto pai entra em
  foco. O Vue Flow controla a visibilidade via `hidden` (monta/desmonta o
  wrapper `.vue-flow__node`); ao reaparecer, o cartão desliza suavemente.

  IMPORTANTE: a animação é aplicada SOMENTE ao cartão interno (.cartao-detalhe),
  nunca ao wrapper `.vue-flow__node`. Animar o wrapper com `fill-mode: both`
  fazia o nó ficar preso no estado inicial (opacity: 0) em certos ciclos de
  montagem/remoção do Vue Flow, deixando o subnó invisível enquanto as arestas
  continuavam desenhadas. Usamos `forwards` (não `both`) para não reter o
  estado `from`. A regra vale para TODOS os detalhes de forma uniforme — antes
  havia um seletor frágil por id (`[data-id^="ide-d-"]`) que só afetava o
  assunto "ide" e era a causa dos subnós invisíveis daquele slide.
*/
.vue-flow__node .cartao-detalhe {
  animation: surgir-detalhe 0.45s ease forwards;
}

@keyframes surgir-detalhe {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Arestas do fluxo principal com a cor de destaque da apresentação. */
.vue-flow__edge-path,
.aresta-apresentacao .vue-flow__edge-path {
  stroke: rgba(139, 123, 240, 0.55);
  stroke-width: 2;
  transition:
    opacity 0.45s ease,
    stroke 0.45s ease;
}

.vue-flow__edge.animated .vue-flow__edge-path {
  stroke: rgba(56, 189, 248, 0.7);
}

/*
  Aresta de fluxo que NÃO toca o nó atual: fortemente esmaecida para não
  desenhar linhas cruzando a tela rumo a vizinhos fora do viewport (efeito de
  "linha que se conecta a nada" ao dar zoom em um nó). Mantemos uma opacidade
  mínima para preservar a leitura do grafo na visão geral (Esc / enquadrar).
*/
.aresta-fluxo-esmaecida {
  opacity: 0.1;
}

/* Aresta de fluxo que liga o nó atual a um vizinho: em destaque. */
.aresta-fluxo-ativa {
  opacity: 1;
}

/*
  Handles do Vue Flow (os pequenos círculos nas bordas dos cartões). A
  apresentação não permite criar conexões manualmente, então eles são apenas
  âncoras internas para desenhar as arestas — nunca devem aparecer.
*/
.vue-flow__handle {
  width: 1px;
  height: 1px;
  min-width: 0;
  min-height: 0;
  background: transparent;
  border: none;
  opacity: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .vue-flow__node .cartao-detalhe {
    animation: none;
  }
  .no-atual {
    transform: none;
  }
}
</style>
