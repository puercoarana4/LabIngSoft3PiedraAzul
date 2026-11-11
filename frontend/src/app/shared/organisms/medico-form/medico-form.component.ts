import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Medico } from '../../../core/models/medico.model';
import { MedicoService } from '../../../core/services/medico.service';
import { cedulaNoRegistrada, PATRON_CEDULA } from '../../../core/validators/cedula.validator';
import { fechaPasada } from '../../../core/validators/fechas.validator';
import { mensajeError } from '../../../core/utils/form-errors';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { SelectComponent, SelectOption } from '../../atoms/select/select.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

@Component({
  selector: 'organismo-medico-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputTextComponent, SelectComponent, ButtonComponent, AlertComponent],
  templateUrl: './medico-form.component.html',
  styleUrl: './medico-form.component.css',
})
export class MedicoFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly medicoService = inject(MedicoService);

  @Output() registrado = new EventEmitter<Medico>();

  readonly enviando = signal(false);
  readonly exito = signal('');
  readonly error = signal('');

  readonly especialidades: SelectOption[] = [
    'Medicina general',
    'Cardiología',
    'Pediatría',
    'Dermatología',
    'Neurología',
    'Ginecología',
    'Ortopedia',
    'Oftalmología',
  ].map((e) => ({ value: e, label: e }));

  readonly generos: SelectOption[] = ['Femenino', 'Masculino', 'Otro'].map((g) => ({ value: g, label: g }));

  readonly form = this.fb.group({
    // La cedula se valida de forma asincrona contra el backend
    cedula: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(PATRON_CEDULA)],
      asyncValidators: [cedulaNoRegistrada((c) => this.medicoService.existeCedula(c))],
    }),
    nombres: ['', [Validators.required, Validators.maxLength(60)]],
    apellidos: ['', [Validators.required, Validators.maxLength(60)]],
    especialidad: ['', Validators.required],
    aniosTrabajando: [null as number | null, [Validators.required, Validators.min(0), Validators.max(60)]],
    genero: ['', Validators.required],
    fechaNacimiento: ['', [Validators.required, fechaPasada]],
  });

  errorDe(campo: keyof typeof this.form.controls): string {
    const control = this.form.controls[campo];
    if (campo === 'cedula' && control.touched && control.errors?.['pattern']) {
      return 'La cédula debe tener entre 6 y 12 dígitos';
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
    const v = this.form.getRawValue();

    this.medicoService.registrar({ ...v, aniosTrabajando: Number(v.aniosTrabajando) }).subscribe({
      next: (medico) => {
        this.enviando.set(false);
        this.exito.set(`Médico ${medico.nombres} ${medico.apellidos} registrado correctamente.`);
        this.form.reset();
        this.registrado.emit(medico);
      },
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(e.error?.message ?? 'No se pudo registrar el médico. Intente de nuevo');
      },
    });
  }
}
