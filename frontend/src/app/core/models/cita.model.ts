export interface Cita {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteCedula: string;
  medicoId: number;
  medicoNombre: string;
  especialidad: string;
  fechaHora: string;
  motivo: string;
}

export interface CitaNueva {
  pacienteId: number;
  medicoId: number;
  fechaHora: string;
  motivo: string;
}
