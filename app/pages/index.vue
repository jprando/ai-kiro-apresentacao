<script setup lang="ts">
// Página inicial (placeholder de validação da integração Vue Flow).
// O conteúdo real da apresentação virá em features seguintes.
//
// Padrão obrigatório: o VueFlow acessa `window`/`document`, portanto
// deve ser renderizado somente no cliente, dentro de <ClientOnly>.
// Ver docs do Vue Flow: https://vueflow.dev/

import type { Edge, Node } from '@vue-flow/core'

// Dois nós de teste apenas para validar que a integração compila e roda.
const nos = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    position: { x: 100, y: 100 },
    data: { label: 'Kiro IDE' }
  },
  {
    id: '2',
    type: 'output',
    position: { x: 100, y: 260 },
    data: { label: 'Recursos' }
  }
])

const arestas = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true
  }
])
</script>

<template>
  <div class="apresentacao-tela">
    <ClientOnly>
      <!-- VueFlow e addons são carregados apenas no cliente -->
      <VueFlowTeste :nos="nos" :arestas="arestas" />
      <template #fallback>
        <div class="apresentacao-carregando">
          Carregando apresentação...
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.apresentacao-tela {
  width: 100vw;
  height: 100vh;
}

.apresentacao-carregando {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.25rem;
}
</style>
