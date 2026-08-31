<!-- app/components/nos/NoDetalhe.client.vue — Nó de detalhamento de um assunto (subnó 'detalhe'). -->
<!-- Revelado com animação quando o assunto pai está em foco. Cartão compacto (228px) só com -->
<!-- texto; a "big image" do slide agora é o wallpaper do palco (composable wallpaperAtual), -->
<!-- que herda a imagem/chave do assunto pai — o detalhe não desenha mais ilustração interna. -->

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
  }
}>()
</script>

<template>
  <div class="cartao-detalhe" :class="[data.atual && 'cartao-detalhe--atual']">
    <Handle id="detalhe-entrada" type="target" :position="Position.Top" :connectable="false" />

    <!-- Agrupador do conteúdo textual do cartão (a "big image" agora é o wallpaper do palco). -->
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
  /* Fundo SOLIDO opaco, no mesmo padrao do NoAssunto (cartao pai). Sem
     transparencia nem backdrop-filter: dentro do `.vue-flow__viewport` (que
     tem `transform`) o blur nao alcanca o wallpaper do palco, e a
     transparencia deixava o conteudo de tras vazar de forma indesejada.
     O "vidro" foi abandonado a pedido — cartao opaco e legivel. */
  background:
    radial-gradient(130% 80% at 0% 0%, color-mix(in srgb, var(--cor) 18%, transparent), transparent 65%),
    linear-gradient(160deg, #172038, #0d1322);
  /* Borda sutil na cor da camada. */
  border: 1px solid color-mix(in srgb, var(--cor-forte) 30%, rgba(255, 255, 255, 0.18));
  /* Sombra de profundidade + realce claro interno no topo. */
  box-shadow:
    0 16px 40px -18px rgba(0, 0, 0, 0.85),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition:
    transform 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.cartao-detalhe--atual {
  /* Em foco, borda e sombra ficam um pouco mais fortes para destacar o cartao. */
  border-color: color-mix(in srgb, var(--cor-forte) 45%, rgba(255, 255, 255, 0.28));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--cor-forte) 50%, transparent),
    0 18px 36px -18px color-mix(in srgb, var(--cor) 50%, black),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
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
