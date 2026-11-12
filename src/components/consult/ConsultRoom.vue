<script setup>
import { computed } from 'vue';
import { useClinic } from '../../stores/clinic';
import { useUi } from '../../stores/ui';
import { URG } from '../../lib/constants';
import { fmt } from '../../lib/dates';
import { initials, chip } from '../../lib/format';
import WaitingRoom from './WaitingRoom.vue';
import VideoStage from './VideoStage.vue';
import ChatPanel from './ChatPanel.vue';
import AttachmentsPanel from './AttachmentsPanel.vue';
import ClinicalNote from './ClinicalNote.vue';

const clinic = useClinic();
const ui = useUi();

const appt = computed(() => clinic.apptById(ui.curId));
const pet = computed(() => clinic.petOf(appt.value.petId));
const isVet = computed(() => ui.role === 'vet');
// El cliente espera mientras el veterinario no inicia la consulta.
const waiting = computed(() => ui.role === 'owner' && appt.value.mode === 'tele' && appt.value.status === 'confirmed');
</script>

<template>
  <section v-if="appt">
    <button class="btn ghost back" type="button" @click="ui.leaveConsult()">← Volver</button>

    <div class="panel patient">
      <div class="avatar">{{ initials(pet.name) }}</div>
      <div>
        <h1 style="font-size: 26px">{{ pet.name }}</h1>
        <p class="meta">{{ pet.species }} · {{ pet.breed }} · {{ pet.age }} · {{ pet.owner }}</p>
      </div>
      <dl class="facts">
        <dt>Peso</dt><dd class="mono">{{ pet.weight.toFixed(1) }} kg</dd>
        <dt>Microchip</dt><dd class="mono">{{ chip(pet.chip) }}</dd>
      </dl>
    </div>

    <p class="reason">
      <span class="pill" :class="'u-' + appt.urgency">{{ URG[appt.urgency] }}</span>
      <span class="mode">{{ appt.mode === 'tele' ? 'Videoconsulta' : 'En la clínica' }} · {{ fmt(appt.date) }} {{ appt.time }}</span>
      <span>{{ appt.reason }}</span>
    </p>

    <div class="consult" :class="{ solo: !isVet }">
      <div class="callcol">
        <template v-if="appt.mode === 'tele'">
          <WaitingRoom v-if="waiting" :appt="appt" :pet="pet" />
          <VideoStage v-else :appt="appt" :pet="pet" />
          <ChatPanel :appt="appt" />
        </template>
        <AttachmentsPanel :appt="appt" />
      </div>
      <ClinicalNote v-if="isVet && appt.draft" :appt="appt" :pet="pet" />
    </div>
  </section>
</template>
