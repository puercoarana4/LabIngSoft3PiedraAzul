import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { iniciarSesionFalsa } from './testing/sesion-falsa';

describe('Rutas del frontend', () => {
  let router: Router;

  /** Se llama despues de dejar (o no) una sesion guardada, porque AuthService la lee al crearse. */
  function arrancar(): void {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    router = TestBed.inject(Router);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  describe('rutas públicas', () => {
    it('el inicio se abre sin sesión', async () => {
      arrancar();
      await router.navigateByUrl('/');
      expect(router.url).toBe('/');
    });

    it('el login se abre sin sesión', async () => {
      arrancar();
      await router.navigateByUrl('/login');
      expect(router.url).toBe('/login');
    });
  });

  describe('rutas privadas: acceso permitido por rol', () => {
    it.each(['/admin/medicos', '/admin/pacientes', '/admin/citas'])('el administrador entra a %s', async (url) => {
      iniciarSesionFalsa('ROLE_ADMIN');
      arrancar();
      await router.navigateByUrl(url);
      expect(router.url).toBe(url);
    });

    it('el paciente entra a /paciente/mis-citas', async () => {
      iniciarSesionFalsa('ROLE_PACIENTE');
      arrancar();
      await router.navigateByUrl('/paciente/mis-citas');
      expect(router.url).toBe('/paciente/mis-citas');
    });
  });

  describe('rutas privadas: acceso denegado', () => {
    it.each(['/admin/medicos', '/admin/pacientes', '/admin/citas', '/paciente/mis-citas'])(
      'sin sesión, %s manda al login (guard 1)',
      async (url) => {
        arrancar();
        await router.navigateByUrl(url);
        expect(router.url.startsWith('/login')).toBe(true);
        expect(router.url).toContain('redirect=');
      },
    );

    it.each(['/admin/medicos', '/admin/pacientes', '/admin/citas'])(
      'el paciente no entra a %s (guard 2)',
      async (url) => {
        iniciarSesionFalsa('ROLE_PACIENTE');
        arrancar();
        await router.navigateByUrl(url);
        expect(router.url).toBe('/acceso-denegado');
      },
    );

    it('el administrador no entra a /paciente/mis-citas (guard 2)', async () => {
      iniciarSesionFalsa('ROLE_ADMIN');
      arrancar();
      await router.navigateByUrl('/paciente/mis-citas');
      expect(router.url).toBe('/acceso-denegado');
    });

    it('un token vencido cuenta como no haber iniciado sesión', async () => {
      iniciarSesionFalsa('ROLE_ADMIN', crearTokenVencido());
      arrancar();
      await router.navigateByUrl('/admin/citas');
      expect(router.url.startsWith('/login')).toBe(true);
    });
  });
});

function crearTokenVencido(): string {
  const base64 = (obj: object) => btoa(JSON.stringify(obj)).replace(/=/g, '');
  return `${base64({ alg: 'HS256' })}.${base64({ sub: 'usuario', exp: 1 })}.firma`;
}
