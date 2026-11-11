export interface Sesion {
  token: string;
  username: string;
  email: string;
  roles: string[];
}

/** Respuesta de POST /api/auth/signin */
export interface LoginRespuesta {
  accessToken: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}
