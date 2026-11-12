<script setup>
import { computed, ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { URG } from '../../lib/constants';
import { iso, byTime, wday, dnum } from '../../lib/dates';
import { filesText } from '../../lib/format';
import StatusPill from '../shared/StatusPill.vue';

const clinic = useClinic();
const ui = useUi();
const date = ref(iso(0));

const active = computed(() => clinic.appts.filter((a) => a.status !== 'cancelled'));
const dayList = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = iso(i);
    return { date: d, today: i === 0, count: active.value.filter((a) => a.date === d).length };
  })
);
const items = computed(() => active.value.filter((a) => a.date === date.value).sort(byTime));
const setStatus = (a, status) => ui.notify(clinic.setStatus(a.id, status));
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>Agenda general</h1>
        <p>Todas las citas de la clínica, de todos los veterinarios.</p>
      </div>
    </div>

    <div class="days" style="margin-bottom: 16px" role="group" aria-label="Día de la agenda general">
      <button v-for="d in dayList" :key="d.date" type="button" class="day" :aria-pressed="date === d.date" @click="date = d.date">
        <small>{{ d.today ? 'Hoy' : wday(d.date) }}</small><b>{{ dnum(d.date) }}</b>
        <span class="cnt">{{ d.count }} {{ d.count === 1 ? 'cita' : 'citas' }}</span>
      </button>
    </div>

    <div class="panel">
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
            </div>
            <p>{{ a.reason }}</p>
            <p class="meta">{{ clinic.vetName(a.vetId) }}<template v-if="a.files.length"> · {{ filesText(a) }}</template></p>
          </div>
          <div class="acts">
            <template v-if="a.status === 'pending'">
              <button class="btn primary" type="button" @click="setStatus(a, 'confirmed')">Confirmar</button>
              <button class="btn ghost" type="button" @click="setStatus(a, 'cancelled')">Rechazar</button>
            </template>
            <button v-if="a.status === 'confirmed'" class="btn ghost" type="button" @click="setStatus(a, 'cancelled')">Cancelar</button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
