<script setup>
import { ref } from 'vue';
import { MAX_FILES } from '../../lib/constants';
import { readImage } from '../../lib/images';
import { useUi } from '../../stores/ui';

const props = defineProps({
  /** Cuántas imágenes tiene ya la cita, para respetar el máximo. */
  count: { type: Number, default: 0 },
  by: { type: String, default: '' },
  inputId: { type: String, default: undefined }
});
const emit = defineEmits(['add']);
const ui = useUi();
const input = ref(null);

async function onChange(e) {
  const picked = Array.from(e.target.files || []);
  e.target.value = '';
  let count = props.count;
  let skipped = 0;
  for (const file of picked) {
    if (!file.type.startsWith('image/')) { skipped++; continue; }
    if (count >= MAX_FILES) { ui.notify(`Máximo ${MAX_FILES} imágenes por cita`); break; }
    try {
      const data = await readImage(file);
      emit('add', { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: file.name, data, by: props.by });
      count++;
    } catch (err) {
      skipped++;
    }
  }
  if (skipped) ui.notify('Solo se aceptan imágenes (JPG o PNG)');
}
</script>

<template>
  <input :id="inputId" ref="input" type="file" accept="image/*" multiple hidden @change="onChange" />
  <button class="btn" type="button" @click="input.click()">Agregar foto</button>
</template>
