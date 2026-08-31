<!-- app/components/IlustracaoFundo.client.vue — SVG conceitual ("big image") reutilizado em 2 modos. -->
<!-- Resolve uma CHAVE estável (conteudo.ilustracao) para um SVG inline que "desenha" a ideia do -->
<!-- slide. modo='card' (padrão): fundo esmaecido do cartão. modo='wallpaper': fundo do PALCO em -->
<!-- tela cheia, sem overlay interno (legibilidade vem do overlay do palco). aria-hidden + no-events. -->

<script setup lang="ts">
import type { CamadaVisual } from '~/tipos/apresentacao'

const props = withDefaults(defineProps<{
  /** Chave estável da ilustração (ex.: 'motor-loop'). Ausente/desconhecida = não renderiza. */
  chave?: string
  /** Camada visual do slide — usada só para variações de estilo/semântica. */
  camada: CamadaVisual
  /**
   * Modo de renderização:
   * - 'card'      : dentro do cartão (opacidade baixa + overlay interno próprio);
   * - 'wallpaper' : fundo do palco em tela cheia (sem overlay interno, pois a
   *                 legibilidade é garantida pelo overlay do PalcoApresentacao).
   */
  modo?: 'card' | 'wallpaper'
}>(), {
  modo: 'card'
})

/**
 * Conjunto de chaves que o resolvedor sabe desenhar. Se a chave não estiver
 * aqui (ou for indefinida), o componente não renderiza nada — degradação
 * graciosa, o cartão mantém apenas seu fundo padrão.
 */
const CHAVES_CONHECIDAS = new Set<string>([
  'fantasminha-portas',
  'trilha-paradas',
  'agente-portas',
  'editor-robo',
  'base-tijolos',
  'chips-cerebros',
  'velocimetro',
  'motor-loop',
  'motor-portas',
  'casinha-usuario',
  'pasta-git',
  'tres-documentos',
  'bussola',
  'raio-engrenagem',
  'plugue-servidores',
  'mochila-instrucoes',
  'plugue-faisca',
  'linha-tempo-rewind',
  'escudo-semaforo',
  'robos-especialistas',
  'simbolos-linguagens',
  'terminal',
  'navegador-pr',
  'celular-sessao',
  'equipe-robos'
])

/** Só renderiza quando a chave é conhecida. */
const chaveValida = computed(() =>
  Boolean(props.chave && CHAVES_CONHECIDAS.has(props.chave))
)

// Silencia aviso de "prop não utilizada": a camada fica disponível para
// evoluções futuras (ex.: variar traços por camada). Uso mínimo aqui.
void props.camada
</script>

<template>
  <div
    v-if="chaveValida"
    class="ilustracao-fundo"
    :class="`ilustracao-fundo--${modo}`"
    aria-hidden="true"
  >
    <!-- Overlay de contraste do CARTÃO: só no modo 'card'. No modo 'wallpaper'
         a legibilidade vem do overlay do palco, evitando escurecimento duplo. -->
    <div v-if="modo === 'card'" class="ilustracao-overlay" />

    <svg
      class="ilustracao-svg"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Capa/encerramento: fantasminha + várias portas convergindo ao agente. -->
      <template v-if="chave === 'fantasminha-portas'">
        <g class="traco">
          <path
            class="cheio"
            d="M200 96c-34 0-52 26-52 60v70c0 6 6 8 11 3 5-5 12-5 17 0 5 6 13 6 18 0 4-5 10-5 14 0 5 6 13 6 18 0 5-5 12-5 17 0 5 5 11 3 11-3v-70c0-34-18-60-54-60Z"
          />
          <circle class="fundo" cx="184" cy="150" r="9" />
          <circle class="fundo" cx="216" cy="150" r="9" />
        </g>
        <g class="traco fino">
          <rect class="borda" x="40" y="120" width="42" height="60" rx="4" />
          <rect class="borda" x="40" y="196" width="42" height="60" rx="4" />
          <rect class="borda" x="318" y="120" width="42" height="60" rx="4" />
          <rect class="borda" x="318" y="196" width="42" height="60" rx="4" />
          <path class="linha" d="M82 150h60M82 226h60M318 150h-60M318 226h-60" />
        </g>
      </template>

      <!-- Agenda: trilha com paradas numeradas. -->
      <template v-else-if="chave === 'trilha-paradas'">
        <path class="linha grossa" d="M40 240C120 120 160 260 220 150 270 60 330 200 370 90" fill="none" />
        <g class="traco">
          <circle class="cheio" cx="40" cy="240" r="16" />
          <circle class="cheio" cx="150" cy="205" r="16" />
          <circle class="cheio" cx="220" cy="150" r="16" />
          <circle class="cheio" cx="300" cy="128" r="16" />
          <circle class="cheio" cx="370" cy="90" r="16" />
        </g>
        <g class="rotulo">
          <text x="40" y="245" text-anchor="middle">1</text>
          <text x="150" y="210" text-anchor="middle">2</text>
          <text x="220" y="155" text-anchor="middle">3</text>
          <text x="300" y="133" text-anchor="middle">4</text>
          <text x="370" y="95" text-anchor="middle">5</text>
        </g>
      </template>

      <!-- Overview/Superfícies: agente central com portas (IDE/CLI/Web/Mobile/Crew). -->
      <template v-else-if="chave === 'agente-portas'">
        <circle class="cheio" cx="200" cy="150" r="40" />
        <text class="rotulo forte" x="200" y="156" text-anchor="middle">agente</text>
        <g class="traco fino">
          <rect class="borda" x="30" y="60" width="70" height="46" rx="6" />
          <rect class="borda" x="300" y="60" width="70" height="46" rx="6" />
          <rect class="borda" x="30" y="196" width="70" height="46" rx="6" />
          <rect class="borda" x="300" y="196" width="70" height="46" rx="6" />
          <rect class="borda" x="165" y="240" width="70" height="46" rx="6" />
          <path class="linha" d="M100 83l62 55M300 83l-62 55M100 219l62-30M300 219l-62-30M200 240v-50" />
        </g>
        <g class="rotulo pequeno">
          <text x="65" y="87" text-anchor="middle">IDE</text>
          <text x="335" y="87" text-anchor="middle">CLI</text>
          <text x="65" y="223" text-anchor="middle">Web</text>
          <text x="335" y="223" text-anchor="middle">Mobile</text>
          <text x="200" y="267" text-anchor="middle">Crew</text>
        </g>
      </template>

      <!-- Kiro IDE: janela de editor com cursor + robôzinho. -->
      <template v-else-if="chave === 'editor-robo'">
        <rect class="borda cheio-leve" x="40" y="70" width="230" height="160" rx="10" />
        <path class="linha" d="M40 100h230" />
        <circle class="fundo" cx="58" cy="85" r="4" />
        <circle class="fundo" cx="72" cy="85" r="4" />
        <circle class="fundo" cx="86" cy="85" r="4" />
        <g class="linha grossa">
          <path d="M66 128h120M66 152h150M66 176h90" />
        </g>
        <rect class="cheio piscando" x="160" y="166" width="4" height="20" />
        <g class="traco">
          <rect class="cheio" x="300" y="120" width="60" height="54" rx="10" />
          <circle class="fundo" cx="318" cy="145" r="6" />
          <circle class="fundo" cx="342" cy="145" r="6" />
          <path class="linha" d="M330 100v14" />
          <circle class="cheio" cx="330" cy="96" r="6" />
        </g>
      </template>

      <!-- História: base de tijolos (VS Code) + robô surgindo em cima. -->
      <template v-else-if="chave === 'base-tijolos'">
        <g class="traco fino">
          <rect class="borda cheio-leve" x="70" y="190" width="260" height="34" rx="4" />
          <rect class="borda cheio-leve" x="70" y="228" width="260" height="34" rx="4" />
          <path class="linha" d="M140 190v34M210 190v34M280 190v34M105 228v34M175 228v34M245 228v34M315 228v34" />
        </g>
        <text class="rotulo pequeno" x="200" y="252" text-anchor="middle">base do editor</text>
        <g class="traco">
          <rect class="cheio" x="160" y="90" width="80" height="70" rx="14" />
          <circle class="fundo" cx="184" cy="122" r="8" />
          <circle class="fundo" cx="216" cy="122" r="8" />
          <path class="linha" d="M200 64v22" />
          <circle class="cheio" cx="200" cy="58" r="8" />
        </g>
        <path class="linha grossa seta-cima" d="M200 190v-24M192 174l8-8 8 8" fill="none" />
      </template>

      <!-- Modelos: vários chips/cérebros lado a lado (escolha). -->
      <template v-else-if="chave === 'chips-cerebros'">
        <g class="traco">
          <rect class="borda cheio-leve" x="45" y="115" width="70" height="70" rx="12" />
          <rect class="borda cheio-leve" x="130" y="115" width="70" height="70" rx="12" />
          <rect class="cheio destaque-borda" x="215" y="115" width="70" height="70" rx="12" />
          <rect class="borda cheio-leve" x="300" y="115" width="70" height="70" rx="12" />
        </g>
        <g class="linha">
          <path d="M45 130h-14M45 150h-14M45 170h-14M370 130h14M370 150h14M370 170h14" />
        </g>
        <g class="rotulo pequeno">
          <text x="80" y="155" text-anchor="middle">GPT</text>
          <text x="165" y="155" text-anchor="middle">Claude</text>
          <text x="250" y="150" text-anchor="middle" class="forte">Auto</text>
          <text x="250" y="168" text-anchor="middle" class="forte">✓</text>
          <text x="335" y="155" text-anchor="middle">Qwen</text>
        </g>
      </template>

      <!-- Reasoning effort: velocímetro (baixo -> max). -->
      <template v-else-if="chave === 'velocimetro'">
        <path class="linha grossa" d="M110 210a95 95 0 0 1 180 0" fill="none" />
        <g class="tique linha">
          <path d="M112 196l-16-8M150 150l-12-12M200 132v-18M250 150l12-12M288 196l16-8" />
        </g>
        <line class="ponteiro cheio-traco" x1="200" y1="210" x2="255" y2="150" />
        <circle class="cheio" cx="200" cy="210" r="12" />
        <g class="rotulo pequeno">
          <text x="90" y="215" text-anchor="middle">baixo</text>
          <text x="310" y="215" text-anchor="middle">máx</text>
        </g>
      </template>

      <!-- Harness conceito: motor central com loop (contexto->plano->ferramenta->resultado). -->
      <template v-else-if="chave === 'motor-loop'">
        <g class="traco engrenagem-anima">
          <circle class="cheio" cx="200" cy="150" r="34" />
          <circle class="fundo" cx="200" cy="150" r="14" />
          <g class="linha grossa">
            <path d="M200 108v-14M200 206v-14M242 150h14M144 150h-14M230 120l10-10M170 180l-10 10M230 180l10 10M170 120l-10-10" />
          </g>
        </g>
        <g class="linha loop-seta" fill="none">
          <path d="M200 70a80 80 0 0 1 80 80" />
          <path d="M280 150a80 80 0 0 1 -80 80" />
          <path d="M200 230a80 80 0 0 1 -80 -80" />
          <path d="M120 150a80 80 0 0 1 80 -80" />
        </g>
        <g class="rotulo pequeno">
          <text x="200" y="56" text-anchor="middle">contexto</text>
          <text x="300" y="154" text-anchor="middle">plano</text>
          <text x="200" y="256" text-anchor="middle">ferramenta</text>
          <text x="96" y="154" text-anchor="middle">resultado</text>
        </g>
      </template>

      <!-- Harness do Kiro: motor central com portas ao redor ligadas por cabos. -->
      <template v-else-if="chave === 'motor-portas'">
        <circle class="cheio engrenagem-anima" cx="200" cy="150" r="30" />
        <circle class="fundo" cx="200" cy="150" r="12" />
        <text class="rotulo pequeno forte" x="200" y="196" text-anchor="middle">harness</text>
        <g class="traco fino">
          <rect class="borda" x="40" y="60" width="66" height="44" rx="6" />
          <rect class="borda" x="294" y="60" width="66" height="44" rx="6" />
          <rect class="borda" x="40" y="200" width="66" height="44" rx="6" />
          <rect class="borda" x="294" y="200" width="66" height="44" rx="6" />
          <path class="linha grossa cabo" d="M106 82C150 100 160 120 176 138M294 82C250 100 240 120 224 138M106 222C150 200 160 180 176 162M294 222C250 200 240 180 224 162" fill="none" />
        </g>
        <g class="rotulo pequeno">
          <text x="73" y="86" text-anchor="middle">IDE</text>
          <text x="327" y="86" text-anchor="middle">CLI</text>
          <text x="73" y="226" text-anchor="middle">Web</text>
          <text x="327" y="226" text-anchor="middle">Mobile</text>
        </g>
      </template>

      <!-- .kiro global: casinha (home ~/) com etiqueta de usuário viajando entre projetos. -->
      <template v-else-if="chave === 'casinha-usuario'">
        <g class="traco">
          <path class="cheio" d="M150 150l50-44 50 44v70h-100z" />
          <path class="linha grossa" d="M138 158l62-54 62 54" fill="none" />
          <rect class="fundo" x="188" y="180" width="24" height="40" rx="3" />
        </g>
        <text class="rotulo pequeno forte" x="200" y="130" text-anchor="middle">~/.kiro</text>
        <g class="traco fino">
          <circle class="borda" cx="70" cy="120" r="18" />
          <circle class="borda" cx="70" cy="200" r="18" />
          <circle class="borda" cx="330" cy="120" r="18" />
          <circle class="borda" cx="330" cy="200" r="18" />
          <path class="linha tracejada" d="M88 122h56M88 198h56M312 122h-56M312 198h-56" fill="none" />
        </g>
        <g class="rotulo pequeno">
          <text x="70" y="124" text-anchor="middle">proj</text>
          <text x="70" y="204" text-anchor="middle">proj</text>
          <text x="330" y="124" text-anchor="middle">proj</text>
          <text x="330" y="204" text-anchor="middle">proj</text>
        </g>
      </template>

      <!-- .kiro por projeto: pasta .kiro dentro de um repositório git do time. -->
      <template v-else-if="chave === 'pasta-git'">
        <g class="traco">
          <rect class="borda cheio-leve" x="90" y="80" width="220" height="160" rx="12" />
          <path class="linha" d="M90 116h220" />
          <path class="cheio" d="M120 140h40l10 14h70v54h-120z" />
          <text class="rotulo pequeno forte" x="185" y="182" text-anchor="middle">.kiro</text>
        </g>
        <g class="traco fino git">
          <circle class="cheio" cx="270" cy="150" r="8" />
          <circle class="cheio" cx="270" cy="200" r="8" />
          <circle class="cheio" cx="300" cy="175" r="8" />
          <path class="linha grossa" d="M270 158v34M270 175h22" fill="none" />
        </g>
        <text class="rotulo pequeno" x="200" y="104" text-anchor="middle">repositório do time</text>
      </template>

      <!-- Specs: três documentos em sequência (requisitos->design->tarefas). -->
      <template v-else-if="chave === 'tres-documentos'">
        <g class="traco">
          <rect class="borda cheio-leve" x="35" y="95" width="90" height="120" rx="8" />
          <rect class="borda cheio-leve" x="155" y="95" width="90" height="120" rx="8" />
          <rect class="borda cheio-leve" x="275" y="95" width="90" height="120" rx="8" />
        </g>
        <g class="linha">
          <path d="M50 120h60M50 138h60M50 156h44M170 120h60M170 138h60M170 156h44M290 120h60M290 138h60M290 156h44" />
        </g>
        <g class="linha grossa seta">
          <path d="M126 155h26M246 155h26" fill="none" />
        </g>
        <g class="rotulo pequeno forte">
          <text x="80" y="205" text-anchor="middle">requisitos</text>
          <text x="200" y="205" text-anchor="middle">design</text>
          <text x="320" y="205" text-anchor="middle">tarefas</text>
        </g>
      </template>

      <!-- Steering: bússola/leme guiando. -->
      <template v-else-if="chave === 'bussola'">
        <circle class="borda cheio-leve" cx="200" cy="150" r="76" />
        <circle class="fundo" cx="200" cy="150" r="60" />
        <g class="agulha-anima">
          <polygon class="cheio-traco norte" points="200,100 212,150 200,140 188,150" />
          <polygon class="borda" points="200,200 212,150 200,160 188,150" />
        </g>
        <circle class="cheio" cx="200" cy="150" r="7" />
        <g class="rotulo pequeno">
          <text x="200" y="92" text-anchor="middle">N</text>
          <text x="200" y="220" text-anchor="middle">S</text>
        </g>
      </template>

      <!-- Hooks: raio/gatilho disparando uma engrenagem (evento -> ação). -->
      <template v-else-if="chave === 'raio-engrenagem'">
        <path class="cheio-traco raio" d="M150 70l-40 90h34l-14 70 66-100h-38z" />
        <path class="linha grossa seta" d="M196 150h30" fill="none" />
        <g class="traco engrenagem-anima">
          <circle class="cheio" cx="280" cy="150" r="34" />
          <circle class="fundo" cx="280" cy="150" r="13" />
          <g class="linha grossa">
            <path d="M280 108v-12M280 204v-12M322 150h12M226 150h12M310 120l8-8M250 180l-8 8M310 180l8 8M250 120l-8-8" />
          </g>
        </g>
        <g class="rotulo pequeno">
          <text x="130" y="250" text-anchor="middle">evento</text>
          <text x="280" y="216" text-anchor="middle">ação</text>
        </g>
      </template>

      <!-- MCP: plugue/cabo conectando o agente a servidores. -->
      <template v-else-if="chave === 'plugue-servidores'">
        <circle class="cheio" cx="90" cy="150" r="34" />
        <text class="rotulo pequeno forte" x="90" y="155" text-anchor="middle">agente</text>
        <path class="linha grossa cabo" d="M124 150c40 0 40 -50 80 -50M124 150c40 0 40 50 80 50M124 150h80" fill="none" />
        <g class="traco fino">
          <rect class="borda cheio-leve" x="204" y="78" width="120" height="44" rx="8" />
          <rect class="borda cheio-leve" x="204" y="128" width="120" height="44" rx="8" />
          <rect class="borda cheio-leve" x="204" y="178" width="120" height="44" rx="8" />
        </g>
        <g class="pino cheio">
          <circle cx="210" cy="100" r="5" />
          <circle cx="210" cy="150" r="5" />
          <circle cx="210" cy="200" r="5" />
        </g>
        <g class="rotulo pequeno">
          <text x="272" y="105" text-anchor="middle">servidor</text>
          <text x="272" y="155" text-anchor="middle">servidor</text>
          <text x="272" y="205" text-anchor="middle">servidor</text>
        </g>
      </template>

      <!-- Skills: pacote/mochila de instruções abrindo sob demanda. -->
      <template v-else-if="chave === 'mochila-instrucoes'">
        <g class="traco">
          <path class="cheio" d="M140 130c0-24 20-40 60-40s60 16 60 40v90h-120z" />
          <path class="linha grossa" d="M170 130a30 30 0 0 1 60 0" fill="none" />
          <rect class="fundo tampa-anima" x="160" y="150" width="80" height="46" rx="8" />
        </g>
        <g class="linha folha-anima">
          <path d="M180 170h40M180 182h40" />
        </g>
        <text class="rotulo pequeno forte" x="200" y="238" text-anchor="middle">SKILL.md</text>
      </template>

      <!-- Powers: plugue com faísca ligando MCP + conhecimento. -->
      <template v-else-if="chave === 'plugue-faisca'">
        <g class="traco">
          <rect class="cheio" x="90" y="120" width="70" height="60" rx="10" />
          <path class="linha grossa" d="M160 138h26M160 162h26" fill="none" />
          <rect class="borda cheio-leve" x="240" y="120" width="80" height="60" rx="10" />
          <path class="linha grossa" d="M240 138h-16M240 162h-16" fill="none" />
        </g>
        <path class="cheio-traco faisca" d="M196 130l-14 26h16l-10 22 30-32h-18z" />
        <g class="rotulo pequeno">
          <text x="125" y="205" text-anchor="middle">MCP</text>
          <text x="280" y="205" text-anchor="middle">conhecimento</text>
        </g>
      </template>

      <!-- Checkpoints: linha do tempo com ponto de salvamento e seta de rewind. -->
      <template v-else-if="chave === 'linha-tempo-rewind'">
        <path class="linha grossa" d="M40 160h320" fill="none" />
        <g class="traco">
          <circle class="borda cheio-leve" cx="90" cy="160" r="10" />
          <circle class="cheio pulso" cx="180" cy="160" r="14" />
          <circle class="borda cheio-leve" cx="270" cy="160" r="10" />
          <circle class="borda cheio-leve" cx="345" cy="160" r="10" />
        </g>
        <path class="linha grossa rewind-seta" d="M270 110C210 90 150 90 96 116M96 116l14-6M96 116l6 14" fill="none" />
        <g class="rotulo pequeno">
          <text x="180" y="200" text-anchor="middle" class="forte">salvo</text>
          <text x="185" y="94" text-anchor="middle">voltar</text>
        </g>
      </template>

      <!-- Permissions: escudo/cadeado com semáforo deny > ask > allow. -->
      <template v-else-if="chave === 'escudo-semaforo'">
        <path class="borda cheio-leve" d="M120 90l0 60c0 44 30 66 60 78 30-12 60-34 60-78l0-60-60-20z" />
        <rect class="cheio" x="164" y="132" width="32" height="30" rx="4" />
        <path class="linha grossa" d="M167 132v-8a13 13 0 0 1 26 0v8" fill="none" />
        <g class="traco fino semaforo">
          <rect class="borda" x="262" y="96" width="40" height="108" rx="12" />
          <circle class="deny" cx="282" cy="122" r="12" />
          <circle class="ask" cx="282" cy="150" r="12" />
          <circle class="allow" cx="282" cy="178" r="12" />
        </g>
        <g class="rotulo pequeno">
          <text x="330" y="126" text-anchor="start">deny</text>
          <text x="330" y="154" text-anchor="start">ask</text>
          <text x="330" y="182" text-anchor="start">allow</text>
        </g>
      </template>

      <!-- Custom Agents: vários robôzinhos especializados + sub-agentes ramificando. -->
      <template v-else-if="chave === 'robos-especialistas'">
        <g class="traco">
          <rect class="cheio" x="160" y="70" width="80" height="60" rx="14" />
          <circle class="fundo" cx="184" cy="100" r="7" />
          <circle class="fundo" cx="216" cy="100" r="7" />
          <path class="linha grossa" d="M200 220v-90M200 175l-70 45M200 175l70 45" fill="none" />
        </g>
        <g class="traco fino">
          <rect class="borda cheio-leve" x="90" y="220" width="70" height="52" rx="12" />
          <rect class="borda cheio-leve" x="170" y="230" width="60" height="42" rx="12" />
          <rect class="borda cheio-leve" x="240" y="220" width="70" height="52" rx="12" />
          <circle class="cheio" cx="112" cy="242" r="5" />
          <circle class="cheio" cx="138" cy="242" r="5" />
          <circle class="cheio" cx="262" cy="242" r="5" />
          <circle class="cheio" cx="288" cy="242" r="5" />
          <circle class="cheio" cx="192" cy="250" r="4" />
          <circle class="cheio" cx="208" cy="250" r="4" />
        </g>
        <text class="rotulo pequeno forte" x="200" y="150" text-anchor="middle">sub-agentes</text>
      </template>

      <!-- Suporte a linguagens: símbolos de TS/Python/Java sob um "chapéu" do agente. -->
      <template v-else-if="chave === 'simbolos-linguagens'">
        <path class="cheio chapeu" d="M110 110h180l-30 -34h-120z" />
        <path class="linha grossa" d="M110 110h180" fill="none" />
        <g class="traco fino">
          <rect class="borda cheio-leve" x="70" y="150" width="72" height="72" rx="12" />
          <rect class="borda cheio-leve" x="164" y="150" width="72" height="72" rx="12" />
          <rect class="borda cheio-leve" x="258" y="150" width="72" height="72" rx="12" />
        </g>
        <g class="rotulo forte">
          <text x="106" y="194" text-anchor="middle">TS</text>
          <text x="200" y="194" text-anchor="middle">Py</text>
          <text x="294" y="194" text-anchor="middle">Jv</text>
        </g>
      </template>

      <!-- CLI: janela de terminal com prompt. -->
      <template v-else-if="chave === 'terminal'">
        <rect class="borda cheio-leve" x="60" y="72" width="280" height="156" rx="12" />
        <path class="linha" d="M60 102h280" />
        <circle class="fundo" cx="80" cy="87" r="4" />
        <circle class="fundo" cx="94" cy="87" r="4" />
        <circle class="fundo" cx="108" cy="87" r="4" />
        <g class="linha grossa">
          <path class="prompt" d="M84 134l18 14-18 14" fill="none" />
          <path d="M116 162h60" />
        </g>
        <rect class="cheio piscando" x="188" y="148" width="10" height="20" />
        <text class="rotulo pequeno forte" x="84" y="205" text-anchor="start">kiro ~ $</text>
      </template>

      <!-- Web: navegador entregando um pull request. -->
      <template v-else-if="chave === 'navegador-pr'">
        <rect class="borda cheio-leve" x="50" y="70" width="220" height="150" rx="12" />
        <path class="linha" d="M50 100h220" />
        <circle class="fundo" cx="68" cy="85" r="4" />
        <circle class="fundo" cx="82" cy="85" r="4" />
        <rect class="fundo" x="100" y="80" width="150" height="10" rx="5" />
        <g class="traco fino git">
          <circle class="cheio" cx="140" cy="150" r="9" />
          <circle class="cheio" cx="140" cy="195" r="9" />
          <circle class="cheio" cx="185" cy="172" r="9" />
          <path class="linha grossa" d="M140 159v27M140 172h36" fill="none" />
        </g>
        <path class="linha grossa seta entrega-anima" d="M270 150h60M322 142l8 8-8 8" fill="none" />
        <g class="traco">
          <rect class="cheio" x="300" y="130" width="70" height="44" rx="8" />
          <text class="rotulo pequeno forte inverso" x="335" y="157" text-anchor="middle">PR</text>
        </g>
      </template>

      <!-- Mobile: celular com sessão do agente. -->
      <template v-else-if="chave === 'celular-sessao'">
        <rect class="borda cheio-leve" x="150" y="56" width="100" height="188" rx="18" />
        <path class="linha" d="M150 82h100M150 224h100" />
        <circle class="fundo" cx="200" cy="234" r="6" />
        <g class="traco">
          <rect class="cheio balao" x="164" y="100" width="56" height="24" rx="8" />
          <rect class="borda cheio-leve balao-2" x="180" y="134" width="56" height="24" rx="8" />
          <circle class="cheio" cx="176" cy="182" r="10" />
        </g>
        <g class="linha">
          <path d="M172 176h8M172 182h8M172 188h8" />
        </g>
        <text class="rotulo pequeno forte" x="200" y="205" text-anchor="middle">sessão</text>
      </template>

      <!-- Crew: equipe de robôs rodando no hardware pessoal. -->
      <template v-else-if="chave === 'equipe-robos'">
        <g class="traco">
          <rect class="cheio" x="90" y="110" width="56" height="48" rx="12" />
          <rect class="cheio" x="172" y="96" width="56" height="48" rx="12" />
          <rect class="cheio" x="254" y="110" width="56" height="48" rx="12" />
          <circle class="fundo" cx="108" cy="132" r="6" />
          <circle class="fundo" cx="128" cy="132" r="6" />
          <circle class="fundo" cx="190" cy="118" r="6" />
          <circle class="fundo" cx="210" cy="118" r="6" />
          <circle class="fundo" cx="272" cy="132" r="6" />
          <circle class="fundo" cx="292" cy="132" r="6" />
        </g>
        <g class="traco fino">
          <rect class="borda cheio-leve" x="80" y="188" width="240" height="20" rx="6" />
          <rect class="borda" x="150" y="208" width="100" height="30" rx="4" />
        </g>
        <text class="rotulo pequeno forte" x="200" y="204" text-anchor="middle">seu hardware</text>
      </template>
    </svg>
  </div>
</template>

<style scoped>
/*
  Camada de fundo posicionada em absoluto atrás do conteúdo do cartão.
  Não captura eventos e é ignorada por leitores de tela (aria-hidden no HTML).
*/
.ilustracao-fundo {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
}

.ilustracao-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  /* Sutil: o desenho é uma "marca d'água" conceitual, não decoração forte. */
  opacity: 0.16;
  filter: blur(0.2px);
}

/*
  Modo WALLPAPER: o SVG ocupa o fundo do palco em tela cheia. Sem overlay
  interno (o palco já escurece para legibilidade). Opacidade um pouco maior
  que no card para o desenho "aparecer" como ambiente, mas ainda discreto o
  suficiente para os cartões continuarem em primeiro plano.
*/
.ilustracao-fundo--wallpaper .ilustracao-svg {
  opacity: 0.22;
  filter: none;
}

/*
  Overlay de contraste: escurece levemente o fundo e cria um foco central
  para o texto permanecer legível sobre o desenho.
*/
.ilustracao-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(120% 90% at 50% 40%, rgba(13, 19, 34, 0.35), rgba(13, 19, 34, 0.72) 85%);
}

/* --- Paleta herdada da camada (var(--cor)/var(--cor-forte)) --------------- */
.cheio {
  fill: var(--cor, #8b7bf0);
}
.cheio-leve {
  fill: color-mix(in srgb, var(--cor, #8b7bf0) 28%, transparent);
}
.fundo {
  fill: #0d1322;
}
.borda {
  fill: none;
  stroke: var(--cor-forte, #a78bfa);
  stroke-width: 3;
}
.destaque-borda {
  stroke: var(--cor-forte, #a78bfa);
  stroke-width: 4;
}
.linha {
  fill: none;
  stroke: var(--cor-forte, #a78bfa);
  stroke-width: 3;
  stroke-linecap: round;
}
.linha.fino {
  stroke-width: 2;
}
.linha.grossa {
  stroke-width: 4;
}
.tracejada {
  stroke-dasharray: 6 6;
}
.cheio-traco {
  fill: var(--cor, #8b7bf0);
  stroke: var(--cor-forte, #a78bfa);
  stroke-width: 2;
  stroke-linejoin: round;
}
.ponteiro {
  stroke: var(--cor-forte, #a78bfa);
  stroke-width: 6;
  stroke-linecap: round;
}
.norte {
  fill: var(--cor-forte, #a78bfa);
}

/* Semáforo das permissions: cores semânticas fixas (didáticas). */
.semaforo .deny {
  fill: #f87171;
}
.semaforo .ask {
  fill: #fbbf24;
}
.semaforo .allow {
  fill: #34d399;
}

/* --- Rótulos internos (pt-BR), pequenos e discretos ---------------------- */
.rotulo text {
  fill: #f5f7ff;
  font-family: var(--fonte-texto, sans-serif);
  font-size: 13px;
  font-weight: 600;
}
.rotulo.pequeno text,
.rotulo .pequeno {
  font-size: 12px;
}
.rotulo .forte,
.rotulo.forte text {
  fill: var(--cor-forte, #a78bfa);
  font-weight: 700;
}
.rotulo .inverso {
  fill: #0d1322;
}

/* --- Animações SUTIS (desativadas em prefers-reduced-motion) -------------- */
.engrenagem-anima {
  transform-origin: 200px 150px;
  animation: girar 14s linear infinite;
}
.raio-engrenagem .engrenagem-anima {
  transform-origin: 280px 150px;
}
.agulha-anima {
  transform-origin: 200px 150px;
  animation: oscilar 6s ease-in-out infinite;
}
.piscando {
  animation: piscar 1.3s steps(1) infinite;
}
.pulso {
  animation: pulsar 2.6s ease-in-out infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}
@keyframes oscilar {
  0%,
  100% {
    transform: rotate(-12deg);
  }
  50% {
    transform: rotate(12deg);
  }
}
@keyframes piscar {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
@keyframes pulsar {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

/*
  Acessibilidade: sob prefers-reduced-motion o movimento é puramente estético,
  então desligamos todas as animações desta camada. O desenho continua legível
  e a leitura da metáfora não depende de movimento.
*/
@media (prefers-reduced-motion: reduce) {
  .engrenagem-anima,
  .agulha-anima,
  .piscando,
  .pulso {
    animation: none;
  }
}
</style>
