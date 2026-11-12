<script setup>
import { useClinic } from '../../stores/clinic';
import { ME_VET, TIMES } from '../../lib/constants';
import { iso, wday, dnum } from '../../lib/dates';

defineProps({
  /** Seis fechas ISO, de lunes a sábado. */
  days: { type: Array, required: true }
});
const emit = defineEmits(['pick']);
const clinic = useClinic();
const today = iso(0);

const cell = (date, time) =>
  clinic.appts.find((a) => a.vetId === ME_VET && a.date === date && a.time === time && a.status !== 'cancelled');
</script>

<template>
  <div class="panel">
    <div class="wk-scroll">
      <table class="wk">
        <thead>
          <tr>
            <th scope="col"><span class="sr">Hora</span></th>
            <th v-for="d in days" :key="d" scope="col" :class="{ today: d === today }">{{ wday(d) }} {{ dnum(d) }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in TIMES" :key="t">
            <th scope="row">{{ t }}</th>
            <td v-for="d in days" :key="d">
              <template v-if="cell(d, t)">
                <button
                  type="button"
                  class="chip"
                  :class="['st-' + cell(d, t).status, { urgent: cell(d, t).urgency === 'urgent' }]"
                  @click="emit('pick', d)"
                >
                  {{ clinic.petName(cell(d, t).petId) }}{{ cell(d, t).mode === 'tele' ? ' · Video' : '' }}
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="legend">Línea discontinua: por confirmar. Franja roja: urgente. Toca una cita para abrir su día.</p>
  </div>
</template>
