/** Fecha corta para tablas: 12 nov 2026 */
export function fechaCorta(valor: unknown): string {
  if (!valor) return '—';
  const fecha = new Date(`${String(valor).slice(0, 10)}T00:00:00`);
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Fecha y hora para tablas de citas: 12 nov 2026, 10:30 a. m. */
export function fechaHora(valor: unknown): string {
  if (!valor) return '—';
  return new Date(String(valor)).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
}
