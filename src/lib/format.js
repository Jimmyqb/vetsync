export const initials = (s) =>
  s
    .split(/\s+/)
    .filter((w) => w && !/^Dra?\.$/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Microchip en grupos de tres dígitos. */
export const chip = (c) => c.replace(/(\d{3})(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4 $5');

export const filesText = (appt) => {
  const n = (appt.files || []).length;
  return n ? `${n} ${n === 1 ? 'foto' : 'fotos'}` : '';
};
