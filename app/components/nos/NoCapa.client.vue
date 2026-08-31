<script setup lang="ts">
// Nó customizado para slides de abertura e panorama: 'capa', 'agenda' e
// 'overview'. Visual básico e funcional (o polimento fino é do FEAT-004).
import { Handle, Position } from '@vue-flow/core'
import type { ConteudoSlide, TipoSlide } from '~/tipos/apresentacao'

defineProps<{
  data: {
    titulo: string
    conteudo?: ConteudoSlide
    tipo: TipoSlide
    atual: boolean
  }
}>()
</script>

<template>
  <div class="cartao-capa">
    <!-- Conectores de entrada/saída da metáfora de fluxo do Vue Flow. -->
    <Handle type="target" :position="Position.Left" />
    <UIcon
      v-if="data.conteudo?.icone"
      :name="data.conteudo.icone"
      class="cartao-icone"
    />
    <h2 class="cartao-titulo">
      {{ data.titulo }}
    </h2>
    <p v-if="data.conteudo?.subtitulo" class="cartao-subtitulo">
      {{ data.conteudo.subtitulo }}
    </p>
    <p v-if="data.conteudo?.descricao" class="cartao-descricao">
      {{ data.conteudo.descricao }}
    </p>
    <ul v-if="data.conteudo?.topicos?.length" class="cartao-topicos">
      <li v-for="topico in data.conteudo.topicos" :key="topico">
        {{ topico }}
      </li>
    </ul>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<style scoped>
.cartao-capa {
  width: 320px;
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
  background: var(--ui-bg-elevated, #1f2937);
  color: var(--ui-text, #f9fafb);
  border: 2px solid var(--ui-border, #374151);
}

.cartao-icone {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.cartao-titulo {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.cartao-subtitulo {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0.25rem 0 0;
}

.cartao-descricao {
  font-size: 0.9rem;
  opacity: 0.75;
  margin: 0.75rem 0 0;
}

.cartao-topicos {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
