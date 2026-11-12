<script setup>
import { useUi } from '../../stores/ui';

const ui = useUi();
</script>

<template>
  <nav class="tabs" aria-label="Secciones">
    <button v-for="t in ui.tabs" :key="t.id" type="button" :class="{ on: ui.view === t.id }" @click="ui.go(t.id)">
      {{ t.label }}
    </button>
  </nav>
</template>
