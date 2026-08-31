<script setup lang="ts">
// Nó customizado para um assunto principal ('assunto'). Ao ser focado,
// seus subnós (detalhes) são revelados pelo motor (composable).
//
// Renderiza também a lista `topicos` quando presente — usada pelas superfícies
// (CLI, Web, Mobile, Crew), que são do tipo 'assunto' mas trazem bullets em
// vez de subnós.
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

/** Rótulo curto da camada, exibido como badge no cabeçalho do cartão. */
const rotuloCamada = computed(() => {
  switch (props.data.camada) {
    case 'ide':
      return 'Kiro IDE'
    case 'harness':
      return 'Harness'
    case 'recurso':
      return 'Recurso .kiro'
    case 'superficie':
      return 'Superfície'
    default:
      return 'Assunto'
  }
})
</script>

<template>
  <div class="cartao-assunto" :class="[data.atual && 'cartao-assunto--atual']">
    <!-- Ilustração conceitual de fundo ("big image" do assunto), atrás do texto. -->
    <IlustracaoFundo :chave="data.conteudo?.ilustracao" :camada="data.camada" />

    <Handle id="fluxo-entrada" type="target" :position="Position.Left" :connectable="false" />

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
      <div class="cartao-cabecalho-texto">
        <span class="cartao-badge">{{ rotuloCamada }}</span>
        <h3 class="cartao-titulo">
          {{ data.titulo }}
        </h3>
      </div>
    </div>

    <p v-if="data.conteudo?.subtitulo" class="cartao-subtitulo">
      {{ data.conteudo.subtitulo }}
    </p>
    <p v-if="data.conteudo?.descricao" class="cartao-descricao">
      {{ data.conteudo.descricao }}
    </p>

    <!-- Tópicos/bullets (ex.: destaques das superfícies CLI/Web/Mobile/Crew). -->
    <ul v-if="data.conteudo?.topicos?.length" class="cartao-topicos">
      <li v-for="topico in data.conteudo.topicos" :key="topico" class="cartao-topico">
        <UIcon name="i-lucide-check" class="cartao-marcador" />
        <span>{{ topico }}</span>
      </li>
    </ul>
    </div>

    <Handle id="fluxo-saida" type="source" :position="Position.Right" :connectable="false" />
    <!-- Conector inferior para os detalhes (subnós). -->
    <Handle id="detalhes" type="source" :position="Position.Bottom" :connectable="false" />
  </div>
</template>

<style scoped>
.cartao-assunto {
  --cor: var(--camada-ide);
  --cor-forte: var(--camada-ide-forte);
  position: relative;
  overflow: hidden;
  width: 300px;
  padding: 1.35rem;
  border-radius: 1.1rem;
  font-family: var(--fonte-texto);
  color: #f5f7ff;
  background:
    radial-gradient(130% 80% at 0% 0%, color-mix(in srgb, var(--cor) 20%, transparent), transparent 65%),
    linear-gradient(160deg, #172038, #0d1322);
  border: 1px solid color-mix(in srgb, var(--cor) 45%, transparent);
  box-shadow:
    0 18px 40px -22px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    transform 0.4s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;
}

.cartao-assunto--atual {
  border-color: var(--cor-forte);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--cor-forte) 55%, transparent),
    0 26px 55px -22px color-mix(in srgb, var(--cor) 55%, black);
}

/* Camada de leitura: fica acima da ilustração de fundo para garantir contraste. */
.cartao-conteudo {
  position: relative;
  z-index: 2;
}

.cartao-cabecalho {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cartao-icone-aro {
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 0.85rem;
  background: color-mix(in srgb, var(--cor) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--cor) 40%, transparent);
}

.cartao-icone {
  font-size: 1.5rem;
  color: var(--cor-forte);
}

.cartao-cabecalho-texto {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.cartao-badge {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--cor-forte);
}

.cartao-titulo {
  font-family: var(--fonte-titulo);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
}

.cartao-subtitulo {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cor-forte);
  margin: 0.75rem 0 0;
}

.cartao-descricao {
  font-size: 0.85rem;
  line-height: 1.45;
  opacity: 0.8;
  margin: 0.4rem 0 0;
}

.cartao-topicos {
  list-style: none;
  padding: 0;
  margin: 0.85rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cartao-topico {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  font-size: 0.82rem;
  line-height: 1.35;
  opacity: 0.9;
}

.cartao-marcador {
  flex: 0 0 auto;
  margin-top: 0.12rem;
  font-size: 0.82rem;
  color: var(--cor-forte);
}
</style>
