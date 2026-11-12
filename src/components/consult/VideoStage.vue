<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { initials } from '../../lib/format';

const props = defineProps({
  appt: { type: Object, required: true },
  pet: { type: Object, required: true }
});
const clinic = useClinic();
const ui = useUi();

const micOn = ref(true);
const camOn = ref(true);
const secs = ref(0);
let timer = null;

onMounted(() => { timer = setInterval(() => { secs.value++; }, 1000); });
onBeforeUnmount(() => clearInterval(timer));

const clock = computed(() => `${String(Math.floor(secs.value / 60)).padStart(2, '0')}:${String(secs.value % 60).padStart(2, '0')}`);
// Quien mira ve a la otra persona.
const other = computed(() => (ui.role === 'vet' ? props.pet.owner : clinic.vetName(props.appt.vetId)));
</script>

<template>
  <div class="panel">
    <div class="stage">
      <span class="live"><i></i> En vivo {{ clock }}</span>
      <div class="avatar big">{{ initials(other) }}</div>
      <p class="who">{{ other }}</p>
      <div class="self">{{ camOn ? 'Tú' : 'Cámara apagada' }}</div>
    </div>
    <div class="controls">
      <button class="btn" type="button" :aria-pressed="micOn" @click="micOn = !micOn">{{ micOn ? 'Silenciar' : 'Activar micrófono' }}</button>
      <button class="btn" type="button" :aria-pressed="camOn" @click="camOn = !camOn">{{ camOn ? 'Apagar cámara' : 'Encender cámara' }}</button>
      <button class="btn danger" type="button" @click="ui.leaveConsult()">Salir de la sala</button>
    </div>
    <p class="sim">Video simulado en este prototipo. En la versión real esta zona se conecta con un servicio de video por WebRTC.</p>
  </div>
</template>
