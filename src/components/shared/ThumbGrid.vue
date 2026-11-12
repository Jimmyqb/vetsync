<script setup>
import { useUi } from '../../stores/ui';

defineProps({
  files: { type: Array, required: true },
  /** Rol de quien mira. Solo puede quitar las fotos que subió él mismo. */
  by: { type: String, default: '' }
});
const emit = defineEmits(['remove']);
const ui = useUi();
</script>

<template>
  <ul class="thumbs">
    <li v-for="f in files" :key="f.id">
      <button type="button" class="thumb" :aria-label="'Ampliar ' + f.name" @click="ui.zoom = f">
        <img :src="f.data" :alt="f.name" />
      </button>
      <button v-if="f.by === by" type="button" class="rm" :aria-label="'Quitar ' + f.name" @click="emit('remove', f.id)">×</button>
    </li>
  </ul>
</template>
