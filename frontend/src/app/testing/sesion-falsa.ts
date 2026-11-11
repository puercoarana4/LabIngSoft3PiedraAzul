/** Ayudas para las pruebas: crea un JWT de mentira (sin firma real) y lo deja guardado como sesion. */
export function crearToken(minutosDeVigencia = 30): string {
  const base64 = (obj: object) => btoa(JSON.stringify(obj)).replace(/=/g, '');
  const exp = Math.floor(Date.now() / 1000) + minutosDeVigencia * 60;
  return `${base64({ alg: 'HS256' })}.${base64({ sub: 'usuario', exp })}.firma`;
}

export function iniciarSesionFalsa(rol: 'ROLE_ADMIN' | 'ROLE_PACIENTE', token = crearToken()): string {
  localStorage.setItem(
    'clinica_sesion',
    JSON.stringify({ token, username: 'prueba', email: 'prueba@correo.com', roles: [rol] }),
  );
  return token;
}
