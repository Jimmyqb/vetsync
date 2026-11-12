<script setup>
import { computed } from 'vue';
import { useClinic } from './stores/clinic';
import { useUi } from './stores/ui';
import AppHeader from './components/shared/AppHeader.vue';
import TabBar from './components/shared/TabBar.vue';
import ImageZoom from './components/shared/ImageZoom.vue';
import ToastHost from './components/shared/ToastHost.vue';
import ClientHome from './components/client/ClientHome.vue';
import BookingForm from './components/client/BookingForm.vue';
import MyPets from './components/client/MyPets.vue';
import VetAgenda from './components/vet/VetAgenda.vue';
import PatientsView from './components/vet/PatientsView.vue';
import StaffView from './components/admin/StaffView.vue';
import AllAppointments from './components/admin/AllAppointments.vue';
import ConsultRoom from './components/consult/ConsultRoom.vue';

const clinic = useClinic();
const ui = useUi();

const SCREENS = {
  'owner:home': ClientHome,
  'owner:book': BookingForm,
  'owner:pets': MyPets,
  'vet:agenda': VetAgenda,
  'vet:patients': PatientsView,
  'admin:staff': StaffView,
  'admin:all': AllAppointments
};

const screen = computed(() => (ui.view === 'consult' ? ConsultRoom : SCREENS[`${ui.role}:${ui.view}`]));

function resetData() {
  clinic.reset();
  ui.setRole(ui.role);
  ui.notify('Datos de ejemplo restablecidos');
}
</script>

<template>
  <div class="shell">
    <AppHeader />
    <TabBar v-if="ui.view !== 'consult'" />
    <component :is="screen" :key="ui.role + ui.view + (ui.curId ?? '') + (ui.reschedId ?? '')" />
    <footer>
      <span>Prototipo de VetSync. Los datos viven solo en este navegador.</span>
      <button class="btn ghost" type="button" @click="resetData">Restablecer datos de ejemplo</button>
    </footer>
  </div>
  <ImageZoom />
  <ToastHost />
</template>
