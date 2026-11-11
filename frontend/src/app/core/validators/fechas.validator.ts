import { AbstractControl, ValidationErrors } from '@angular/forms';

/** La fecha debe ser anterior a hoy (fecha de nacimiento). */
export function fechaPasada(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) {
    return null;
  }
  return new Date(valor + 'T00:00:00') < new Date() ? null : { fechaPasada: true };
}

/** La fecha y hora deben ser posteriores a este momento (fecha de la cita). */
export function fechaFutura(control: AbstractControl): ValidationErrors | null {
  const valor = control.value as string;
  if (!valor) {
    return null;
  }
  return new Date(valor) > new Date() ? null : { fechaFutura: true };
}
