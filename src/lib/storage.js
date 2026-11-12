import { STORAGE_KEY } from './constants';
import { seed, normalize } from './seed';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const o = JSON.parse(raw);
      if (o && o.appts && o.pets && o.vets) return normalize(o);
    }
  } catch (e) {
    // Sin acceso a localStorage: se usan los datos de ejemplo.
  }
  return normalize(seed());
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Cuota llena o almacenamiento bloqueado: la app sigue funcionando sin guardar.
  }
}
