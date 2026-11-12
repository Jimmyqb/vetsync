<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { URG, MAX_FILES } from '../../lib/constants';
import { bookingDays, fmt, wday, mon, dnum } from '../../lib/dates';
import ThumbGrid from '../shared/ThumbGrid.vue';
import ImagePicker from '../shared/ImagePicker.vue';

const clinic = useClinic();
const ui = useUi();

const editing = ui.reschedId ? clinic.apptById(ui.reschedId) : null;
const days = bookingDays();

const form = reactive({
  petId: editing ? editing.petId : ui.bookPetId || clinic.myPets[0]?.id || '',
  vetId: editing ? editing.vetId : clinic.activeVets[0]?.id || '',
  mode: editing ? editing.mode : 'in',
  urgency: editing ? editing.urgency : 'routine',
  reason: editing ? editing.reason : '',
  files: editing ? editing.files.slice() : [],
  date: editing && days.includes(editing.date) ? editing.date : days[0],
  time: ''
});
ui.bookPetId = null;

const tried = ref(false);
const slots = computed(() => clinic.slotsFor(form.vetId, form.date, ui.reschedId));
const dayOff = computed(() => slots.value.every((s) => s.off));
const reasonTooShort = computed(() => form.reason.trim().length < 5);

// Al cambiar de veterinario o de día, la hora elegida deja de ser válida.
watch(() => [form.vetId, form.date], () => { form.time = ''; });

const removeFile = (id) => { form.files = form.files.filter((f) => f.id !== id); };

function submit() {
  tried.value = true;
  if (reasonTooShort.value || !form.date || !form.time) return;
  const slot = slots.value.find((s) => s.t === form.time);
  if (!slot || slot.taken || slot.off) {
    ui.notify('Esa hora ya no está disponible, elige otra');
    form.time = '';
    return;
  }
  const data = {
    petId: form.petId, vetId: form.vetId, date: form.date, time: form.time,
    mode: form.mode, urgency: form.urgency, reason: form.reason.trim(), files: form.files
  };
  if (editing) {
    clinic.reschedule(editing.id, data);
    ui.notify(`Cita reprogramada para ${fmt(form.date)} a las ${form.time}`);
  } else {
    clinic.createAppointment(data);
    ui.notify(`Cita solicitada para ${fmt(form.date)} a las ${form.time}`);
  }
  ui.finishBooking();
}
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>{{ editing ? 'Reprogramar cita' : 'Agendar cita' }}</h1>
        <p>
          {{ editing ? 'Elige un nuevo día y hora. La clínica confirmará de nuevo la cita.' : 'Elige a tu mascota, el tipo de consulta y un horario libre.' }}
        </p>
      </div>
    </div>

    <form class="book-grid" novalidate @submit.prevent="submit">
      <div class="panel">
        <div class="field">
          <label for="f-pet">Mascota</label>
          <select id="f-pet" v-model="form.petId" :disabled="!!editing">
            <option v-for="p in clinic.myPets" :key="p.id" :value="p.id">{{ p.name }} ({{ p.species.toLowerCase() }}, {{ p.breed }})</option>
          </select>
        </div>

        <div class="field">
          <span id="l-mode" class="lbl">Tipo de consulta</span>
          <div class="choices" role="group" aria-labelledby="l-mode">
            <button type="button" class="choice" :aria-pressed="form.mode === 'in'" @click="form.mode = 'in'">
              <b>En la clínica</b><span>Exploración, vacunas, estudios</span>
            </button>
            <button type="button" class="choice" :aria-pressed="form.mode === 'tele'" @click="form.mode = 'tele'">
              <b>Videoconsulta</b><span>Seguimiento, dudas, resultados</span>
            </button>
          </div>
        </div>

        <div class="field">
          <span id="l-urg" class="lbl">Urgencia</span>
          <div class="choices" style="grid-template-columns: repeat(3, 1fr)" role="group" aria-labelledby="l-urg">
            <button v-for="(label, k) in URG" :key="k" type="button" class="choice" :aria-pressed="form.urgency === k" @click="form.urgency = k">
              <b>{{ label }}</b>
            </button>
          </div>
        </div>
        <div v-if="form.urgency === 'urgent'" class="alert" role="alert">
          Si tu mascota respira con dificultad, convulsiona, sangra o no puede levantarse, llévala a la clínica ahora. Una videoconsulta no sustituye una emergencia.
        </div>

        <div class="field">
          <label for="f-reason">Motivo de la consulta</label>
          <textarea id="f-reason" v-model="form.reason" placeholder="Ej. Desde ayer cojea de la pata trasera derecha"></textarea>
          <span v-if="tried && reasonTooShort" class="err">Cuéntanos el motivo en pocas palabras.</span>
        </div>

        <div class="field">
          <span class="lbl">Fotos o estudios (opcional)</span>
          <ThumbGrid v-if="form.files.length" :files="form.files" by="owner" @remove="removeFile" />
          <div>
            <ImagePicker input-id="f-files" by="owner" :count="form.files.length" @add="(f) => form.files.push(f)" />
          </div>
          <span class="hint">Una foto de la zona afectada ayuda al veterinario. Hasta {{ MAX_FILES }} imágenes.</span>
        </div>

        <div class="field" style="margin-bottom: 0">
          <label for="f-vet">Veterinario</label>
          <select id="f-vet" v-model="form.vetId">
            <option v-for="v in clinic.activeVets" :key="v.id" :value="v.id">{{ v.name }} · {{ v.spec }}</option>
          </select>
        </div>
      </div>

      <div class="panel">
        <div class="field">
          <span id="l-day" class="lbl">Día</span>
          <div class="days" role="group" aria-labelledby="l-day">
            <button v-for="d in days" :key="d" type="button" class="day" :aria-pressed="form.date === d" @click="form.date = d">
              <small>{{ wday(d) }}</small><b>{{ dnum(d) }}</b><small>{{ mon(d) }}</small>
            </button>
          </div>
        </div>

        <div class="field">
          <span id="l-time" class="lbl">Hora</span>
          <div class="slots" role="group" aria-labelledby="l-time">
            <button
              v-for="s in slots"
              :key="s.t"
              type="button"
              class="slot"
              :class="{ taken: s.taken }"
              :disabled="s.taken || s.past || s.off"
              :aria-pressed="form.time === s.t"
              @click="form.time = s.t"
            >
              {{ s.t }}
            </button>
          </div>
          <span class="hint">Tachadas: ya están ocupadas. Atenuadas: fuera del horario del veterinario.</span>
          <span v-if="dayOff" class="err">{{ clinic.vetName(form.vetId) }} no atiende ese día. Elige otro día u otro veterinario.</span>
          <span v-if="tried && !form.time" class="err">Elige una hora.</span>
        </div>

        <div class="panel" style="background: var(--sunk); border: 0; margin-bottom: 16px">
          <p class="meta" style="margin-bottom: 4px">Resumen</p>
          <p v-if="form.time">
            <b>{{ clinic.petName(form.petId) }}</b> · {{ fmt(form.date) }} a las <span class="mono">{{ form.time }}</span>
          </p>
          <p v-else class="muted">Aún no has elegido la hora.</p>
          <p class="meta">{{ clinic.vetName(form.vetId) }} · {{ form.mode === 'tele' ? 'Videoconsulta' : 'En la clínica' }}</p>
        </div>

        <button class="btn primary" type="submit" style="width: 100%; padding: 12px">
          {{ editing ? 'Guardar nuevo horario' : 'Solicitar cita' }}
        </button>
        <button v-if="editing" class="btn ghost" type="button" style="width: 100%; margin-top: 8px" @click="ui.finishBooking()">
          Cancelar el cambio
        </button>
        <p class="hint" style="margin-top: 8px">
          {{ editing ? 'La clínica confirmará de nuevo el nuevo horario.' : 'La clínica la confirmará y verás el cambio en tu resumen.' }}
        </p>
      </div>
    </form>
  </section>
</template>
