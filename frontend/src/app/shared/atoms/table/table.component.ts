import { Component, Input } from '@angular/core';

export interface ColumnaTabla {
  clave: string;
  etiqueta: string;
  /** Si se define, transforma el valor antes de mostrarlo (fechas, nombres compuestos, etc.). */
  formato?: (valor: unknown, fila: object) => string;
}

@Component({
  selector: 'atom-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() columnas: ColumnaTabla[] = [];
  @Input() filas: readonly object[] = [];
  @Input() mensajeVacio = 'No hay registros para mostrar';
  @Input() cargando = false;

  valor(fila: object, columna: ColumnaTabla): string {
    const bruto = (fila as Record<string, unknown>)[columna.clave];
    if (columna.formato) {
      return columna.formato(bruto, fila);
    }
    return bruto === null || bruto === undefined || bruto === '' ? '—' : String(bruto);
  }
}
