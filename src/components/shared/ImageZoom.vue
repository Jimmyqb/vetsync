<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { useUi } from '../../stores/ui';

const ui = useUi();
const onKey = (e) => { if (e.key === 'Escape') ui.zoom = null; };

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div v-if="ui.zoom" class="zoom" role="dialog" aria-label="Foto ampliada" @click="ui.zoom = null">
    <img :src="ui.zoom.data" :alt="ui.zoom.name" />
    <p>{{ ui.zoom.name }}</p>
    <button class="btn" type="button" @click="ui.zoom = null">Cerrar</button>
  </div>
</template>
