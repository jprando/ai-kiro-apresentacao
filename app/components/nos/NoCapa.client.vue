<script setup lang="ts">
// Nó customizado para slides de abertura e panorama: 'capa', 'agenda' e
// 'overview'. Cartão infográfico com logo/ícone grande, hierarquia
// tipográfica e lista de tópicos com marcadores.
import { Handle, Position } from '@vue-flow/core'
import type { CamadaVisual, ConteudoSlide, TipoSlide } from '~/tipos/apresentacao'

const props = defineProps<{
  data: {
    titulo: string
    conteudo?: ConteudoSlide
    tipo: TipoSlide
    camada: CamadaVisual
    atual: boolean
  }
}>()

/** Rótulo curto do tipo, exibido como badge no topo do cartão. */
const rotuloTipo = computed(() => {
  switch (props.data.tipo) {
    case 'capa':
      return 'Apresentação'
    case 'agenda':
      return 'Agenda'
    default:
      return 'Panorama'
  }
})
</script>

<template>
  <div class="cartao-capa" :class="[data.atual && 'cartao-capa--atual']">
    <!-- Conectores de entrada/saída da metáfora de fluxo do Vue Flow. -->
    <Handle id="fluxo-entrada" type="target" :position="Position.Left" :connectable="false" />

    <span class="cartao-badge">{{ rotuloTipo }}</span>

    <!-- Logo/marca visual (ex.: fantasminha do Kiro na capa). -->
    <img
      v-if="data.conteudo?.logo"
      :src="data.conteudo.logo"
      class="cartao-logo"
      :class="{ 'cartao-logo--flutua': data.atual }"
      alt="Fantasminha do Kiro"
    >
    <div v-else-if="data.conteudo?.icone" class="cartao-icone-aro">
      <UIcon :name="data.conteudo.icone" class="cartao-icone" />
    </div>

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
      <li v-for="topico in data.conteudo.topicos" :key="topico" class="cartao-topico">
        <UIcon name="i-lucide-chevron-right" class="cartao-marcador" />
        <span>{{ topico }}</span>
      </li>
    </ul>

    <Handle id="fluxo-saida" type="source" :position="Position.Right" :connectable="false" />
  </div>
</template>

<style scoped>
.cartao-capa {
  --cor: var(--camada-abertura);
  --cor-forte: var(--camada-abertura-forte);
  width: 360px;
  padding: 1.75rem 1.75rem 1.5rem;
  border-radius: 1.25rem;
  text-align: center;
  font-family: var(--fonte-texto);
  color: #f5f7ff;
  background:
    radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--cor) 22%, transparent), transparent 70%),
    linear-gradient(160deg, #182038, #0e1424);
  border: 1px solid color-mix(in srgb, var(--cor) 45%, transparent);
  box-shadow:
    0 20px 45px -20px rgba(0, 0, 0, 0.75),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

.cartao-capa--atual {
  border-color: var(--cor-forte);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--cor-forte) 55%, transparent),
    0 28px 60px -22px color-mix(in srgb, var(--cor) 60%, black);
}

.cartao-badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  margin-bottom: 0.9rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cor-forte);
  background: color-mix(in srgb, var(--cor) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--cor) 40%, transparent);
}

.cartao-logo {
  width: 84px;
  height: 98px;
  margin: 0 auto 0.75rem;
  display: block;
  filter: drop-shadow(0 8px 18px color-mix(in srgb, var(--cor) 45%, transparent));
}

/* Flutuação sutil do fantasminha quando o slide de capa está em foco. */
.cartao-logo--flutua {
  animation: flutuar 3.6s ease-in-out infinite;
}

.cartao-icone-aro {
  width: 68px;
  height: 68px;
  margin: 0 auto 0.75rem;
  display: grid;
  place-items: center;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--cor) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--cor) 40%, transparent);
}

.cartao-icone {
  font-size: 2.1rem;
  color: var(--cor-forte);
}

.cartao-titulo {
  font-family: var(--fonte-titulo);
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0;
}

.cartao-subtitulo {
  font-size: 1rem;
  font-weight: 600;
  color: var(--cor-forte);
  margin: 0.4rem 0 0;
}

.cartao-descricao {
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.82;
  margin: 0.75rem 0 0;
}

.cartao-topicos {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  text-align: left;
}

.cartao-topico {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 0.85rem;
  line-height: 1.35;
  opacity: 0.9;
}

.cartao-marcador {
  flex: 0 0 auto;
  margin-top: 0.15rem;
  font-size: 0.85rem;
  color: var(--cor-forte);
}

@keyframes flutuar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cartao-logo--flutua {
    animation: none;
  }
}
</style>
