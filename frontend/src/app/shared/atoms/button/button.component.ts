import { booleanAttribute, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'atom-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() label = 'Enviar';
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() color: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) fullWidth = false;

  @HostBinding('class.ancho-total') get anchoTotal(): boolean {
    return this.fullWidth;
  }
}
