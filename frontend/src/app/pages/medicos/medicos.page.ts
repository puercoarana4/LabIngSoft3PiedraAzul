import { Component, inject, OnInit, signal } from '@angular/core';
import { Medico } from '../../core/models/medico.model';
import { MedicoService } from '../../core/services/medico.service';
import { MedicoFormComponent } from '../../shared/organisms/medico-form/medico-form.component';
import { MedicosListComponent } from '../../shared/organisms/medicos-list/medicos-list.component';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

/** Administrador: registrar y listar medicos. */
@Component({
  selector: 'app-medicos-page',
  standalone: true,
  imports: [MainLayoutTemplate, MedicoFormComponent, MedicosListComponent],
  templateUrl: './medicos.page.html',
})
export class MedicosPage implements OnInit {
  private readonly medicoService = inject(MedicoService);

  readonly medicos = signal<Medico[]>([]);
  readonly cargando = signal(true);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.medicoService.listar().subscribe({
      next: (lista) => {
        this.medicos.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
