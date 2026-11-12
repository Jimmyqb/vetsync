<script setup>
import { ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';

const props = defineProps({
  appt: { type: Object, required: true },
  pet: { type: Object, required: true }
});
const clinic = useClinic();
const ui = useUi();
const micOn = ref(true);
const camOn = ref(true);

function simulateVetJoin() {
  clinic.startConsult(props.appt.id);
  ui.notify('El veterinario entró a la sala');
}
</script>

<template>
  <div class="panel wait">
    <span class="tag">Sala de espera</span>
    <h2>Tu veterinario te atenderá en breve</h2>
    <p class="muted">
      {{ clinic.vetName(appt.vetId) }} te recibirá a las <span class="mono">{{ appt.time }}</span>. Deja esta pantalla abierta: la videollamada empieza cuando inicie la consulta.
    </p>
    <p class="state"><i class="dot"></i> Esperando al veterinario</p>
    <ul class="check">
      <li>Ten a {{ pet.name }} cerca y con buena luz.</li>
      <li>Busca un lugar con buena señal de internet.</li>
      <li>Si tienes fotos o estudios, súbelos en la sección de abajo.</li>
    </ul>
    <div class="controls" style="margin-top: 0">
      <button class="btn" type="button" :aria-pressed="micOn" @click="micOn = !micOn">{{ micOn ? 'Silenciar' : 'Activar micrófono' }}</button>
      <button class="btn" type="button" :aria-pressed="camOn" @click="camOn = !camOn">{{ camOn ? 'Apagar cámara' : 'Encender cámara' }}</button>
      <button class="btn ghost" type="button" @click="ui.leaveConsult()">Salir de la sala</button>
    </div>
    <div>
      <button class="btn primary" type="button" @click="simulateVetJoin">Simular: el veterinario inicia la consulta</button>
      <p class="sim">Solo para el prototipo. En la versión real la videollamada empieza sola cuando el veterinario inicia la consulta.</p>
    </div>
  </div>
</template>
