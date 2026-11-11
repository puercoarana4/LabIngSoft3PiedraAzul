import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Cita } from '../../core/models/cita.model';
import { Medico } from '../../core/models/medico.model';
import { Paciente } from '../../core/models/paciente.model';
import { CitaService } from '../../core/services/cita.service';
import { MedicoService } from '../../core/services/medico.service';
import { PacienteService } from '../../core/services/paciente.service';
import { CitaFormComponent } from '../../shared/organisms/cita-form/cita-form.component';
import { CitasListComponent } from '../../shared/organisms/citas-list/citas-list.component';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

/** Administrador: crear citas y ver las citas de todos los pacientes. */
@Component({
  selector: 'app-citas-page',
  standalone: true,
  imports: [MainLayoutTemplate, CitaFormComponent, CitasListComponent],
  templateUrl: './citas.page.html',
})
export class CitasPage implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly medicoService = inject(MedicoService);
  private readonly pacienteService = inject(PacienteService);

  readonly citas = signal<Cita[]>([]);
  readonly medicos = signal<Medico[]>([]);
  readonly pacientes = signal<Paciente[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    forkJoin({ medicos: this.medicoService.listar(), pacientes: this.pacienteService.listar() }).subscribe({
      next: ({ medicos, pacientes }) => {
        this.medicos.set(medicos);
        this.pacientes.set(pacientes);
      },
    });
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando.set(true);
    this.citaService.listarTodas().subscribe({
      next: (lista) => {
        this.citas.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
