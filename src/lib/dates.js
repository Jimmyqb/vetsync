import { TIMES } from './constants';

export const pad = (n) => String(n).padStart(2, '0');
export const isoD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Fecha ISO (AAAA-MM-DD) de hoy más `off` días. */
export function iso(off = 0) {
  const d = new Date();
  d.setDate(d.getDate() + off);
  return isoD(d);
}

export const nowHM = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const asDate = (s) => new Date(`${s}T12:00:00`);

const fmtOpt = (opts) => (s) => new Intl.DateTimeFormat('es-MX', opts).format(asDate(s));
export const fmt = fmtOpt({ weekday: 'short', day: 'numeric', month: 'short' });
export const longDate = fmtOpt({ weekday: 'long', day: 'numeric', month: 'long' });
export const shortDate = fmtOpt({ day: 'numeric', month: 'short', year: 'numeric' });
export const wday = fmtOpt({ weekday: 'short' });
export const mon = fmtOpt({ month: 'short' });
export const dm = fmtOpt({ day: 'numeric', month: 'short' });
export const dnum = (s) => asDate(s).getDate();

export const byTime = (a, b) => (a.date + a.time).localeCompare(b.date + b.time);

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
}

/** Próximos días agendables: hasta 10, sin domingos. */
export function bookingDays() {
  const out = [];
  for (let i = 0; i < 14 && out.length < 10; i++) {
    const d = iso(i);
    if (asDate(d).getDay() === 0) continue;
    if (i === 0 && TIMES[TIMES.length - 1] <= nowHM()) continue;
    out.push(d);
  }
  return out;
}

/** Lunes a sábado de la semana (desplazada `offset` semanas). En domingo muestra la semana siguiente. */
export function weekDates(offset = 0) {
  const d = new Date();
  const dow = d.getDay();
  d.setDate(d.getDate() + (dow === 0 ? 1 : 1 - dow) + 7 * offset);
  return Array.from({ length: 6 }, (_, i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    return isoD(x);
  });
}
