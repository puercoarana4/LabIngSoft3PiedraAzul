import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cita } from '../../../core/models/cita.model';
import { Medico } from '../../../core/models/medico.model';
import { Paciente } from '../../../core/models/paciente.model';
import { CitaService } from '../../../core/services/cita.service';
import { fechaFutura } from '../../../core/validators/fechas.validator';
import { mensajeError } from '../../../core/utils/form-errors';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { SelectComponent, SelectOption } from '../../atoms/select/select.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

@Component({
  selector: 'organismo-cita-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputTextComponent, SelectComponent, ButtonComponent, AlertComponent],
  templateUrl: './cita-form.component.html',
  styleUrl: './cita-form.component.css',
})
export class CitaFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly citaService = inject(CitaService);

  private readonly listaPacientes = signal<Paciente[]>([]);
  private readonly listaMedicos = signal<Medico[]>([]);

  @Input() set pacientes(valor: Paciente[]) {
    this.listaPacientes.set(valor ?? []);
  }
  @Input() set medicos(valor: Medico[]) {
    this.listaMedicos.set(valor ?? []);
  }
  @Output() registrado = new EventEmitter<Cita>();

  readonly opcionesPacientes = computed<SelectOption[]>(() =>
    this.listaPacientes().map((p) => ({ value: String(p.id), label: `${p.nombres} ${p.apellidos} (${p.cedula})` })),
  );
  readonly opcionesMedicos = computed<SelectOption[]>(() =>
    this.listaMedicos().map((m) => ({ value: String(m.id), label: `${m.nombres} ${m.apellidos} – ${m.especialidad}` })),
  );

  readonly enviando = signal(false);
  readonly exito = signal('');
  readonly error = signal('');

  readonly form = this.fb.group({
    pacienteId: ['', Validators.required],
    medicoId: ['', Validators.required],
    fechaHora: ['', [Validators.required, fechaFutura]],
    motivo: ['', [Validators.required, Validators.maxLength(200)]],
  });

  errorDe(campo: keyof typeof this.form.controls): string {
    return mensajeError(this.form.controls[campo]);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.exito.set('');
    this.error.set('');
    const v = this.form.getRawValue();

    this.citaService
      .crear({
        pacienteId: Number(v.pacienteId),
        medicoId: Number(v.medicoId),
        fechaHora: v.fechaHora,
        motivo: v.motivo.trim(),
      })
      .subscribe({
        next: (cita) => {
          this.enviando.set(false);
          this.exito.set(`Cita creada para ${cita.pacienteNombre} con ${cita.medicoNombre}.`);
          this.form.reset();
          this.registrado.emit(cita);
        },
        error: (e: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(e.error?.message ?? 'No se pudo crear la cita. Intente de nuevo');
        },
      });
  }
}
