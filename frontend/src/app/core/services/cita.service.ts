import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Cita, CitaNueva } from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly http = inject(HttpClient);

  /** Administrador: citas de todos los pacientes. */
  listarTodas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_URL}/citas`);
  }

  crear(cita: CitaNueva): Observable<Cita> {
    return this.http.post<Cita>(`${API_URL}/citas`, cita);
  }

  /** Paciente: solo sus citas (el backend lo saca del token). */
  misCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_URL}/citas/mis-citas`);
  }
}
