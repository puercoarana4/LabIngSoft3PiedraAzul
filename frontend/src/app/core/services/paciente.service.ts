import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../api.config';
import { Paciente, PacienteNuevo } from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${API_URL}/pacientes`);
  }

  registrar(paciente: PacienteNuevo): Observable<Paciente> {
    return this.http.post<Paciente>(`${API_URL}/pacientes`, paciente);
  }

  existeCedula(cedula: string): Observable<boolean> {
    return this.http
      .get<{ existe: boolean }>(`${API_URL}/pacientes/existe/${encodeURIComponent(cedula)}`)
      .pipe(map((r) => r.existe));
  }
}
