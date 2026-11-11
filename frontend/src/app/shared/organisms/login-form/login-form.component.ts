import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { mensajeError } from '../../../core/utils/form-errors';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputTextComponent } from '../../atoms/input-text/input-text.component';
import { FormFieldComponent } from '../../molecules/form-field/form-field.component';

@Component({
  selector: 'organismo-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, InputTextComponent, ButtonComponent, AlertComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly sesionExpirada = this.route.snapshot.queryParamMap.has('sesionExpirada');
  readonly enviando = signal(false);
  readonly error = signal('');

  readonly form = this.fb.group({
    usuario: ['', Validators.required],
    clave: ['', Validators.required],
  });

  errorDe(campo: 'usuario' | 'clave'): string {
    return mensajeError(this.form.controls[campo]);
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const { usuario, clave } = this.form.getRawValue();

    this.auth.login(usuario.trim(), clave).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigateByUrl(this.destino());
      },
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(
          e.status === 401
            ? 'Usuario o contraseña incorrectos'
            : e.status === 0
              ? 'No hay conexión con el servidor. Revise que el backend esté encendido'
              : 'No se pudo iniciar sesión. Intente de nuevo',
        );
      },
    });
  }

  /** Vuelve a la pagina que el usuario queria abrir; solo acepta rutas internas. */
  private destino(): string {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    return redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : this.auth.rutaInicio();
  }
}
