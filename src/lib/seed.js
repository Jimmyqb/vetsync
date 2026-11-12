import { iso } from './dates';
import { OWNER } from './constants';

/** Datos de ejemplo. Las fechas son relativas a hoy para que la demo siempre tenga citas. */
export function seed() {
  return {
    vets: [
      { id: 'v1', name: 'Dra. Mariana Ortega', spec: 'Medicina general y felinos' },
      { id: 'v2', name: 'Dr. Luis Valenzuela', spec: 'Dermatología y exóticos', active: true, days: [2, 4, 6], from: '10:00', to: '16:30' },
      { id: 'v3', name: 'Dra. Paola Ibarra', spec: 'Nutrición y telemedicina', active: true, days: [1, 2, 3, 4, 5], from: '09:00', to: '15:30' }
    ],
    pets: [
      {
        id: 'p1', name: 'Canela', species: 'Perro', breed: 'Labrador', age: '4 años', weight: 27.4, owner: OWNER, chip: '982000123456781',
        vaccines: [{ name: 'Rabia', next: iso(120) }, { name: 'Parvovirus', next: iso(11) }],
        history: [{ date: iso(-98), vetId: 'v1', mode: 'in', reason: 'Refuerzo anual', dx: 'Paciente sano', plan: 'Desparasitación y refuerzo de rabia aplicados.' }]
      },
      {
        id: 'p2', name: 'Miso', species: 'Gato', breed: 'Mestizo', age: '2 años', weight: 4.1, owner: OWNER, chip: '982000123456795',
        vaccines: [{ name: 'Triple felina', next: iso(-9) }, { name: 'Leucemia felina', next: iso(75) }],
        history: [{ date: iso(-40), vetId: 'v3', mode: 'tele', reason: 'Cambio de alimento', dx: 'Transición dietética', plan: 'Mezclar 25% del alimento nuevo cada 3 días.' }]
      },
      {
        id: 'p3', name: 'Rocky', species: 'Perro', breed: 'Bulldog francés', age: '6 años', weight: 13.8, owner: 'Jorge Ríos', chip: '982000123456803',
        vaccines: [{ name: 'Rabia', next: iso(200) }], history: []
      },
      {
        id: 'p4', name: 'Kiwi', species: 'Ave', breed: 'Cotorra argentina', age: '3 años', weight: 0.1, owner: 'Daniela Soto', chip: '982000123456817',
        vaccines: [], history: []
      }
    ],
    appts: [
      { id: 1, petId: 'p3', vetId: 'v1', date: iso(0), time: '09:00', mode: 'in', urgency: 'routine', reason: 'Se rasca la oreja izquierda desde hace tres días', status: 'done', chat: [], draft: null, result: { dx: 'Otitis externa leve' } },
      {
        id: 2, petId: 'p2', vetId: 'v1', date: iso(0), time: '10:30', mode: 'tele', urgency: 'soon', reason: 'Heces blandas desde el lunes después del cambio de alimento', status: 'confirmed', draft: null, result: null,
        chat: [{ from: 'owner', text: 'Buenas tardes, Miso sigue con las heces blandas pero come con normalidad.', at: '10:24' }]
      },
      { id: 3, petId: 'p1', vetId: 'v2', date: iso(0), time: '12:00', mode: 'in', urgency: 'routine', reason: 'Revisión de piel, caída de pelo en el lomo', status: 'confirmed', chat: [], draft: null, result: null },
      { id: 4, petId: 'p4', vetId: 'v1', date: iso(0), time: '16:00', mode: 'tele', urgency: 'urgent', reason: 'Está inflada y con las plumas esponjadas desde la mañana', status: 'pending', chat: [], draft: null, result: null },
      { id: 5, petId: 'p1', vetId: 'v1', date: iso(1), time: '09:30', mode: 'in', urgency: 'routine', reason: 'Refuerzo de parvovirus', status: 'pending', chat: [], draft: null, result: null },
      { id: 6, petId: 'p2', vetId: 'v3', date: iso(1), time: '10:00', mode: 'tele', urgency: 'routine', reason: 'Revisión de peso y plan de alimentación', status: 'confirmed', chat: [], draft: null, result: null },
      { id: 7, petId: 'p3', vetId: 'v1', date: iso(2), time: '11:00', mode: 'in', urgency: 'soon', reason: 'Revisión de oído y limpieza', status: 'confirmed', chat: [], draft: null, result: null }
    ]
  };
}

/** Completa campos que los datos guardados con versiones anteriores pueden no tener. */
export function normalize(o) {
  o.vets.forEach((v) => {
    if (!Array.isArray(v.days)) v.days = [1, 2, 3, 4, 5, 6];
    if (!v.from) v.from = '09:00';
    if (!v.to) v.to = '17:30';
    if (typeof v.active !== 'boolean') v.active = true;
  });
  o.appts.forEach((a) => {
    if (!Array.isArray(a.files)) a.files = [];
    if (!Array.isArray(a.chat)) a.chat = [];
    a.waiting = !!a.waiting;
  });
  return o;
}
