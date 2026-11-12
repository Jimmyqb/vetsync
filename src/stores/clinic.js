import { defineStore } from 'pinia';
import { loadState } from '../lib/storage';
import { seed, normalize } from '../lib/seed';
import { iso, nowHM, asDate, byTime } from '../lib/dates';
import { TIMES, OWNER } from '../lib/constants';

const EMPTY_PET = { name: '', owner: '', chip: '', weight: 0, history: [], vaccines: [] };

/** Datos de la clínica: veterinarios, mascotas y citas. Toda la lógica de negocio vive aquí. */
export const useClinic = defineStore('clinic', {
  state: () => loadState(),

  getters: {
    petOf: (s) => (id) => s.pets.find((p) => p.id === id) || EMPTY_PET,
    vetName: (s) => (id) => (s.vets.find((v) => v.id === id) || { name: '' }).name,
    apptById: (s) => (id) => s.appts.find((a) => a.id === id),
    activeVets: (s) => s.vets.filter((v) => v.active),
    myPets: (s) => s.pets.filter((p) => p.owner === OWNER),
    myAppts() {
      return this.appts.filter((a) => this.petOf(a.petId).owner === OWNER).sort(byTime);
    }
  },

  actions: {
    petName(id) {
      return this.petOf(id).name;
    },

    /** Horas del día para un veterinario: ocupadas, fuera de su horario o ya pasadas. */
    slotsFor(vetId, date, excludeId = null) {
      const v = this.vets.find((x) => x.id === vetId);
      const works = !!v && v.active && !!date && v.days.includes(asDate(date).getDay());
      return TIMES.map((t) => ({
        t,
        taken: this.appts.some(
          (a) => a.id !== excludeId && a.vetId === vetId && a.date === date && a.time === t && a.status !== 'cancelled'
        ),
        off: !works || t < v.from || t > v.to,
        past: date === iso(0) && t <= nowHM()
      }));
    },

    createAppointment(data) {
      this.appts.push({
        id: Date.now(),
        status: 'pending',
        chat: [],
        draft: null,
        result: null,
        waiting: false,
        ...data,
        files: data.files.slice()
      });
    },

    /** Cambia día, hora y datos de una cita. Vuelve a "Por confirmar". */
    reschedule(id, data) {
      const a = this.apptById(id);
      if (!a) return;
      Object.assign(a, data, { files: data.files.slice(), status: 'pending', waiting: false });
    },

    /** Cambia el estado de una cita y devuelve el mensaje para el aviso. */
    setStatus(id, status) {
      const a = this.apptById(id);
      const was = a.status;
      a.status = status;
      if (status === 'confirmed') return 'Cita confirmada';
      return was === 'pending' ? 'Cita rechazada' : 'Cita cancelada';
    },

    startConsult(id) {
      const a = this.apptById(id);
      a.status = 'live';
      a.waiting = false;
    },

    sendMessage(id, from, text) {
      const d = new Date();
      const at = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      this.apptById(id).chat.push({ from, text, at });
    },

    /** Cierra la consulta y pasa la nota al historial. Devuelve un error de validación o null. */
    finishConsult(id) {
      const a = this.apptById(id);
      const d = a.draft;
      if (d.dx.trim().length < 3) return 'Escribe el diagnóstico antes de finalizar.';
      const pet = this.petOf(a.petId);
      if (Number(d.weight) > 0) pet.weight = Number(d.weight);
      const follow = d.follow ? `${d.plan.trim() ? ' ' : ''}Seguimiento en ${d.follow}.` : '';
      pet.history.unshift({
        date: a.date, vetId: a.vetId, mode: a.mode, reason: a.reason,
        dx: d.dx.trim(), plan: d.plan.trim() + follow
      });
      a.result = { dx: d.dx.trim() };
      a.status = 'done';
      a.draft = null;
      return null;
    },

    addVet(name, spec) {
      if (name.trim().length < 3) return 'Escribe el nombre completo.';
      this.vets.push({
        id: `v${Date.now()}`, name: name.trim(), spec: spec.trim() || 'Medicina general',
        active: true, days: [1, 2, 3, 4, 5, 6], from: '09:00', to: '17:30'
      });
      return null;
    },

    toggleDay(vet, n) {
      const i = vet.days.indexOf(n);
      if (i >= 0) vet.days.splice(i, 1);
      else vet.days = [...vet.days, n].sort();
    },

    reset() {
      const fresh = normalize(seed());
      this.vets = fresh.vets;
      this.pets = fresh.pets;
      this.appts = fresh.appts;
    }
  }
});
