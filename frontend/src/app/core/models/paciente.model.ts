export interface Paciente {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface PacienteNuevo extends Omit<Paciente, 'id'> {
  password: string;
}
