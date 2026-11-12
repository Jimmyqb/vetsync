<script setup>
import { computed, ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { ME_VET, URG } from '../../lib/constants';
import { iso, byTime, wday, dnum, dm, longDate, greeting, weekDates } from '../../lib/dates';
import { filesText } from '../../lib/format';
import StatusPill from '../shared/StatusPill.vue';
import WeekCalendar from './WeekCalendar.vue';

const clinic = useClinic();
const ui = useUi();

const mode = ref('day');
const weekOff = ref(0);
const date = ref(iso(0));

const mine = computed(() => clinic.appts.filter((a) => a.vetId === ME_VET && a.status !== 'cancelled'));
const stats = computed(() => {
  const today = mine.value.filter((a) => a.date === iso(0));
  return {
    today: today.length,
    tele: today.filter((a) => a.mode === 'tele').length,
    pending: mine.value.filter((a) => a.status === 'pending').length
  };
});
const dayList = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = iso(i);
    return { date: d, today: i === 0, count: mine.value.filter((a) => a.date === d).length };
  })
);
const items = computed(() => mine.value.filter((a) => a.date === date.value).sort(byTime));
const week = computed(() => weekDates(weekOff.value));
const weekLabel = computed(() => `${dm(week.value[0])} a ${dm(week.value[5])}`);

function pickDay(d) {
  date.value = d;
  mode.value = 'day';
}
const setStatus = (a, status) => ui.notify(clinic.setStatus(a.id, status));
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>{{ greeting() }}, Dra. Ortega</h1>
        <p>{{ mode === 'week' ? 'Vista semanal' : 'Agenda de ' + longDate(date) }}</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat"><b>{{ stats.today }}</b><span>Citas hoy</span></div>
      <div class="stat"><b>{{ stats.tele }}</b><span>Videoconsultas hoy</span></div>
      <div class="stat"><b>{{ stats.pending }}</b><span>Por confirmar</span></div>
    </div>

    <div class="bar">
      <div class="seg" role="group" aria-label="Vista de la agenda">
        <button type="button" :class="{ on: mode === 'day' }" :aria-pressed="mode === 'day'" @click="mode = 'day'">Día</button>
        <button type="button" :class="{ on: mode === 'week' }" :aria-pressed="mode === 'week'" @click="mode = 'week'">Semana</button>
      </div>
      <div v-if="mode === 'week'" class="weeknav">
        <button class="btn" type="button" aria-label="Semana anterior" @click="weekOff--">←</button>
        <span class="lbl-w">{{ weekLabel }}</span>
        <button class="btn" type="button" aria-label="Semana siguiente" @click="weekOff++">→</button>
        <button v-if="weekOff !== 0" class="btn ghost" type="button" @click="weekOff = 0">Esta semana</button>
      </div>
    </div>

    <div v-if="mode === 'day'" class="days" style="margin-bottom: 16px" role="group" aria-label="Día de la agenda">
      <button v-for="d in dayList" :key="d.date" type="button" class="day" :aria-pressed="date === d.date" @click="date = d.date">
        <small>{{ d.today ? 'Hoy' : wday(d.date) }}</small><b>{{ dnum(d.date) }}</b>
        <span class="cnt">{{ d.count }} {{ d.count === 1 ? 'cita' : 'citas' }}</span>
      </button>
    </div>

    <WeekCalendar v-if="mode === 'week'" :days="week" @pick="pickDay" />

    <div v-else class="panel">
      <p v-if="!items.length" class="empty">No hay citas este día.</p>
      <ul v-else class="appts">
        <li v-for="a in items" :key="a.id" class="appt" :class="{ urgent: a.urgency === 'urgent' }">
          <div class="when">
            <strong class="mono" style="font-size: 18px">{{ a.time }}</strong>
            <span>{{ a.mode === 'tele' ? 'Video' : 'Clínica' }}</span>
          </div>
          <div class="what">
            <div class="line1">
              <b>{{ clinic.petName(a.petId) }}</b>
              <span class="meta">{{ clinic.petOf(a.petId).owner }}</span>
              <StatusPill :status="a.status" />
              <span v-if="a.urgency !== 'routine'" class="pill" :class="'u-' + a.urgency">{{ URG[a.urgency] }}</span>
              <span v-if="a.waiting && a.status === 'confirmed'" class="pill u-soon">Cliente en sala de espera</span>
              <span v-if="a.files.length" class="meta">{{ filesText(a) }}</span>
            </div>
            <p>{{ a.reason }}</p>
            <p v-if="a.result" class="dx"><b>Diagnóstico:</b> {{ a.result.dx }}</p>
          </div>
          <div class="acts">
            <template v-if="a.status === 'pending'">
              <button class="btn primary" type="button" @click="setStatus(a, 'confirmed')">Confirmar</button>
              <button class="btn ghost" type="button" @click="setStatus(a, 'cancelled')">Rechazar</button>
            </template>
            <button v-if="a.status === 'confirmed'" class="btn primary" type="button" @click="ui.startConsult(a)">Iniciar consulta</button>
            <button v-if="a.status === 'live'" class="btn primary" type="button" @click="ui.openConsult(a)">Continuar consulta</button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
