import { Component, Input } from '@angular/core';
import { IconComponent, NombreIcono } from '../../atoms/icon/icon.component';

@Component({
  selector: 'molecule-info-card',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './info-card.component.html',
  styleUrl: './info-card.component.css',
})
export class InfoCardComponent {
  @Input() icono: NombreIcono = 'cruz';
  @Input() titulo = '';
}
