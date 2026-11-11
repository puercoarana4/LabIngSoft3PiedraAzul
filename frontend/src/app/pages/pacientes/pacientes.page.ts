import { Component, inject, OnInit, signal } from '@angular/core';
import { Paciente } from '../../core/models/paciente.model';
import { PacienteService } from '../../core/services/paciente.service';
import { PacienteFormComponent } from '../../shared/organisms/paciente-form/paciente-form.component';
import { PacientesListComponent } from '../../shared/organisms/pacientes-list/pacientes-list.component';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

/** Administrador: registrar y listar pacientes. */
@Component({
  selector: 'app-pacientes-page',
  standalone: true,
  imports: [MainLayoutTemplate, PacienteFormComponent, PacientesListComponent],
  templateUrl: './pacientes.page.html',
})
export class PacientesPage implements OnInit {
  private readonly pacienteService = inject(PacienteService);

  readonly pacientes = signal<Paciente[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.pacienteService.listar().subscribe({
      next: (lista) => {
        this.pacientes.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
