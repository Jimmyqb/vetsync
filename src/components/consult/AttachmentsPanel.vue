<script setup>
import { MAX_FILES } from '../../lib/constants';
import { useUi } from '../../stores/ui';
import ThumbGrid from '../shared/ThumbGrid.vue';
import ImagePicker from '../shared/ImagePicker.vue';

const props = defineProps({ appt: { type: Object, required: true } });
const ui = useUi();

const remove = (id) => {
  const i = props.appt.files.findIndex((f) => f.id === id);
  if (i >= 0) props.appt.files.splice(i, 1);
};
</script>

<template>
  <div class="panel">
    <h2>Fotos y estudios</h2>
    <p v-if="!appt.files.length" class="empty">Aún no hay imágenes en esta cita.</p>
    <ThumbGrid v-else :files="appt.files" :by="ui.role" @remove="remove" />
    <ImagePicker input-id="room-file" :by="ui.role" :count="appt.files.length" @add="(f) => appt.files.push(f)" />
    <p class="hint" style="margin-top: 8px">Hasta {{ MAX_FILES }} imágenes por cita. Toca una para verla grande.</p>
  </div>
</template>
