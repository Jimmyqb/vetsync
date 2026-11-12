<script setup>
import { reactive, ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { TIMES, WEEK } from '../../lib/constants';
import { initials } from '../../lib/format';

const clinic = useClinic();
const ui = useUi();
const newVet = reactive({ name: '', spec: '' });
const error = ref('');

function addVet() {
  error.value = clinic.addVet(newVet.name, newVet.spec) || '';
  if (error.value) return;
  newVet.name = '';
  newVet.spec = '';
  ui.notify('Veterinario agregado');
}
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>Veterinarios y horarios</h1>
        <p>Lo que definas aquí controla qué horas ven los clientes al agendar.</p>
      </div>
    </div>

    <div class="cards">
      <article v-for="v in clinic.vets" :key="v.id" class="panel pet">
        <div class="pet-top">
          <div class="avatar">{{ initials(v.name) }}</div>
          <div>
            <h2>{{ v.name }}</h2>
            <p class="meta">{{ v.spec }}</p>
          </div>
          <span class="pill" :class="v.active ? 's-done' : 's-cancelled'" style="margin-left: auto">
            {{ v.active ? 'Disponible' : 'No disponible' }}
          </span>
        </div>

        <div class="field" style="margin: 0">
          <span :id="'l-days-' + v.id" class="lbl">Días de atención</span>
          <div class="dayset" role="group" :aria-labelledby="'l-days-' + v.id">
            <button
              v-for="d in WEEK"
              :key="d.n"
              type="button"
              class="chipbtn"
              :aria-pressed="v.days.includes(d.n)"
              @click="clinic.toggleDay(v, d.n)"
            >
              {{ d.l }}
            </button>
          </div>
        </div>

        <div class="two">
          <div class="field" style="margin: 0">
            <label :for="'from-' + v.id">Primera cita</label>
            <select :id="'from-' + v.id" v-model="v.from">
              <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
          <div class="field" style="margin: 0">
            <label :for="'to-' + v.id">Última cita</label>
            <select :id="'to-' + v.id" v-model="v.to">
              <option v-for="t in TIMES" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>
        <p v-if="v.from > v.to" class="err">La primera cita debe ser antes que la última.</p>

        <button class="btn" type="button" @click="v.active = !v.active">
          {{ v.active ? 'Marcar como no disponible' : 'Marcar como disponible' }}
        </button>
      </article>
    </div>

    <form class="panel" style="margin-top: 16px; max-width: 520px" novalidate @submit.prevent="addVet">
      <h2 style="margin-bottom: 14px">Agregar veterinario</h2>
      <div class="field">
        <label for="nv-name">Nombre</label>
        <input id="nv-name" v-model="newVet.name" type="text" placeholder="Dra. Nombre Apellido" />
      </div>
      <div class="field">
        <label for="nv-spec">Especialidad</label>
        <input id="nv-spec" v-model="newVet.spec" type="text" placeholder="Ej. Cirugía y ortopedia" />
        <span v-if="error" class="err">{{ error }}</span>
      </div>
      <button class="btn primary" type="submit">Agregar veterinario</button>
      <p class="hint" style="margin-top: 8px">Empieza con horario de lunes a sábado, de 09:00 a 17:30. Puedes ajustarlo arriba.</p>
    </form>
  </section>
</template>
