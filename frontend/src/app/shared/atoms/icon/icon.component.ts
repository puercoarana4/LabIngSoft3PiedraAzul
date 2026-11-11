import { Component, Input } from '@angular/core';

export type NombreIcono =
  | 'cruz'
  | 'calendario'
  | 'usuario'
  | 'usuarios'
  | 'estetoscopio'
  | 'salir'
  | 'menu'
  | 'cerrar'
  | 'telefono'
  | 'correo'
  | 'reloj'
  | 'pin'
  | 'pulso'
  | 'escudo';

@Component({
  selector: 'atom-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  @Input() nombre: NombreIcono = 'cruz';
  @Input() tamano = 20;
}
