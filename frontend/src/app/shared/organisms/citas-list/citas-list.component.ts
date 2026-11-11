import { booleanAttribute, Component, computed, Input, signal } from '@angular/core';
import { Cita } from '../../../core/models/cita.model';
import { fechaHora } from '../../../core/utils/formato';
import { ColumnaTabla } from '../../atoms/table/table.component';
import { TitledTableComponent } from '../../molecules/titled-table/titled-table.component';

/** Sirve para el administrador (con la columna del paciente) y para el paciente (sin ella). */
@Component({
  selector: 'organismo-citas-list',
  standalone: true,
  imports: [TitledTableComponent],
  templateUrl: './citas-list.component.html',
})
export class CitasListComponent {
  @Input() filas: readonly Cita[] = [];
  @Input() cargando = false;
  @Input() titulo = 'Listado de citas';
  @Input() subtitulo = '';
  @Input() mensajeVacio = 'Todavía no hay citas registradas';

  private readonly conPaciente = signal(true);

  @Input({ transform: booleanAttribute }) set mostrarPaciente(valor: boolean) {
    this.conPaciente.set(valor);
  }

  readonly columnas = computed<ColumnaTabla[]>(() => {
    const paciente: ColumnaTabla = {
      clave: 'pacienteNombre',
      etiqueta: 'Paciente',
      formato: (_v, fila) => `${(fila as Cita).pacienteNombre} (${(fila as Cita).pacienteCedula})`,
    };
    return [
      { clave: 'fechaHora', etiqueta: 'Fecha y hora', formato: (v) => fechaHora(v) },
      ...(this.conPaciente() ? [paciente] : []),
      { clave: 'medicoNombre', etiqueta: 'Médico' },
      { clave: 'especialidad', etiqueta: 'Especialidad' },
      { clave: 'motivo', etiqueta: 'Motivo' },
    ];
  });
}
