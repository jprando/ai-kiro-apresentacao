<script setup lang="ts">
// Nó customizado para um detalhamento de assunto ('detalhe' / subnó).
// É revelado com animação quando o assunto pai está em foco.
import { Handle, Position } from '@vue-flow/core'
import type { CamadaVisual, ConteudoSlide, TipoSlide } from '~/tipos/apresentacao'

defineProps<{
  data: {
    titulo: string
    conteudo?: ConteudoSlide
    tipo: TipoSlide
    camada: CamadaVisual
    atual: boolean
  }
}>()
</script>

<template>
  <div class="cartao-detalhe" :class="[data.atual && 'cartao-detalhe--atual']">
    <Handle id="detalhe-entrada" type="target" :position="Position.Top" :connectable="false" />
    <div class="cartao-cabecalho">
      <div class="cartao-icone-aro">
        <UIcon
          v-if="data.conteudo?.icone"
          :name="data.conteudo.icone"
          class="cartao-icone"
        />
      </div>
      <h4 class="cartao-titulo">
        {{ data.titulo }}
      </h4>
    </div>
    <p v-if="data.conteudo?.descricao" class="cartao-descricao">
      {{ data.conteudo.descricao }}
    </p>
    <Handle id="detalhe-saida" type="source" :position="Position.Bottom" :connectable="false" />
  </div>
</template>

<style scoped>
.cartao-detalhe {
  --cor: var(--camada-recurso);
  --cor-forte: var(--camada-recurso-forte);
  width: 228px;
  padding: 0.95rem 1rem;
  border-radius: 0.85rem;
  font-family: var(--fonte-texto);
  color: #eef1fb;
  background: linear-gradient(160deg, #141b2e, #0d1220);
  border: 1px solid color-mix(in srgb, var(--cor) 35%, transparent);
  box-shadow: 0 12px 28px -18px rgba(0, 0, 0, 0.7);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.cartao-detalhe--atual {
  border-color: var(--cor-forte);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--cor-forte) 50%, transparent),
    0 18px 36px -18px color-mix(in srgb, var(--cor) 50%, black);
}

.cartao-cabecalho {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cartao-icone-aro {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 0.6rem;
  background: color-mix(in srgb, var(--cor) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--cor) 32%, transparent);
}

.cartao-icone {
  font-size: 1.1rem;
  color: var(--cor-forte);
}

.cartao-titulo {
  font-family: var(--fonte-titulo);
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.15;
  margin: 0;
}

.cartao-descricao {
  font-size: 0.78rem;
  line-height: 1.4;
  opacity: 0.78;
  margin: 0.45rem 0 0;
}
</style>
