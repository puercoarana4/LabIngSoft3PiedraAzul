import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api.config';
import { AuthService } from '../services/auth.service';

/** Rutas del backend que no piden sesion: ahi no se manda el token. */
const esRutaPublica = (url: string) => url.startsWith(`${API_URL}/auth/`) || url.startsWith(`${API_URL}/public/`);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!req.url.startsWith(API_URL) || esRutaPublica(req.url)) {
    return next(req);
  }

  const token = auth.token();
  const peticion = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 con token enviado = el token vencio o ya no vale: se cierra la sesion
      if (error.status === 401 && token) {
        auth.logout();
        router.navigate(['/login'], { queryParams: { sesionExpirada: 1 } });
      }
      return throwError(() => error);
    }),
  );
};
