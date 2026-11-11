import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent, NombreIcono } from '../../atoms/icon/icon.component';

/** Molecula: icono + texto dentro de un enlace del menu. */
@Component({
  selector: 'molecule-menu-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css',
})
export class MenuItemComponent {
  @Input({ required: true }) ruta = '/';
  @Input({ required: true }) etiqueta = '';
  @Input() icono: NombreIcono = 'cruz';
  @Input() exacto = false;
}
