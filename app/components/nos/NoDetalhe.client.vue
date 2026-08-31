<!-- app/components/nos/NoDetalhe.client.vue — Nó de detalhamento de um assunto (subnó 'detalhe'). -->
<!-- Revelado com animação quando o assunto pai está em foco. Renderiza a ilustração de fundo -->
<!-- HERDADA do assunto pai (chave resolvida no composable e recebida via data.ilustracao), bem -->
<!-- mais esmaecida que nos cartões maiores, para não competir com o texto do cartão de 228px. -->

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { CamadaVisual, ConteudoSlide, TipoSlide } from '~/tipos/apresentacao'

defineProps<{
  data: {
    titulo: string
    conteudo?: ConteudoSlide
    tipo: TipoSlide
    camada: CamadaVisual
    atual: boolean
    /** Chave da ilustração de fundo (herdada do assunto pai) resolvida pelo motor. */
    ilustracao?: string
  }
}>()
</script>

<template>
  <div class="cartao-detalhe" :class="[data.atual && 'cartao-detalhe--atual']">
    <!-- Ilustração de fundo herdada do assunto pai (marca d'água bem discreta). -->
    <IlustracaoFundo class="ilustracao-detalhe" :chave="data.ilustracao" :camada="data.camada" />

    <Handle id="detalhe-entrada" type="target" :position="Position.Top" :connectable="false" />

    <!-- Conteúdo textual acima da ilustração (camada de leitura). -->
    <div class="cartao-conteudo">
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
    </div>

    <Handle id="detalhe-saida" type="source" :position="Position.Bottom" :connectable="false" />
  </div>
</template>

<style scoped>
.cartao-detalhe {
  --cor: var(--camada-recurso);
  --cor-forte: var(--camada-recurso-forte);
  position: relative;
  overflow: hidden;
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

/* Camada de leitura: acima da ilustração de fundo para garantir contraste. */
.cartao-conteudo {
  position: relative;
  z-index: 2;
}

/*
  O cartão de detalhe é pequeno (228px): a ilustração herdada do pai precisa
  ser AINDA MAIS discreta que nos cartões maiores para não competir com o texto.
  Reduzimos a opacidade do desenho e reforçamos o overlay escuro (as classes
  internas do componente filho são atingidas via :deep, pois lá o CSS é scoped).
*/
.ilustracao-detalhe :deep(.ilustracao-svg) {
  opacity: 0.08;
}

.ilustracao-detalhe :deep(.ilustracao-overlay) {
  background:
    radial-gradient(120% 90% at 50% 40%, rgba(13, 18, 32, 0.55), rgba(13, 18, 32, 0.82) 85%);
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
