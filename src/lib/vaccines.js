import { iso } from './dates';

/** Estado de una vacuna según su fecha de refuerzo. */
export function vax(v) {
  if (v.next < iso(0)) return { key: 'late', label: 'Vencida' };
  if (v.next <= iso(30)) return { key: 'soon', label: 'Próxima' };
  return { key: 'ok', label: 'Al día' };
}

/** Estado global de la mascota: el peor de sus vacunas. */
export function petVax(p) {
  const keys = p.vaccines.map((v) => vax(v).key);
  if (keys.includes('late')) return { key: 'late', label: 'Vacuna vencida' };
  if (keys.includes('soon')) return { key: 'soon', label: 'Vacuna próxima' };
  return { key: 'ok', label: 'Al día' };
}
