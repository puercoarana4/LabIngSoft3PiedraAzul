import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { API_URL } from '../api.config';
import { iniciarSesionFalsa } from '../../testing/sesion-falsa';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  function arrancar(): void {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => {
    backend.verify();
    localStorage.clear();
  });

  it('agrega el JWT a las peticiones de rutas privadas', () => {
    const token = iniciarSesionFalsa('ROLE_ADMIN');
    arrancar();

    http.get(`${API_URL}/medicos`).subscribe();

    const req = backend.expectOne(`${API_URL}/medicos`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush([]);
  });

  it('no agrega el token en el listado público de médicos', () => {
    iniciarSesionFalsa('ROLE_ADMIN');
    arrancar();

    http.get(`${API_URL}/public/medicos`).subscribe();

    const req = backend.expectOne(`${API_URL}/public/medicos`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush([]);
  });

  it('no agrega el token en el inicio de sesión', () => {
    iniciarSesionFalsa('ROLE_ADMIN');
    arrancar();

    http.post(`${API_URL}/auth/signin`, {}).subscribe();

    const req = backend.expectOne(`${API_URL}/auth/signin`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('no manda el token a otros servidores', () => {
    iniciarSesionFalsa('ROLE_ADMIN');
    arrancar();

    http.get('https://otro-sitio.com/datos').subscribe();

    const req = backend.expectOne('https://otro-sitio.com/datos');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('si el backend responde 401 con token enviado, cierra la sesión', () => {
    iniciarSesionFalsa('ROLE_ADMIN');
    arrancar();

    http.get(`${API_URL}/citas`).subscribe({ error: () => undefined });
    backend.expectOne(`${API_URL}/citas`).flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem('clinica_sesion')).toBeNull();
  });
});
