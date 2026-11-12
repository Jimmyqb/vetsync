import { defineStore } from 'pinia';
import { useClinic } from './clinic';

const TABS = {
  owner: [
    { id: 'home', label: 'Resumen' },
    { id: 'book', label: 'Agendar cita' },
    { id: 'pets', label: 'Mis mascotas' }
  ],
  vet: [
    { id: 'agenda', label: 'Agenda' },
    { id: 'patients', label: 'Pacientes' }
  ],
  admin: [
    { id: 'staff', label: 'Veterinarios' },
    { id: 'all', label: 'Agenda general' }
  ]
};
const HOME = { owner: 'home', vet: 'agenda', admin: 'staff' };

let toastTimer = null;

/** Estado de la interfaz: rol activo, pantalla, cita abierta, foto ampliada y avisos. */
export const useUi = defineStore('ui', {
  state: () => ({
    role: 'owner',
    view: 'home',
    curId: null,
    reschedId: null,
    bookPetId: null,
    zoom: null,
    toastMsg: ''
  }),

  getters: {
    tabs: (s) => TABS[s.role]
  },

  actions: {
    notify(msg) {
      this.toastMsg = msg;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { this.toastMsg = ''; }, 3500);
    },

    setRole(role) {
      this.role = role;
      this.reschedId = null;
      this.view = HOME[role];
    },

    go(view) {
      this.view = view;
      if (view !== 'book') this.reschedId = null;
    },

    startReschedule(id) {
      this.reschedId = id;
      this.view = 'book';
    },

    bookFor(petId) {
      this.reschedId = null;
      this.bookPetId = petId;
      this.view = 'book';
    },

    finishBooking() {
      this.reschedId = null;
      this.view = 'home';
    },

    openConsult(appt) {
      const clinic = useClinic();
      this.curId = appt.id;
      this.view = 'consult';
      if (this.role === 'owner' && appt.mode === 'tele' && appt.status === 'confirmed') appt.waiting = true;
      if (this.role === 'vet' && !appt.draft) {
        appt.draft = { weight: clinic.petOf(appt.petId).weight, temp: '', s: '', o: '', dx: '', plan: '', follow: '' };
      }
    },

    startConsult(appt) {
      useClinic().startConsult(appt.id);
      this.openConsult(appt);
    },

    leaveConsult() {
      const appt = useClinic().apptById(this.curId);
      if (appt && this.role === 'owner' && appt.status === 'confirmed') appt.waiting = false;
      this.view = this.role === 'vet' ? 'agenda' : 'home';
    }
  }
});
