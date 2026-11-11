import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Paciente } from '../../../core/models/paciente.model';
import { PacienteService } from '../../../core/services/paciente.service';
import { cedulaNoRegistrada, PATRON_CEDULA } from '../../../core/validators/cedula.validator';
import { fechaPasada } from '../../../core/validators/fechas.validator';
import { mensajeError } from '../../../core/utils/form-errors';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

@Component({
  selector: 'organismo-paciente-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputTextComponent, ButtonComponent, AlertComponent],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.css',
})
export class PacienteFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly pacienteService = inject(PacienteService);

  @Output() registrado = new EventEmitter<Paciente>();

  readonly enviando = signal(false);
  readonly exito = signal('');
  readonly error = signal('');

  readonly form = this.fb.group({
    cedula: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(PATRON_CEDULA)],
      asyncValidators: [cedulaNoRegistrada((c) => this.pacienteService.existeCedula(c))],
    }),
    nombres: ['', [Validators.required, Validators.maxLength(60)]],
    apellidos: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{7,10}$/)]],
    fechaNacimiento: ['', [Validators.required, fechaPasada]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
  });

  errorDe(campo: keyof typeof this.form.controls): string {
    const control = this.form.controls[campo];
    if (control.touched && control.errors?.['pattern']) {
      if (campo === 'cedula') return 'La cédula debe tener entre 6 y 12 dígitos';
      if (campo === 'telefono') return 'El teléfono debe tener entre 7 y 10 dígitos';
    }
    return mensajeError(control);
  }

  guardar(): void {
    if (this.form.pending) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.exito.set('');
    this.error.set('');

    this.pacienteService.registrar(this.form.getRawValue()).subscribe({
      next: (paciente) => {
        this.enviando.set(false);
        this.exito.set(
          `Paciente ${paciente.nombres} ${paciente.apellidos} registrado. Entra con su cédula y la contraseña inicial.`,
        );
        this.form.reset();
        this.registrado.emit(paciente);
      },
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(e.error?.message ?? 'No se pudo registrar el paciente. Intente de nuevo');
      },
    });
  }
}
