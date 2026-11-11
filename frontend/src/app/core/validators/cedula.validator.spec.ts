import { FormControl } from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { cedulaNoRegistrada } from './cedula.validator';

describe('cedulaNoRegistrada', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  async function validar(valor: string, consultar: (c: string) => Observable<boolean>) {
    const validador = cedulaNoRegistrada(consultar);
    let resultado: unknown = 'sin respuesta';
    (validador(new FormControl(valor)) as Observable<unknown>).subscribe((r) => (resultado = r));
    await vi.advanceTimersByTimeAsync(500);
    return resultado;
  }

  it('marca error si el servicio dice que la cédula ya existe', async () => {
    expect(await validar('1002003001', () => of(true))).toEqual({ cedulaRegistrada: true });
  });

  it('no marca error si la cédula está libre', async () => {
    expect(await validar('1002003001', () => of(false))).toBeNull();
  });

  it('no consulta al servicio si la cédula no tiene formato válido', async () => {
    const consultar = vi.fn(() => of(true));
    expect(await validar('abc', consultar)).toBeNull();
    expect(consultar).not.toHaveBeenCalled();
  });

  it('si el servicio falla no bloquea el formulario', async () => {
    expect(await validar('1002003001', () => throwError(() => new Error('caído')))).toBeNull();
  });
});
