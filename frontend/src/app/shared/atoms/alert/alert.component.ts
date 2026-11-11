import { Component, Input } from '@angular/core';

@Component({
  selector: 'atom-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent {
  @Input() tipo: 'exito' | 'error' | 'info' = 'info';
}
