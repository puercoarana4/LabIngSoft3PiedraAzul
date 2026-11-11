import { TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

describe('TableComponent (átomo)', () => {
  function crear(entradas: Partial<TableComponent>) {
    TestBed.configureTestingModule({ imports: [TableComponent] });
    const fixture = TestBed.createComponent(TableComponent);
    Object.assign(fixture.componentInstance, entradas);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('dibuja una fila por registro y una cabecera por columna', () => {
    const el = crear({
      columnas: [
        { clave: 'a', etiqueta: 'Columna A' },
        { clave: 'b', etiqueta: 'Columna B', formato: (v) => `<${v}>` },
      ],
      filas: [{ a: 1, b: 2 }, { a: 3, b: 4 }],
    });
    expect(el.querySelectorAll('th').length).toBe(2);
    expect(el.querySelectorAll('tbody tr.fila').length).toBe(2);
    expect(el.querySelectorAll('td')[1].textContent).toBe('<2>');
  });

  it('muestra el mensaje cuando no hay filas', () => {
    const el = crear({ columnas: [{ clave: 'a', etiqueta: 'A' }], filas: [], mensajeVacio: 'Nada por aquí' });
    expect(el.querySelector('.estado')?.textContent).toContain('Nada por aquí');
  });
});
