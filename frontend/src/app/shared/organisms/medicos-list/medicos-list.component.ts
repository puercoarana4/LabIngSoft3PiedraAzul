import { booleanAttribute, Component, computed, Input, signal } from '@angular/core';
import { Medico } from '../../../core/models/medico.model';
import { fechaCorta } from '../../../core/utils/formato';
import { ColumnaTabla } from '../../atoms/table/table.component';
import { TitledTableComponent } from '../../molecules/titled-table/titled-table.component';

@Component({
  selector: 'organismo-medicos-list',
  standalone: true,
  imports: [TitledTableComponent],
  templateUrl: './medicos-list.component.html',
})
export class MedicosListComponent {
  @Input() filas: readonly Medico[] = [];
  @Input() cargando = false;
  @Input() titulo = 'Listado de médicos';
  @Input() subtitulo = '';

  private readonly datosPersonales = signal(false);

  /** El listado publico no muestra cedula ni fecha de nacimiento. */
  @Input({ transform: booleanAttribute }) set mostrarDatosPersonales(valor: boolean) {
    this.datosPersonales.set(valor);
  }

  readonly columnas = computed<ColumnaTabla[]>(() => {
    const comunes: ColumnaTabla[] = [
      {
        clave: 'nombres',
        etiqueta: 'Médico',
        formato: (_v, fila) => `${(fila as Medico).nombres} ${(fila as Medico).apellidos}`,
      },
      { clave: 'especialidad', etiqueta: 'Especialidad' },
      { clave: 'aniosTrabajando', etiqueta: 'Años en la clínica' },
    ];
    if (!this.datosPersonales()) {
      return comunes;
    }
    return [
      { clave: 'cedula', etiqueta: 'Cédula' },
      ...comunes,
      { clave: 'genero', etiqueta: 'Género' },
      { clave: 'fechaNacimiento', etiqueta: 'Nacimiento', formato: (v) => fechaCorta(v) },
    ];
  });
}
