import { Component, Input } from '@angular/core';
import { Paciente } from '../../../core/models/paciente.model';
import { fechaCorta } from '../../../core/utils/formato';
import { ColumnaTabla } from '../../atoms/table/table.component';
import { TitledTableComponent } from '../../molecules/titled-table/titled-table.component';

@Component({
  selector: 'organismo-pacientes-list',
  standalone: true,
  imports: [TitledTableComponent],
  templateUrl: './pacientes-list.component.html',
})
export class PacientesListComponent {
  @Input() filas: readonly Paciente[] = [];
  @Input() cargando = false;
  @Input() titulo = 'Listado de pacientes';

  readonly columnas: ColumnaTabla[] = [
    { clave: 'cedula', etiqueta: 'Cédula' },
    {
      clave: 'nombres',
      etiqueta: 'Paciente',
      formato: (_v, fila) => `${(fila as Paciente).nombres} ${(fila as Paciente).apellidos}`,
    },
    { clave: 'email', etiqueta: 'Correo' },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'fechaNacimiento', etiqueta: 'Nacimiento', formato: (v) => fechaCorta(v) },
  ];
}
