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
const error = ref('');

function finish() {
  error.value = clinic.finishConsult(props.appt.id) || '';
  if (error.value) return;
  ui.notify('Consulta finalizada y guardada en el historial');
  ui.leaveConsult();
}
</script>

<template>
  <form class="panel" novalidate @submit.prevent="finish">
    <span class="tag">Nota clínica</span>
    <h2 style="margin: 4px 0 16px">Registro de la consulta</h2>

    <div class="two">
      <div class="field">
        <label for="n-w">Peso (kg)</label>
        <input id="n-w" v-model.number="appt.draft.weight" type="number" step="0.1" min="0.1" />
      </div>
      <div class="field">
        <label for="n-t">Temperatura (°C)</label>
        <input id="n-t" v-model="appt.draft.temp" type="number" step="0.1" placeholder="Opcional" />
      </div>
    </div>

    <div class="field">
      <label for="n-s">Subjetivo (lo que cuenta el dueño)</label>
      <textarea id="n-s" v-model="appt.draft.s"></textarea>
    </div>
    <div class="field">
      <label for="n-o">Objetivo (hallazgos de la exploración)</label>
      <textarea id="n-o" v-model="appt.draft.o"></textarea>
    </div>
    <div class="field">
      <label for="n-dx">Diagnóstico</label>
      <input id="n-dx" v-model="appt.draft.dx" type="text" />
      <span v-if="error" class="err">{{ error }}</span>
    </div>
    <div class="field">
      <label for="n-p">Plan y receta</label>
      <textarea id="n-p" v-model="appt.draft.plan" placeholder="Medicamento, dosis por peso, duración, indicaciones"></textarea>
    </div>
    <div class="field">
      <label for="n-f">Seguimiento</label>
      <select id="n-f" v-model="appt.draft.follow">
        <option value="">Sin seguimiento</option>
        <option value="1 semana">Revisión en 1 semana</option>
        <option value="2 semanas">Revisión en 2 semanas</option>
        <option value="1 mes">Revisión en 1 mes</option>
      </select>
    </div>

    <button class="btn primary" type="submit" style="width: 100%; padding: 12px">Finalizar consulta</button>
    <p class="hint" style="margin-top: 8px">El borrador se guarda solo. Al finalizar, la nota pasa al historial de {{ pet.name }}.</p>
  </form>
</template>
