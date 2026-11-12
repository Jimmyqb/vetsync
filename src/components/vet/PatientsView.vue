<script setup>
import { computed, ref } from 'vue';
import { useClinic } from '../../stores/clinic';
import { initials, chip } from '../../lib/format';
import { petVax } from '../../lib/vaccines';

const clinic = useClinic();
const search = ref('');
const selId = ref(clinic.pets[0]?.id);

const found = computed(() => {
  const q = search.value.trim().toLowerCase();
  return clinic.pets.filter((p) => !q || `${p.name} ${p.owner} ${p.chip} ${p.species}`.toLowerCase().includes(q));
});
const selected = computed(() => clinic.pets.find((p) => p.id === selId.value));
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>Pacientes</h1>
        <p>Busca por mascota, dueño o microchip.</p>
      </div>
    </div>
    <div class="pac">
      <div class="panel">
        <label class="lbl" for="f-search" style="font-size: 13px; font-weight: 600">Buscar</label>
        <input id="f-search" v-model="search" type="search" placeholder="Canela, Ana, 98200…" />
        <ul class="plist">
          <li v-for="p in found" :key="p.id">
            <button type="button" :aria-current="selId === p.id" @click="selId = p.id">
              <span class="avatar">{{ initials(p.name) }}</span>
              <span><b>{{ p.name }}</b><br /><span class="meta">{{ p.species }} · {{ p.owner }}</span></span>
            </button>
          </li>
          <li v-if="!found.length" class="empty">Sin resultados.</li>
        </ul>
      </div>

      <div v-if="selected" class="panel">
        <div class="pet-top">
          <div class="avatar">{{ initials(selected.name) }}</div>
          <div>
            <h2>{{ selected.name }}</h2>
            <p class="meta">{{ selected.species }} · {{ selected.breed }} · {{ selected.age }}</p>
          </div>
          <span class="pill" :class="'v-' + petVax(selected).key" style="margin-left: auto">{{ petVax(selected).label }}</span>
        </div>
        <dl class="facts" style="margin-top: 14px">
          <dt>Dueño</dt><dd>{{ selected.owner }}</dd>
          <dt>Peso</dt><dd class="mono">{{ selected.weight.toFixed(1) }} kg</dd>
          <dt>Microchip</dt><dd class="mono">{{ chip(selected.chip) }}</dd>
        </dl>
        <h2 style="margin-top: 22px; font-size: 16px">Historial clínico</h2>
        <p v-if="!selected.history.length" class="empty">Aún no hay consultas registradas.</p>
        <ul v-else class="hist">
          <li v-for="(h, i) in selected.history" :key="i">
            <span class="d">{{ h.date }} · {{ h.mode === 'tele' ? 'Videoconsulta' : 'Clínica' }} · {{ clinic.vetName(h.vetId) }}</span>
            <p><b>{{ h.dx }}</b></p>
            <p class="meta">Motivo: {{ h.reason }}</p>
            <p v-if="h.plan" class="meta">Plan: {{ h.plan }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
