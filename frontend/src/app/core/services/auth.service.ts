import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL, ROL_ADMIN, ROL_PACIENTE } from '../api.config';
import { LoginRespuesta, Sesion } from '../models/auth.model';

const CLAVE_SESION = 'clinica_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _sesion = signal<Sesion | null>(this.leerSesionGuardada());

  /** Sesion actual (null si nadie ha iniciado sesion o el token ya vencio). */
  readonly sesion = this._sesion.asReadonly();
  readonly estaAutenticado = computed(() => this._sesion() !== null);
  readonly esAdmin = computed(() => this._sesion()?.roles.includes(ROL_ADMIN) ?? false);
  readonly esPaciente = computed(() => this._sesion()?.roles.includes(ROL_PACIENTE) ?? false);

  login(username: string, password: string): Observable<Sesion> {
    return this.http.post<LoginRespuesta>(`${API_URL}/auth/signin`, { username, password }).pipe(
      map((r) => ({ token: r.accessToken, username: r.username, email: r.email, roles: r.roles })),
      tap((sesion) => {
        this.guardar(sesion);
        this._sesion.set(sesion);
      }),
    );
  }

  logout(): void {
    this.borrar();
    this._sesion.set(null);
  }

  /** Token vigente o null. Si el token ya vencio, cierra la sesion. */
  token(): string | null {
    const sesion = this._sesion();
    if (!sesion) {
      return null;
    }
    if (this.estaVencido(sesion.token)) {
      this.logout();
      return null;
    }
    return sesion.token;
  }

  tieneAlgunRol(roles: string[]): boolean {
    const sesion = this._sesion();
    return !!sesion && roles.some((rol) => sesion.roles.includes(rol));
  }

  /** Pagina de inicio segun el rol del usuario. */
  rutaInicio(): string {
    if (this.esAdmin()) {
      return '/admin/citas';
    }
    if (this.esPaciente()) {
      return '/paciente/mis-citas';
    }
    return '/';
  }

  private leerSesionGuardada(): Sesion | null {
    try {
      const texto = typeof localStorage !== 'undefined' ? localStorage.getItem(CLAVE_SESION) : null;
      if (!texto) {
        return null;
      }
      const sesion = JSON.parse(texto) as Sesion;
      if (!sesion?.token || this.estaVencido(sesion.token)) {
        this.borrar();
        return null;
      }
      return sesion;
    } catch {
      this.borrar();
      return null;
    }
  }

  private guardar(sesion: Sesion): void {
    try {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } catch {
      // si el navegador no deja guardar, la sesion dura mientras la pestaña siga abierta
    }
  }

  private borrar(): void {
    try {
      localStorage.removeItem(CLAVE_SESION);
    } catch {
      // nada que borrar
    }
  }

  private estaVencido(token: string): boolean {
    try {
      const cuerpo = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(cuerpo)) as { exp?: number };
      return typeof exp === 'number' && exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
