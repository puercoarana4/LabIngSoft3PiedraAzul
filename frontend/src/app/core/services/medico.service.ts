import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../api.config';
import { Medico, MedicoNuevo } from '../models/medico.model';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly http = inject(HttpClient);

  /** Publico: no necesita sesion. */
  listarPublicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${API_URL}/public/medicos`);
  }

  /** Administrador. */
  listar(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${API_URL}/medicos`);
  }

  registrar(medico: MedicoNuevo): Observable<Medico> {
    return this.http.post<Medico>(`${API_URL}/medicos`, medico);
  }

  existeCedula(cedula: string): Observable<boolean> {
    return this.http
      .get<{ existe: boolean }>(`${API_URL}/medicos/existe/${encodeURIComponent(cedula)}`)
      .pipe(map((r) => r.existe));
  }
}
