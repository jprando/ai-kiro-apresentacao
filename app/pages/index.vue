<script setup lang="ts">
// Página inicial: renderiza o palco da apresentação.
//
// O VueFlow acessa `window`/`document`, portanto o palco é um componente
// .client renderizado somente no cliente, dentro de <ClientOnly>.
// Ver docs do Vue Flow: https://vueflow.dev/
</script>

<template>
  <div class="apresentacao-tela">
    <ClientOnly>
      <PalcoApresentacao />
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
