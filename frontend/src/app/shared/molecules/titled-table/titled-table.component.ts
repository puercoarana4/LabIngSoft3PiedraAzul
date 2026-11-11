import { Component, Input } from '@angular/core';
import { ColumnaTabla, TableComponent } from '../../atoms/table/table.component';

/** Molecula: titulo + tabla reutilizable. */
@Component({
  selector: 'molecule-titled-table',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './titled-table.component.html',
  styleUrl: './titled-table.component.css',
})
export class TitledTableComponent {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input() columnas: ColumnaTabla[] = [];
  @Input() filas: readonly object[] = [];
  @Input() mensajeVacio = 'No hay registros para mostrar';
  @Input() cargando = false;
}
