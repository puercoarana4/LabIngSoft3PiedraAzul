import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard 2: deja pasar solo si el rol del usuario esta en data.roles de la ruta.
 * Ejemplo: { path: 'admin/medicos', canActivate: [autenticacionGuard, rolGuard], data: { roles: [ROL_ADMIN] } }
 */
export const rolGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.token()) {
    return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
  }
  const rolesPermitidos = (route.data['roles'] as string[] | undefined) ?? [];
  if (auth.tieneAlgunRol(rolesPermitidos)) {
    return true;
  }
  return router.createUrlTree(['/acceso-denegado']);
};
