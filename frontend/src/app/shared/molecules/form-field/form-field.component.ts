import { Component, Input } from '@angular/core';

/** Envuelve un campo (atomo) y le agrega el mensaje de error debajo. */
@Component({
  selector: 'molecule-form-field',
  standalone: true,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.css',
})
export class FormFieldComponent {
  @Input() error = '';
}
