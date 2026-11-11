import { booleanAttribute, Component, Input } from '@angular/core';
import { SiteFooterComponent } from '../../shared/organisms/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../shared/organisms/site-header/site-header.component';

/**
 * Plantilla de todas las paginas: cabecera con menu, titulo, contenido y pie.
 * - Contenido por defecto: zona principal.
 * - Contenido con el atributo [lateral]: columna a la izquierda (formularios).
 * Con dosColumnas la grilla pasa a 2 columnas en escritorio y a 1 en tableta y celular.
 */
@Component({
  selector: 'template-main-layout',
  standalone: true,
  imports: [SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './main-layout.template.html',
  styleUrl: './main-layout.template.css',
})
export class MainLayoutTemplate {
  @Input() titulo = '';
  @Input() subtitulo = '';
  @Input({ transform: booleanAttribute }) dosColumnas = false;
}
