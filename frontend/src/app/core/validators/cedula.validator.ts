import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export const PATRON_CEDULA = /^\d{6,12}$/;

/**
 * Validador asincrono: consulta al backend si la cedula ya esta registrada.
 * Espera 400 ms despues de la ultima tecla (Angular cancela la consulta anterior
 * cuando el valor cambia) y no consulta hasta que la cedula tenga formato valido.
 */
export function cedulaNoRegistrada(consultar: (cedula: string) => Observable<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const cedula = String(control.value ?? '').trim();
    if (!PATRON_CEDULA.test(cedula)) {
      return of(null);
    }
    return timer(400).pipe(
      switchMap(() => consultar(cedula)),
      map((existe) => (existe ? { cedulaRegistrada: true } : null)),
      // si el servicio falla no bloqueamos el formulario; el backend igual responde 409
      catchError(() => of(null)),
    );
  };
}
