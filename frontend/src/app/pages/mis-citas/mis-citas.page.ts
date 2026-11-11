import { Component, inject, OnInit, signal } from '@angular/core';
import { Cita } from '../../core/models/cita.model';
import { CitaService } from '../../core/services/cita.service';
import { CitasListComponent } from '../../shared/organisms/citas-list/citas-list.component';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

/** Paciente: solo ve sus propias citas. */
@Component({
  selector: 'app-mis-citas-page',
  standalone: true,
  imports: [MainLayoutTemplate, CitasListComponent],
  templateUrl: './mis-citas.page.html',
})
export class MisCitasPage implements OnInit {
  private readonly citaService = inject(CitaService);

  readonly citas = signal<Cita[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.citaService.misCitas().subscribe({
      next: (lista) => {
        this.citas.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
