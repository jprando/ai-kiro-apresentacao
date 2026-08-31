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
  indiceAtual,
  ordem,
  proximo,
  anterior,
  irPara,
  irParaInicio,
  irParaFim,
  enquadrarTudo
} = usarApresentacao()

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
      <Background :gap="24" pattern-color="#334155" />
      <Controls position="bottom-left" />
      <MiniMap pannable zoomable />
    </VueFlow>

    <!-- Barra de controles de navegação (client-side). -->
    <div class="palco-controles">
      <UButton
        icon="i-lucide-chevron-left"
        color="neutral"
        variant="soft"
        aria-label="Slide anterior"
        @click="anterior"
      />
      <span class="palco-indicador">
        {{ slideAtual?.titulo ?? '' }}
        <span class="palco-contador">
          {{ indiceAtual + 1 }} / {{ ordem.length }}
        </span>
      </span>
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
}

.palco-fluxo {
  width: 100%;
  height: 100%;
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
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: var(--ui-bg-elevated, rgba(17, 24, 39, 0.9));
  border: 1px solid var(--ui-border, #374151);
  backdrop-filter: blur(6px);
}

.palco-indicador {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  font-weight: 600;
  color: var(--ui-text, #f9fafb);
}

.palco-contador {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.7;
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
    opacity 0.4s ease,
    transform 0.4s ease,
    filter 0.4s ease;
}

/* Nó atualmente em foco: totalmente visível e levemente ampliado. */
.no-atual {
  opacity: 1;
  filter: none;
  z-index: 5;
}

/* Demais nós: esmaecidos para reforçar a metáfora de slide. */
.no-esmaecido {
  opacity: 0.45;
  filter: saturate(0.7);
}
</style>
