import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MainLayoutTemplate } from '../../templates/main-layout/main-layout.template';

@Component({
  selector: 'app-acceso-denegado-page',
  standalone: true,
  imports: [RouterLink, MainLayoutTemplate],
  templateUrl: './acceso-denegado.page.html',
  styleUrl: './acceso-denegado.page.css',
})
export class AccesoDenegadoPage {
  protected readonly auth = inject(AuthService);
}
