<script setup>
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { initials, chip } from '../../lib/format';
import { shortDate } from '../../lib/dates';
import { petVax } from '../../lib/vaccines';

const clinic = useClinic();
const ui = useUi();
</script>

<template>
  <section>
    <div class="head">
      <div>
        <h1>Mis mascotas</h1>
        <p>Ficha, peso y vacunas de cada una.</p>
      </div>
    </div>
    <div class="cards">
      <article v-for="p in clinic.myPets" :key="p.id" class="panel pet">
        <div class="pet-top">
          <div class="avatar">{{ initials(p.name) }}</div>
          <div>
            <h2>{{ p.name }}</h2>
            <p class="meta">{{ p.species }} · {{ p.breed }}</p>
          </div>
          <span class="pill" :class="'v-' + petVax(p).key" style="margin-left: auto">{{ petVax(p).label }}</span>
        </div>
        <dl class="facts">
          <dt>Edad</dt><dd>{{ p.age }}</dd>
          <dt>Peso</dt><dd class="mono">{{ p.weight.toFixed(1) }} kg</dd>
          <dt>Microchip</dt><dd class="mono">{{ chip(p.chip) }}</dd>
          <dt>Última visita</dt>
          <dd>{{ p.history.length ? shortDate(p.history[0].date) + ': ' + p.history[0].dx : 'Sin visitas' }}</dd>
        </dl>
        <button class="btn" type="button" @click="ui.bookFor(p.id)">Agendar cita para {{ p.name }}</button>
      </article>
    </div>
  </section>
</template>
