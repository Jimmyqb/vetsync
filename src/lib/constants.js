export const STORAGE_KEY = 'vetsync-v1';

// Cliente y veterinario que "inician sesión" en la demo.
export const OWNER = 'Ana Robles';
export const ME_VET = 'v1';

export const MAX_FILES = 6;

export const STATUS = {
  pending: 'Por confirmar',
  confirmed: 'Confirmada',
  live: 'En curso',
  done: 'Completada',
  cancelled: 'Cancelada'
};

export const URG = { routine: 'Rutina', soon: 'Pronto', urgent: 'Urgente' };

// Horas de inicio de cita. La clínica no agenda entre 13:30 y 14:30.
export const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

// Números de día según Date.getDay(). El domingo la clínica está cerrada.
export const WEEK = [
  { n: 1, l: 'Lun' }, { n: 2, l: 'Mar' }, { n: 3, l: 'Mié' },
  { n: 4, l: 'Jue' }, { n: 5, l: 'Vie' }, { n: 6, l: 'Sáb' }
];
