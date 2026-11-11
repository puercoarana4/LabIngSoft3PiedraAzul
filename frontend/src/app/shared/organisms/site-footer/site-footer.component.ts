import { Component } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'organismo-site-footer',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
})
export class SiteFooterComponent {
  readonly anio = new Date().getFullYear();
}
