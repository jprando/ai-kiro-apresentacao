<script setup lang="ts">
// Nó customizado para um assunto principal ('assunto'). Ao ser focado,
// seus subnós (detalhes) são revelados pelo motor (composable).
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
  <div class="cartao-assunto">
    <Handle type="target" :position="Position.Left" />
    <div class="cartao-cabecalho">
      <UIcon
        v-if="data.conteudo?.icone"
        :name="data.conteudo.icone"
        class="cartao-icone"
      />
      <h3 class="cartao-titulo">
        {{ data.titulo }}
      </h3>
    </div>
    <p v-if="data.conteudo?.subtitulo" class="cartao-subtitulo">
      {{ data.conteudo.subtitulo }}
    </p>
    <p v-if="data.conteudo?.descricao" class="cartao-descricao">
      {{ data.conteudo.descricao }}
    </p>
    <Handle type="source" :position="Position.Right" />
    <!-- Conector inferior para os detalhes (subnós). -->
    <Handle id="detalhes" type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.cartao-assunto {
  width: 280px;
  padding: 1.25rem;
  border-radius: 0.875rem;
  background: var(--ui-bg-elevated, #111827);
  color: var(--ui-text, #f9fafb);
  border: 2px solid var(--ui-primary, #6366f1);
}

.cartao-cabecalho {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cartao-icone {
  font-size: 1.5rem;
}

.cartao-titulo {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
}

.cartao-subtitulo {
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.9;
  margin: 0.5rem 0 0;
}

.cartao-descricao {
  font-size: 0.85rem;
  opacity: 0.75;
  margin: 0.35rem 0 0;
}
</style>
