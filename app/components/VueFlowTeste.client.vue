<script setup lang="ts">
// Componente de teste do Vue Flow, renderizado apenas no cliente (.client.vue).
// Isola os imports do Vue Flow para evitar erros de SSR (acesso a window/document).
import { VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

defineProps<{
  nos: Node[]
  arestas: Edge[]
}>()
</script>

<template>
  <VueFlow
    :nodes="nos"
    :edges="arestas"
    fit-view-on-init
    class="vue-flow-teste"
  >
    <Background />
    <Controls />
    <MiniMap />
  </VueFlow>
</template>

<style scoped>
.vue-flow-teste {
  width: 100%;
  height: 100%;
}
</style>
