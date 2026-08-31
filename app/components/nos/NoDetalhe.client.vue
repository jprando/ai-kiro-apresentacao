<script setup lang="ts">
// Nó customizado para um detalhamento de assunto ('detalhe' / subnó).
// É revelado com animação quando o assunto pai está em foco.
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
  <div class="cartao-detalhe">
    <Handle type="target" :position="Position.Top" />
    <div class="cartao-cabecalho">
      <UIcon
        v-if="data.conteudo?.icone"
        :name="data.conteudo.icone"
        class="cartao-icone"
      />
      <h4 class="cartao-titulo">
        {{ data.titulo }}
      </h4>
    </div>
    <p v-if="data.conteudo?.descricao" class="cartao-descricao">
      {{ data.conteudo.descricao }}
    </p>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.cartao-detalhe {
  width: 220px;
  padding: 1rem;
  border-radius: 0.75rem;
  background: var(--ui-bg-muted, #1e293b);
  color: var(--ui-text, #e2e8f0);
  border: 1px dashed var(--ui-border-accented, #475569);
}

.cartao-cabecalho {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.cartao-icone {
  font-size: 1.15rem;
}

.cartao-titulo {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.cartao-descricao {
  font-size: 0.8rem;
  opacity: 0.75;
  margin: 0.35rem 0 0;
}
</style>
