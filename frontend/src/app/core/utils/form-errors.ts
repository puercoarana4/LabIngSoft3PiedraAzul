import { AbstractControl } from '@angular/forms';

/** Texto de error para mostrar debajo de un campo ('' si no hay nada que mostrar). */
export function mensajeError(control: AbstractControl | null): string {
  if (!control) {
    return '';
  }
  if (control.pending) {
    return 'Verificando…';
  }
  if (!control.invalid || !(control.touched || control.dirty)) {
    return '';
  }
  const e = control.errors ?? {};
  if (e['required']) return 'Este campo es obligatorio';
  if (e['cedulaRegistrada']) return 'Ya existe un registro con esta cédula';
  if (e['pattern']) return 'El formato no es válido';
  if (e['email']) return 'Escriba un correo válido';
  if (e['minlength']) return `Debe tener al menos ${e['minlength'].requiredLength} caracteres`;
  if (e['maxlength']) return `No puede pasar de ${e['maxlength'].requiredLength} caracteres`;
  if (e['min']) return `El valor mínimo es ${e['min'].min}`;
  if (e['max']) return `El valor máximo es ${e['max'].max}`;
  if (e['fechaPasada']) return 'La fecha debe ser anterior a hoy';
  if (e['fechaFutura']) return 'La fecha y hora deben ser posteriores a este momento';
  return 'Dato no válido';
}
