export interface Medico {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  especialidad: string;
  aniosTrabajando: number;
  genero: string;
  fechaNacimiento: string;
}

export type MedicoNuevo = Omit<Medico, 'id'>;
