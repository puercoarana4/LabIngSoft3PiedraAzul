import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Medico } from '../../core/models/medico.model';
import { AuthService } from '../../core/services/auth.service';
import { MedicoService } from '../../core/services/medico.service';
import { MedicosListComponent } from '../../shared/organisms/medicos-list/medicos-list.component';
import { InfoCardComponent } from '../../shared/molecules/info-card/info-card.component';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

/** Publica: presentacion de la clinica y listado de medicos (no pide sesion). */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, MainLayoutTemplate, MedicosListComponent, InfoCardComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly medicoService = inject(MedicoService);
  protected readonly auth = inject(AuthService);

  readonly medicos = signal<Medico[]>([]);
  readonly cargando = signal(true);
  readonly error = signal(false);

  ngOnInit(): void {
    this.medicoService.listarPublicos().subscribe({
      next: (lista) => {
        this.medicos.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
  }
}
